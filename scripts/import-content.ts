/**
 * Импорт контента из content/atlas-content.json в базу данных.
 * Полностью замещает текущий контент. Файл базы (data/atlas.db) и
 * настройки в .env.local не затрагиваются.
 *
 * Запуск: npm run content:import
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getTableName } from "drizzle-orm";
import { getSqlite } from "../src/db/index";
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

const IN_FILE = path.join(process.cwd(), "content", "atlas-content.json");

type Row = Record<string, unknown>;

const parsed = JSON.parse(readFileSync(IN_FILE, "utf8")) as Record<string, unknown>;
if (parsed.format !== "mindscape-atlas-content") {
  throw new Error("Неизвестный формат файла контента");
}
const data = parsed as Record<string, Row[]>;

const sqlite = getSqlite();

// Порядок удаления и вставки соблюдает внешние ключи
const WIPE = [
  articleIdeas, articleSources, articleTags, articleTopics,
  ideaTopics, ideaTags, mythTopics, mythTags, mythSources,
  stateArticles, stateTopics, stateMyths,
  topicLinks, ideaRelations,
  ideas, myths, articles, sources, tags, states, topics,
];

const INSERT_ORDER = [
  topics, tags, sources, articles, myths, ideas, states,
  articleTopics, articleTags, articleSources, articleIdeas,
  mythTopics, mythTags, mythSources,
  ideaTopics, ideaTags,
  stateArticles, stateTopics, stateMyths,
  topicLinks, ideaRelations,
];

sqlite.pragma("foreign_keys = OFF");
sqlite.transaction(() => {
  for (const table of WIPE) {
    sqlite.prepare(`DELETE FROM ${getTableName(table)}`).run();
  }
  for (const table of INSERT_ORDER) {
    const name = getTableName(table);
    const rows = data[name] ?? [];
    for (const row of rows) {
      const columns = Object.keys(row);
      const placeholders = columns.map(() => "?").join(", ");
      sqlite
        .prepare(
          `INSERT INTO ${name} (${columns.join(", ")}) VALUES (${placeholders})`
        )
        .run(...columns.map((c) => row[c]));
    }
    console.log(`${name}: ${rows.length}`);
  }
})();
sqlite.pragma("foreign_keys = ON");

console.log("Импорт завершён.");
