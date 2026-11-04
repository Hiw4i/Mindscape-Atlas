import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

/* ------------------------------------------------------------------ */
/* Разделы и темы: дерево без ограничения глубины.                     */
/* Верхний уровень = разделы, вложенные = темы и понятия.              */
/* ------------------------------------------------------------------ */

export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default(""),
  parentId: integer("parent_id").references((): AnySQLiteColumn => topics.id, {
    onDelete: "cascade",
  }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Статьи: гибкий набор смысловых блоков в отдельных полях.            */
/* searchText - денормализованная строка для полнотекстового поиска.   */
/* ------------------------------------------------------------------ */

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  question: text("question").notNull().default(""),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  misconceptions: text("misconceptions").notNull().default(""),
  examples: text("examples").notNull().default(""),
  takeaways: text("takeaways").notNull().default(""),
  // research | hypothesis | interpretation | observation | mixed | disputed
  evidenceLevel: text("evidence_level").notNull().default("mixed"),
  // draft | published
  status: text("status").notNull().default("draft"),
  isDemo: integer("is_demo").notNull().default(0),
  featured: integer("featured").notNull().default(0),
  readingMinutes: integer("reading_minutes").notNull().default(0),
  searchText: text("search_text").notNull().default(""),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Мифы и заблуждения.                                                 */
/* verdict: debunked | misleading | partly | unproven | disputed       */
/* ------------------------------------------------------------------ */

export const myths = sqliteTable("myths", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  statement: text("statement").notNull(),
  verdict: text("verdict").notNull().default("unproven"),
  whyBelieve: text("why_believe").notNull().default(""),
  evidence: text("evidence").notNull().default(""),
  unknown: text("unknown").notNull().default(""),
  better: text("better").notNull().default(""),
  status: text("status").notNull().default("draft"),
  isDemo: integer("is_demo").notNull().default(0),
  searchText: text("search_text").notNull().default(""),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Источники: видео, книги, исследования, статьи, лекции.              */
/* ------------------------------------------------------------------ */

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // video | book | article | lecture | research | other
  kind: text("kind").notNull().default("other"),
  title: text("title").notNull(),
  author: text("author").notNull().default(""),
  url: text("url").notNull().default(""),
  description: text("description").notNull().default(""),
  notes: text("notes").notNull().default(""),
  isDemo: integer("is_demo").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Идеи: атомарные мысли, выписанные из источников или личные.         */
/* ------------------------------------------------------------------ */

export const ideas = sqliteTable("ideas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").references(() => sources.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  text: text("text").notNull().default(""),
  quote: text("quote").notNull().default(""),
  timecode: text("timecode").notNull().default(""),
  status: text("status").notNull().default("draft"),
  isDemo: integer("is_demo").notNull().default(0),
  searchText: text("search_text").notNull().default(""),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Состояния: вход в знания через текущее переживание.                 */
/* ------------------------------------------------------------------ */

export const states = sqliteTable("states", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/* ------------------------------------------------------------------ */
/* Теги и синонимы к ним.                                              */
/* ------------------------------------------------------------------ */

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  synonyms: text("synonyms").notNull().default(""),
});

/* ------------------------------------------------------------------ */
/* Связи между понятиями (темами) для карты.                           */
/* kind: related | similar | opposes | influences                      */
/* ------------------------------------------------------------------ */

export const topicLinks = sqliteTable("topic_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromTopicId: integer("from_topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  toTopicId: integer("to_topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("related"),
  note: text("note").notNull().default(""),
});

/* ------------------------------------------------------------------ */
/* Связи между идеями.                                                 */
/* kind: develops | complements | challenges                           */
/* ------------------------------------------------------------------ */

export const ideaRelations = sqliteTable("idea_relations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromIdeaId: integer("from_idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  toIdeaId: integer("to_idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("complements"),
});

/* ------------------------------------------------------------------ */
/* Связующие таблицы "многие ко многим".                               */
/* ------------------------------------------------------------------ */

export const articleTopics = sqliteTable(
  "article_topics",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.topicId] })]
);

export const articleTags = sqliteTable(
  "article_tags",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

export const articleSources = sqliteTable(
  "article_sources",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    sourceId: integer("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.sourceId] })]
);

export const articleIdeas = sqliteTable(
  "article_ideas",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    ideaId: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.ideaId] })]
);

export const mythTopics = sqliteTable(
  "myth_topics",
  {
    mythId: integer("myth_id")
      .notNull()
      .references(() => myths.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.mythId, t.topicId] })]
);

export const mythTags = sqliteTable(
  "myth_tags",
  {
    mythId: integer("myth_id")
      .notNull()
      .references(() => myths.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.mythId, t.tagId] })]
);

export const mythSources = sqliteTable(
  "myth_sources",
  {
    mythId: integer("myth_id")
      .notNull()
      .references(() => myths.id, { onDelete: "cascade" }),
    sourceId: integer("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.mythId, t.sourceId] })]
);

export const ideaTopics = sqliteTable(
  "idea_topics",
  {
    ideaId: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.ideaId, t.topicId] })]
);

export const ideaTags = sqliteTable(
  "idea_tags",
  {
    ideaId: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.ideaId, t.tagId] })]
);

export const stateArticles = sqliteTable(
  "state_articles",
  {
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "cascade" }),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.stateId, t.articleId] })]
);

export const stateTopics = sqliteTable(
  "state_topics",
  {
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.stateId, t.topicId] })]
);

export const stateMyths = sqliteTable(
  "state_myths",
  {
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "cascade" }),
    mythId: integer("myth_id")
      .notNull()
      .references(() => myths.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.stateId, t.mythId] })]
);

/* Экспорт типов строк */
export type Topic = typeof topics.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Myth = typeof myths.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type Idea = typeof ideas.$inferSelect;
export type State = typeof states.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type TopicLink = typeof topicLinks.$inferSelect;
export type IdeaRelation = typeof ideaRelations.$inferSelect;
