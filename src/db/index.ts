import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { ensureFts } from "./fts";
import { ensureSeed } from "./seed";

export type Db = BetterSQLite3Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  __atlasDb?: Db;
  __atlasSqlite?: Database.Database;
};

function createDb(): Db {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new Database(path.join(dataDir, "atlas.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const instance = drizzle(sqlite, { schema });
  migrate(instance, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  ensureFts(sqlite);

  // Первый запуск: наполняем пустую базу демонстрационными материалами.
  ensureSeed(instance);

  globalForDb.__atlasSqlite = sqlite;
  return instance;
}

export const db: Db = globalForDb.__atlasDb ??= createDb();

/** Прямой доступ к sqlite для FTS-запросов и служебных операций. */
export function getSqlite(): Database.Database {
  if (!globalForDb.__atlasSqlite) createDb();
  return globalForDb.__atlasSqlite!;
}
