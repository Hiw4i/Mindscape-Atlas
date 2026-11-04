import { eq, ne, and } from "drizzle-orm";
import { db } from "@/db";
import { articles, ideaTopics, ideas, myths, states, tags, topics } from "@/db/schema";
import { slugify } from "@/lib/slug";
import { buildSearchText } from "@/lib/content";
import {
  buildTopicIndex,
  getArticleById,
  getAllArticlesForAdmin,
  getAllIdeasForAdmin,
  getAllSourcesForAdmin,
  getAllTopics,
  getArticleTags,
  getArticleTopics,
  getMythTopics,
  getPublishedMyths,
  getStatesList,
  getTopicAncestors,
} from "@/lib/queries";

/* Опции для форм: сгруппированные подписи */

export interface ItemOption {
  id: number;
  label: string;
}

export function topicOptions(): ItemOption[] {
  const all = getAllTopics();
  const index = buildTopicIndex();
  return all.map((t) => {
    const chain = getTopicAncestors(t, index);
    const prefix = chain.map((a) => a.title).join(" · ");
    return { id: t.id, label: prefix ? `${prefix} · ${t.title}` : `${t.title} (раздел)` };
  });
}

export function sourceOptions(): ItemOption[] {
  return getAllSourcesForAdmin().map((s) => ({ id: s.id, label: s.title }));
}

export function ideaOptions(excludeId?: number): ItemOption[] {
  return getAllIdeasForAdmin()
    .filter((i) => i.id !== excludeId)
    .map((i) => ({ id: i.id, label: i.title }));
}

export function stateOptions(): ItemOption[] {
  return getStatesList().map((s) => ({ id: s.id, label: s.title }));
}

export function articleOptions(excludeId?: number): ItemOption[] {
  return getAllArticlesForAdmin()
    .filter((a) => a.id !== excludeId)
    .map((a) => ({ id: a.id, label: a.title }));
}

export function mythOptions(): ItemOption[] {
  return getPublishedMyths().map((m) => ({ id: m.id, label: m.statement }));
}

/** Уникальный slug для сущности: при конфликте добавляется -2, -3... */
export function uniquifySlug(
  base: string,
  kind: "articles" | "myths" | "topics" | "states" | "tags",
  excludeId?: number
): string {
  const root = slugify(base);
  let candidate = root;
  let i = 2;
  for (;;) {
    if (!slugExists(kind, candidate, excludeId)) return candidate;
    candidate = `${root}-${i++}`;
  }
}

function slugExists(
  kind: "articles" | "myths" | "topics" | "states" | "tags",
  slug: string,
  excludeId?: number
): boolean {
  let rows: { id: number }[];
  switch (kind) {
    case "articles": {
      const where = excludeId
        ? and(eq(articles.slug, slug), ne(articles.id, excludeId))
        : eq(articles.slug, slug);
      rows = db.select({ id: articles.id }).from(articles).where(where).all();
      break;
    }
    case "myths": {
      const where = excludeId
        ? and(eq(myths.slug, slug), ne(myths.id, excludeId))
        : eq(myths.slug, slug);
      rows = db.select({ id: myths.id }).from(myths).where(where).all();
      break;
    }
    case "topics": {
      const where = excludeId
        ? and(eq(topics.slug, slug), ne(topics.id, excludeId))
        : eq(topics.slug, slug);
      rows = db.select({ id: topics.id }).from(topics).where(where).all();
      break;
    }
    case "states": {
      const where = excludeId
        ? and(eq(states.slug, slug), ne(states.id, excludeId))
        : eq(states.slug, slug);
      rows = db.select({ id: states.id }).from(states).where(where).all();
      break;
    }
    case "tags": {
      const where = excludeId
        ? and(eq(tags.slug, slug), ne(tags.id, excludeId))
        : eq(tags.slug, slug);
      rows = db.select({ id: tags.id }).from(tags).where(where).all();
      break;
    }
  }
  return rows.length > 0;
}

/** Парсинг строки тегов "тревога, стыд" в массив id тегов (с созданием новых). */
export function ensureTagIds(input: string): number[] {
  const names = input.split(",").map((s) => s.trim()).filter(Boolean);
  const ids: number[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();
    if (existing) {
      if (!ids.includes(existing.id)) ids.push(existing.id);
      continue;
    }
    const created = db
      .insert(tags)
      .values({ slug: uniquifySlug(name, "tags"), name, synonyms: "" })
      .returning({ id: tags.id })
      .get();
    ids.push(created.id);
  }
  return ids;
}

/** Пересборка денормализованной поисковой строки статьи. */
export function refreshArticleSearch(id: number): void {
  const a = getArticleById(id);
  if (!a) return;
  const topicRows = getArticleTopics(id);
  const tagRows = getArticleTags(id);
  const text = buildSearchText([
    a.title,
    a.question,
    a.summary,
    a.content,
    a.misconceptions,
    a.examples,
    a.takeaways,
    topicRows.map((t) => t.title).join(" "),
    tagRows.map((t) => `${t.name} ${t.synonyms}`).join(" "),
  ]);
  db.update(articles).set({ searchText: text }).where(eq(articles.id, id)).run();
}

export function refreshMythSearch(id: number): void {
  const m = db.select().from(myths).where(eq(myths.id, id)).get();
  if (!m) return;
  const topicRows = getMythTopics(id);
  const text = buildSearchText([
    m.statement,
    m.whyBelieve,
    m.evidence,
    m.unknown,
    m.better,
    topicRows.map((t) => t.title).join(" "),
  ]);
  db.update(myths).set({ searchText: text }).where(eq(myths.id, id)).run();
}

export function refreshIdeaSearch(id: number): void {
  const i = db.select().from(ideas).where(eq(ideas.id, id)).get();
  if (!i) return;
  const topicRows = db
    .select({ title: topics.title })
    .from(ideaTopics)
    .innerJoin(topics, eq(topics.id, ideaTopics.topicId))
    .where(eq(ideaTopics.ideaId, id))
    .all();
  const text = buildSearchText([i.title, i.text, i.quote, topicRows.map((t) => t.title).join(" ")]);
  db.update(ideas).set({ searchText: text }).where(eq(ideas.id, id)).run();
}
