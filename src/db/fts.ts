/**
 * Полнотекстовый поиск (FTS5) и триггеры синхронизации с основными
 * таблицами. better-sqlite3 собран с включённым FTS5.
 */

const FTS_SCHEMA = `
CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
  title, question, summary, content, misconceptions, examples, takeaways, search_text,
  content='articles', content_rowid='id', tokenize='unicode61'
);
CREATE VIRTUAL TABLE IF NOT EXISTS myths_fts USING fts5(
  statement, why_believe, evidence, unknown, better, search_text,
  content='myths', content_rowid='id', tokenize='unicode61'
);
CREATE VIRTUAL TABLE IF NOT EXISTS ideas_fts USING fts5(
  title, text, quote, search_text,
  content='ideas', content_rowid='id', tokenize='unicode61'
);

CREATE TRIGGER IF NOT EXISTS articles_fts_insert AFTER INSERT ON articles BEGIN
  INSERT INTO articles_fts(rowid, title, question, summary, content, misconceptions, examples, takeaways, search_text)
  VALUES (new.id, new.title, new.question, new.summary, new.content, new.misconceptions, new.examples, new.takeaways, new.search_text);
END;
CREATE TRIGGER IF NOT EXISTS articles_fts_delete AFTER DELETE ON articles BEGIN
  INSERT INTO articles_fts(articles_fts, rowid, title, question, summary, content, misconceptions, examples, takeaways, search_text)
  VALUES ('delete', old.id, old.title, old.question, old.summary, old.content, old.misconceptions, old.examples, old.takeaways, old.search_text);
END;
CREATE TRIGGER IF NOT EXISTS articles_fts_update AFTER UPDATE ON articles BEGIN
  INSERT INTO articles_fts(articles_fts, rowid, title, question, summary, content, misconceptions, examples, takeaways, search_text)
  VALUES ('delete', old.id, old.title, old.question, old.summary, old.content, old.misconceptions, old.examples, old.takeaways, old.search_text);
  INSERT INTO articles_fts(rowid, title, question, summary, content, misconceptions, examples, takeaways, search_text)
  VALUES (new.id, new.title, new.question, new.summary, new.content, new.misconceptions, new.examples, new.takeaways, new.search_text);
END;

CREATE TRIGGER IF NOT EXISTS myths_fts_insert AFTER INSERT ON myths BEGIN
  INSERT INTO myths_fts(rowid, statement, why_believe, evidence, unknown, better, search_text)
  VALUES (new.id, new.statement, new.why_believe, new.evidence, new.unknown, new.better, new.search_text);
END;
CREATE TRIGGER IF NOT EXISTS myths_fts_delete AFTER DELETE ON myths BEGIN
  INSERT INTO myths_fts(myths_fts, rowid, statement, why_believe, evidence, unknown, better, search_text)
  VALUES ('delete', old.id, old.statement, old.why_believe, old.evidence, old.unknown, old.better, old.search_text);
END;
CREATE TRIGGER IF NOT EXISTS myths_fts_update AFTER UPDATE ON myths BEGIN
  INSERT INTO myths_fts(myths_fts, rowid, statement, why_believe, evidence, unknown, better, search_text)
  VALUES ('delete', old.id, old.statement, old.why_believe, old.evidence, old.unknown, old.better, old.search_text);
  INSERT INTO myths_fts(rowid, statement, why_believe, evidence, unknown, better, search_text)
  VALUES (new.id, new.statement, new.why_believe, new.evidence, new.unknown, new.better, new.search_text);
END;

CREATE TRIGGER IF NOT EXISTS ideas_fts_insert AFTER INSERT ON ideas BEGIN
  INSERT INTO ideas_fts(rowid, title, text, quote, search_text)
  VALUES (new.id, new.title, new.text, new.quote, new.search_text);
END;
CREATE TRIGGER IF NOT EXISTS ideas_fts_delete AFTER DELETE ON ideas BEGIN
  INSERT INTO ideas_fts(ideas_fts, rowid, title, text, quote, search_text)
  VALUES ('delete', old.id, old.title, old.text, old.quote, old.search_text);
END;
CREATE TRIGGER IF NOT EXISTS ideas_fts_update AFTER UPDATE ON ideas BEGIN
  INSERT INTO ideas_fts(ideas_fts, rowid, title, text, quote, search_text)
  VALUES ('delete', old.id, old.title, old.text, old.quote, old.search_text);
  INSERT INTO ideas_fts(rowid, title, text, quote, search_text)
  VALUES (new.id, new.title, new.text, new.quote, new.search_text);
END;
`;

export function ensureFts(sqlite: import("better-sqlite3").Database) {
  sqlite.exec(FTS_SCHEMA);
}
