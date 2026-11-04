/**
 * CLI-засев базы: node scripts/seed.ts (или npm run db:seed).
 * База создаётся, применяются миграции и демо-контент.
 */
import { count } from "drizzle-orm";
import { getSqlite, db } from "../src/db/index";
import {
  topics,
  articles,
  myths,
  ideas,
  sources,
  states,
  topicLinks,
} from "../src/db/schema";

getSqlite();

const rows: Array<[string, () => number]> = [
  ["темы", () => db.select({ n: count() }).from(topics).get()!.n],
  ["статьи", () => db.select({ n: count() }).from(articles).get()!.n],
  ["мифы", () => db.select({ n: count() }).from(myths).get()!.n],
  ["идеи", () => db.select({ n: count() }).from(ideas).get()!.n],
  ["источники", () => db.select({ n: count() }).from(sources).get()!.n],
  ["состояния", () => db.select({ n: count() }).from(states).get()!.n],
  ["связи тем", () => db.select({ n: count() }).from(topicLinks).get()!.n],
];

for (const [name, fn] of rows) {
  console.log(`${name}: ${fn()}`);
}
console.log("База готова: data/atlas.db");
