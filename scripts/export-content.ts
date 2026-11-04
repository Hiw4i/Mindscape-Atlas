/**
 * Экспорт всего контента базы в текстовый JSON: content/atlas-content.json.
 * Этот файл версионируется в git - так контент публичного репозитория
 * можно просмотреть в диффе перед коммитом.
 *
 * Запуск: npm run content:export
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTableColumns, getTableName } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "../src/db/index";
import {
  topics,
  tags,
  sources,
  articles,
  myths,
  ideas,
  states,
  articleTopics,
  articleTags,
  articleSources,
  articleIdeas,
  mythTopics,
  mythTags,
  mythSources,
  ideaTopics,
  ideaTags,
  stateArticles,
  stateTopics,
  stateMyths,
  topicLinks,
  ideaRelations,
} from "../src/db/schema";

const OUT_DIR = path.join(process.cwd(), "content");
const OUT_FILE = path.join(OUT_DIR, "atlas-content.json");

/**
 * Ключи строк конвертируются из имён полей drizzle (camelCase) в имена
 * колонок базы (snake_case), чтобы импорт мог вставлять их напрямую.
 */
function toDbRows(
  table: SQLiteTable,
  rows: Array<Record<string, unknown>>
): Record<string, unknown>[] {
  const cols = getTableColumns(table) as Record<string, { name: string }>;
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [cols[key]?.name ?? key, value])
    )
  );
}

function section(
  table: SQLiteTable,
  rows: Array<Record<string, unknown>>
): [string, unknown] {
  const sorted = [...rows].sort(
    (a, b) => Number(a.id ?? 0) - Number(b.id ?? 0)
  );
  return [getTableName(table), toDbRows(table, sorted)];
}

function dump(): Record<string, unknown> {
  return Object.fromEntries([
    ["format", "mindscape-atlas-content"],
    ["version", 1],
    section(topics, db.select().from(topics).all()),
    section(tags, db.select().from(tags).all()),
    section(sources, db.select().from(sources).all()),
    section(articles, db.select().from(articles).all()),
    section(myths, db.select().from(myths).all()),
    section(ideas, db.select().from(ideas).all()),
    section(states, db.select().from(states).all()),
    section(articleTopics, db.select().from(articleTopics).all()),
    section(articleTags, db.select().from(articleTags).all()),
    section(articleSources, db.select().from(articleSources).all()),
    section(articleIdeas, db.select().from(articleIdeas).all()),
    section(mythTopics, db.select().from(mythTopics).all()),
    section(mythTags, db.select().from(mythTags).all()),
    section(mythSources, db.select().from(mythSources).all()),
    section(ideaTopics, db.select().from(ideaTopics).all()),
    section(ideaTags, db.select().from(ideaTags).all()),
    section(stateArticles, db.select().from(stateArticles).all()),
    section(stateTopics, db.select().from(stateTopics).all()),
    section(stateMyths, db.select().from(stateMyths).all()),
    section(topicLinks, db.select().from(topicLinks).all()),
    section(ideaRelations, db.select().from(ideaRelations).all()),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
const data = dump();
const counts = Object.entries(data)
  .filter(([key]) => key !== "format" && key !== "version")
  .map(([key, value]) => `${key}: ${(value as unknown[]).length}`)
  .join(", ");
writeFileSync(OUT_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Экспортировано в ${OUT_FILE}`);
console.log(counts);
