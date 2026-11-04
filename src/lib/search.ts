import { getSqlite } from "@/db";
import type { Article, Idea, Myth, State, Topic } from "@/db/schema";
import { db } from "@/db";
import { articles, ideas, myths, states, topics } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export interface SearchHit<T> {
  row: T;
  snippet: string;
}

export interface SearchResults {
  articles: SearchHit<Article>[];
  myths: SearchHit<Myth>[];
  ideas: SearchHit<Idea>[];
  topics: Topic[];
  states: State[];
  query: string;
}

function tokenize(q: string): string[] {
  return (q.match(/[\p{L}\p{N}]+/gu) ?? []).slice(0, 8);
}

function likeEscape(q: string): string {
  return q.replace(/[\\%_]/g, (c) => "\\" + c);
}

interface FtsRow {
  id: number;
  snip: string;
}

function ftsQuery(table: string, match: string, limit: number): FtsRow[] {
  const sqlite = getSqlite();
  const stmt = sqlite.prepare(
    `SELECT rowid AS id, snippet(${table}, -1, '<mark>', '</mark>', '…', 16) AS snip
     FROM ${table}
     WHERE ${table} MATCH ?
     ORDER BY bm25(${table})
     LIMIT ?`
  );
  return stmt.all(match, limit) as FtsRow[];
}

/**
 * Полнотекстовый поиск по статьям, мифам и идеям (FTS5) плюс
 * подбор тем и состояний. Префиксный поиск: "трево" найдёт "тревога".
 */
export function searchAll(q: string, includeDrafts = false): SearchResults {
  const query = q.trim();
  const empty: SearchResults = {
    articles: [],
    myths: [],
    ideas: [],
    topics: [],
    states: [],
    query,
  };
  if (!query) return empty;

  const tokens = tokenize(query);
  const match = tokens.map((t) => t + "*").join(" OR ");
  const hasTokens = tokens.length > 0;
  const results = empty;

  /* Статьи */
  if (hasTokens) {
    try {
      const fts = ftsQuery("articles_fts", match, 30);
      const ids = fts.map((r) => r.id);
      const rows = ids.length
        ? db.select().from(articles).where(inArray(articles.id, ids)).all()
        : [];
      const snipMap = new Map(fts.map((r) => [r.id, r.snip]));
      for (const row of rows) {
        if (!includeDrafts && row.status !== "published") continue;
        results.articles.push({ row, snippet: snipMap.get(row.id) ?? "" });
      }
      results.articles.sort((a, b) => ids.indexOf(a.row.id) - ids.indexOf(b.row.id));
    } catch {
      /* некорректный FTS-запрос: тихо переходим к LIKE-поиску */
    }
  }
  if (!results.articles.length) {
    const like = `%${likeEscape(query)}%`;
    const rows = db
      .select()
      .from(articles)
      .all()
      .filter(
        (a) =>
          (includeDrafts || a.status === "published") &&
          (a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.searchText.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 30);
    results.articles = rows.map((row) => ({
      row,
      snippet: (row.summary || row.content).slice(0, 200),
    }));
  }

  /* Мифы */
  if (hasTokens) {
    try {
      const fts = ftsQuery("myths_fts", match, 20);
      const ids = fts.map((r) => r.id);
      const rows = ids.length
        ? db.select().from(myths).where(inArray(myths.id, ids)).all()
        : [];
      const snipMap = new Map(fts.map((r) => [r.id, r.snip]));
      for (const row of rows) {
        if (!includeDrafts && row.status !== "published") continue;
        results.myths.push({ row, snippet: snipMap.get(row.id) ?? "" });
      }
    } catch {
      /* как выше */
    }
  }
  if (!results.myths.length) {
    const lower = query.toLowerCase();
    const rows = db
      .select()
      .from(myths)
      .all()
      .filter(
        (m) =>
          (includeDrafts || m.status === "published") &&
          (m.statement.toLowerCase().includes(lower) ||
            m.searchText.toLowerCase().includes(lower))
      )
      .slice(0, 20);
    results.myths = rows.map((row) => ({ row, snippet: row.statement }));
  }

  /* Идеи */
  if (hasTokens) {
    try {
      const fts = ftsQuery("ideas_fts", match, 20);
      const ids = fts.map((r) => r.id);
      const rows = ids.length
        ? db.select().from(ideas).where(inArray(ideas.id, ids)).all()
        : [];
      const snipMap = new Map(fts.map((r) => [r.id, r.snip]));
      for (const row of rows) {
        if (!includeDrafts && row.status !== "published") continue;
        results.ideas.push({ row, snippet: snipMap.get(row.id) ?? "" });
      }
    } catch {
      /* как выше */
    }
  }
  if (!results.ideas.length) {
    const lower = query.toLowerCase();
    const rows = db
      .select()
      .from(ideas)
      .all()
      .filter(
        (i) =>
          (includeDrafts || i.status === "published") &&
          (i.title.toLowerCase().includes(lower) ||
            i.searchText.toLowerCase().includes(lower))
      )
      .slice(0, 20);
    results.ideas = rows.map((row) => ({ row, snippet: row.text.slice(0, 200) }));
  }

  /* Темы и состояния: поиск по названию и описанию */
  const lower = query.toLowerCase();
  results.topics = db
    .select()
    .from(topics)
    .all()
    .filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower)
    )
    .slice(0, 12);
  results.states = db
    .select()
    .from(states)
    .all()
    .filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower)
    )
    .slice(0, 8);

  return results;
}
