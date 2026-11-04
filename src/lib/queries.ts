import { and, asc, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  articleIdeas,
  articleSources,
  articleTags,
  articleTopics,
  ideas,
  ideaRelations,
  ideaTopics,
  mythTags,
  mythTopics,
  myths,
  sources,
  states,
  stateArticles,
  stateMyths,
  stateTopics,
  tags,
  topicLinks,
  topics,
} from "@/db/schema";
import type {
  Article,
  Idea,
  Myth,
  Source,
  State,
  Tag,
  Topic,
} from "@/db/schema";
import { colorForSectionSlug, type ColorKey } from "@/lib/labels";

export type { Article, Idea, Myth, Source, State, Tag, Topic };

/* ------------------------------------------------------------------ */
/* Темы и разделы                                                      */
/* ------------------------------------------------------------------ */

export function getSections(): Topic[] {
  return db
    .select()
    .from(topics)
    .where(isNull(topics.parentId))
    .orderBy(asc(topics.sortOrder), asc(topics.title))
    .all();
}

export function getAllTopics(): Topic[] {
  return db
    .select()
    .from(topics)
    .orderBy(asc(topics.sortOrder), asc(topics.title))
    .all();
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return db.select().from(topics).where(eq(topics.slug, slug)).get();
}

export function getTopicById(id: number): Topic | undefined {
  return db.select().from(topics).where(eq(topics.id, id)).get();
}

export function getChildTopics(parentId: number): Topic[] {
  return db
    .select()
    .from(topics)
    .where(eq(topics.parentId, parentId))
    .orderBy(asc(topics.sortOrder), asc(topics.title))
    .all();
}

export function buildTopicIndex(): Map<number, Topic> {
  return new Map(getAllTopics().map((t) => [t.id, t]));
}

/** Цепочка предков от корня до родителя самой темы. */
export function getTopicAncestors(
  topic: Topic,
  index?: Map<number, Topic>
): Topic[] {
  const idx = index ?? buildTopicIndex();
  const chain: Topic[] = [];
  let current = topic.parentId ? idx.get(topic.parentId) : undefined;
  while (current) {
    chain.unshift(current);
    current = current.parentId ? idx.get(current.parentId) : undefined;
  }
  return chain;
}

export function getRootSection(
  topic: Topic,
  index?: Map<number, Topic>
): Topic | undefined {
  const chain = getTopicAncestors(topic, index);
  return chain.length ? chain[0] : topic;
}

export function colorOfTopic(
  topic: Topic,
  index?: Map<number, Topic>
): ColorKey {
  const root = getRootSection(topic, index);
  return colorForSectionSlug(root?.slug ?? topic.slug);
}

/* ------------------------------------------------------------------ */
/* Статьи                                                              */
/* ------------------------------------------------------------------ */

export function getPublishedArticles(): Article[] {
  return db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.updatedAt))
    .all();
}

export function getFeaturedArticles(): Article[] {
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.featured, 1)))
    .orderBy(desc(articles.updatedAt))
    .all();
}

export function getArticleBySlug(slug: string): Article | undefined {
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .get();
}

export function getArticleById(id: number): Article | undefined {
  return db.select().from(articles).where(eq(articles.id, id)).get();
}

export function getAllArticlesForAdmin(): Article[] {
  return db
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt))
    .all();
}

export function getArticleTopics(articleId: number): Topic[] {
  return db
    .select({ t: topics })
    .from(articleTopics)
    .innerJoin(topics, eq(topics.id, articleTopics.topicId))
    .where(eq(articleTopics.articleId, articleId))
    .all()
    .map((r) => r.t);
}

export function getArticleTags(articleId: number): Tag[] {
  return db
    .select({ t: tags })
    .from(articleTags)
    .innerJoin(tags, eq(tags.id, articleTags.tagId))
    .where(eq(articleTags.articleId, articleId))
    .all()
    .map((r) => r.t);
}

export function getArticleSources(articleId: number): Source[] {
  return db
    .select({ s: sources })
    .from(articleSources)
    .innerJoin(sources, eq(sources.id, articleSources.sourceId))
    .where(eq(articleSources.articleId, articleId))
    .all()
    .map((r) => r.s);
}

export function getArticleIdeas(articleId: number): Idea[] {
  return db
    .select({ i: ideas })
    .from(articleIdeas)
    .innerJoin(ideas, eq(ideas.id, articleIdeas.ideaId))
    .where(eq(articleIdeas.articleId, articleId))
    .all()
    .map((r) => r.i);
}

export function getArticlesByTopic(topicId: number): Article[] {
  return db
    .select({ a: articles })
    .from(articleTopics)
    .innerJoin(articles, eq(articles.id, articleTopics.articleId))
    .where(and(eq(articleTopics.topicId, topicId), eq(articles.status, "published")))
    .orderBy(desc(articles.updatedAt))
    .all()
    .map((r) => r.a);
}

export function getRelatedArticles(
  articleId: number,
  topicIds: number[]
): Article[] {
  if (!topicIds.length) return [];
  return db
    .selectDistinct({ a: articles })
    .from(articles)
    .innerJoin(articleTopics, eq(articleTopics.articleId, articles.id))
    .where(
      and(
        inArray(articleTopics.topicId, topicIds),
        ne(articles.id, articleId),
        eq(articles.status, "published")
      )
    )
    .orderBy(desc(articles.updatedAt))
    .limit(6)
    .all()
    .map((r) => r.a);
}

/** Темы статей одним запросом: для списков карточек. */
export function attachTopics(
  rows: Article[]
): Array<{ article: Article; topics: Topic[] }> {
  const ids = rows.map((r) => r.id);
  const links = ids.length
    ? db
        .select({ articleId: articleTopics.articleId, topic: topics })
        .from(articleTopics)
        .innerJoin(topics, eq(topics.id, articleTopics.topicId))
        .where(inArray(articleTopics.articleId, ids))
        .all()
    : [];
  const map = new Map<number, Topic[]>();
  for (const l of links) {
    const list = map.get(l.articleId) ?? [];
    list.push(l.topic);
    map.set(l.articleId, list);
  }
  return rows.map((article) => ({ article, topics: map.get(article.id) ?? [] }));
}

/* ------------------------------------------------------------------ */
/* Мифы                                                                */
/* ------------------------------------------------------------------ */

export function getPublishedMyths(verdict?: string): Myth[] {
  const where = verdict
    ? and(eq(myths.status, "published"), eq(myths.verdict, verdict))
    : eq(myths.status, "published");
  return db.select().from(myths).where(where).orderBy(desc(myths.createdAt)).all();
}

export function getMythBySlug(slug: string): Myth | undefined {
  return db
    .select()
    .from(myths)
    .where(and(eq(myths.slug, slug), eq(myths.status, "published")))
    .get();
}

export function getMythById(id: number): Myth | undefined {
  return db.select().from(myths).where(eq(myths.id, id)).get();
}

export function getAllMythsForAdmin(): Myth[] {
  return db.select().from(myths).orderBy(desc(myths.createdAt)).all();
}

export function getMythTopics(mythId: number): Topic[] {
  return db
    .select({ t: topics })
    .from(mythTopics)
    .innerJoin(topics, eq(topics.id, mythTopics.topicId))
    .where(eq(mythTopics.mythId, mythId))
    .all()
    .map((r) => r.t);
}

export function getMythTags(mythId: number): Tag[] {
  return db
    .select({ t: tags })
    .from(mythTags)
    .innerJoin(tags, eq(tags.id, mythTags.tagId))
    .where(eq(mythTags.mythId, mythId))
    .all()
    .map((r) => r.t);
}

export function getMythsByTopic(topicId: number): Myth[] {
  return db
    .select({ m: myths })
    .from(mythTopics)
    .innerJoin(myths, eq(myths.id, mythTopics.mythId))
    .where(and(eq(mythTopics.topicId, topicId), eq(myths.status, "published")))
    .orderBy(desc(myths.createdAt))
    .all()
    .map((r) => r.m);
}

/* ------------------------------------------------------------------ */
/* Идеи                                                                */
/* ------------------------------------------------------------------ */

export function getIdeasByTopic(topicId: number): Array<{ idea: Idea; source?: Source }> {
  const rows = db
    .select({ i: ideas })
    .from(ideaTopics)
    .innerJoin(ideas, eq(ideas.id, ideaTopics.ideaId))
    .where(and(eq(ideaTopics.topicId, topicId), eq(ideas.status, "published")))
    .orderBy(desc(ideas.createdAt))
    .all()
    .map((r) => r.i);
  return attachSourcesToIdeas(rows);
}

export function getIdeasBySource(sourceId: number): Idea[] {
  return db
    .select()
    .from(ideas)
    .where(and(eq(ideas.sourceId, sourceId), eq(ideas.status, "published")))
    .orderBy(asc(ideas.id))
    .all();
}

export function getIdeaById(id: number): Idea | undefined {
  return db.select().from(ideas).where(eq(ideas.id, id)).get();
}

export function getIdeaTopics(ideaId: number): Topic[] {
  return db
    .select({ t: topics })
    .from(ideaTopics)
    .innerJoin(topics, eq(topics.id, ideaTopics.topicId))
    .where(eq(ideaTopics.ideaId, ideaId))
    .all()
    .map((r) => r.t);
}

export function getAllIdeasForAdmin(): Idea[] {
  return db.select().from(ideas).orderBy(desc(ideas.createdAt)).all();
}

export function attachSourcesToIdeas(
  rows: Idea[]
): Array<{ idea: Idea; source?: Source }> {
  const sourceIds = [...new Set(rows.map((r) => r.sourceId).filter((v): v is number => v !== null))];
  const srcMap = new Map<number, Source>();
  if (sourceIds.length) {
    for (const s of db.select().from(sources).where(inArray(sources.id, sourceIds)).all()) {
      srcMap.set(s.id, s);
    }
  }
  return rows.map((idea) => ({ idea, source: idea.sourceId ? srcMap.get(idea.sourceId) : undefined }));
}

export function getIdeaRelationsFor(ideaIds: number[]): Array<{
  id: number;
  fromIdeaId: number;
  toIdeaId: number;
  kind: string;
  fromTitle?: string;
  toTitle?: string;
}> {
  if (!ideaIds.length) return [];
  const relations = db
    .select()
    .from(ideaRelations)
    .all()
    .filter((r) => ideaIds.includes(r.fromIdeaId) || ideaIds.includes(r.toIdeaId));
  const titles = new Map<number, string>();
  if (relations.length) {
    const involved = [...new Set(relations.flatMap((r) => [r.fromIdeaId, r.toIdeaId]))];
    for (const i of db.select().from(ideas).all()) {
      if (involved.includes(i.id)) titles.set(i.id, i.title);
    }
  }
  return relations.map((r) => ({
    id: r.id,
    fromIdeaId: r.fromIdeaId,
    toIdeaId: r.toIdeaId,
    kind: r.kind,
    fromTitle: titles.get(r.fromIdeaId),
    toTitle: titles.get(r.toIdeaId),
  }));
}

/* ------------------------------------------------------------------ */
/* Источники                                                           */
/* ------------------------------------------------------------------ */

export function getSourcesList(): Array<Source & { ideaCount: number }> {
  const rows = db.select().from(sources).orderBy(desc(sources.createdAt)).all();
  const counts = db
    .select({ sourceId: ideas.sourceId, n: sql<number>`count(*)` })
    .from(ideas)
    .groupBy(ideas.sourceId)
    .all();
  const countMap = new Map(counts.map((c) => [c.sourceId ?? -1, Number(c.n)]));
  return rows.map((s) => ({ ...s, ideaCount: countMap.get(s.id) ?? 0 }));
}

export function getSourceById(id: number): Source | undefined {
  return db.select().from(sources).where(eq(sources.id, id)).get();
}

export function getAllSourcesForAdmin(): Source[] {
  return db.select().from(sources).orderBy(desc(sources.createdAt)).all();
}

/* ------------------------------------------------------------------ */
/* Состояния                                                           */
/* ------------------------------------------------------------------ */

export function getStatesList(): State[] {
  return db
    .select()
    .from(states)
    .orderBy(asc(states.sortOrder), asc(states.id))
    .all();
}

export function getStateBySlug(slug: string): State | undefined {
  return db.select().from(states).where(eq(states.slug, slug)).get();
}

export function getStateById(id: number): State | undefined {
  return db.select().from(states).where(eq(states.id, id)).get();
}

export function getStateArticles(stateId: number): Article[] {
  return db
    .select({ a: articles })
    .from(stateArticles)
    .innerJoin(articles, eq(articles.id, stateArticles.articleId))
    .where(and(eq(stateArticles.stateId, stateId), eq(articles.status, "published")))
    .all()
    .map((r) => r.a);
}

export function getStateTopics(stateId: number): Topic[] {
  return db
    .select({ t: topics })
    .from(stateTopics)
    .innerJoin(topics, eq(topics.id, stateTopics.topicId))
    .where(eq(stateTopics.stateId, stateId))
    .all()
    .map((r) => r.t);
}

export function getStateMyths(stateId: number): Myth[] {
  return db
    .select({ m: myths })
    .from(stateMyths)
    .innerJoin(myths, eq(myths.id, stateMyths.mythId))
    .where(and(eq(stateMyths.stateId, stateId), eq(myths.status, "published")))
    .all()
    .map((r) => r.m);
}

/* ------------------------------------------------------------------ */
/* Связи тем и карта                                                   */
/* ------------------------------------------------------------------ */

export interface MapNode {
  id: string;
  slug: string;
  label: string;
  color: string;
  size: number;
  description?: string;
  materials?: number;
}
export interface MapLink {
  source: string;
  target: string;
}

export function getMapData(): { nodes: MapNode[]; links: MapLink[] } {
  const index = buildTopicIndex();
  const all = [...index.values()];
  const links = db.select().from(topicLinks).all();
  const degree = new Map<number, number>();
  for (const l of links) {
    degree.set(l.fromTopicId, (degree.get(l.fromTopicId) ?? 0) + 1);
    degree.set(l.toTopicId, (degree.get(l.toTopicId) ?? 0) + 1);
  }
  // Число материалов темы для карточки легенды на карте
  const articleCounts = db
    .select({ topicId: articleTopics.topicId, n: sql<number>`count(*)` })
    .from(articleTopics)
    .innerJoin(articles, eq(articles.id, articleTopics.articleId))
    .where(eq(articles.status, "published"))
    .groupBy(articleTopics.topicId)
    .all();
  const mythCounts = db
    .select({ topicId: mythTopics.topicId, n: sql<number>`count(*)` })
    .from(mythTopics)
    .innerJoin(myths, eq(myths.id, mythTopics.mythId))
    .where(eq(myths.status, "published"))
    .groupBy(mythTopics.topicId)
    .all();
  const materials = new Map<number, number>();
  for (const row of articleCounts) {
    materials.set(row.topicId, (materials.get(row.topicId) ?? 0) + Number(row.n));
  }
  for (const row of mythCounts) {
    materials.set(row.topicId, (materials.get(row.topicId) ?? 0) + Number(row.n));
  }
  const nodes: MapNode[] = all.map((t) => {
    const d = degree.get(t.id) ?? 0;
    return {
      id: String(t.id),
      slug: t.slug,
      label: t.title,
      color: `var(--c-${colorOfTopic(t, index)})`,
      size: 4 + Math.min(d, 12) * 0.9,
      description: t.description || undefined,
      materials: materials.get(t.id) ?? 0,
    };
  });
  return {
    nodes,
    links: links.map((l) => ({ source: String(l.fromTopicId), target: String(l.toTopicId) })),
  };
}

export function getTopicLinksFor(
  topicId: number
): Array<{ id: number; other: Topic; kind: string; note: string; direction: "from" | "to" }> {
  const index = buildTopicIndex();
  const rows = db.select().from(topicLinks).all();
  const out: Array<{ id: number; other: Topic; kind: string; note: string; direction: "from" | "to" }> = [];
  for (const l of rows) {
    if (l.fromTopicId === topicId) {
      const other = index.get(l.toTopicId);
      if (other) out.push({ id: l.id, other, kind: l.kind, note: l.note, direction: "from" });
    } else if (l.toTopicId === topicId) {
      const other = index.get(l.fromTopicId);
      if (other) out.push({ id: l.id, other, kind: l.kind, note: l.note, direction: "to" });
    }
  }
  return out;
}

/** Локальный граф вокруг темы: сама тема, соседи по связям и дети. */
export function getNeighborhood(topicId: number): { nodes: MapNode[]; links: MapLink[] } {
  const full = getMapData();
  const nodeIds = new Set<string>([String(topicId)]);
  for (const l of full.links) {
    if (l.source === String(topicId) || l.target === String(topicId)) {
      nodeIds.add(l.source);
      nodeIds.add(l.target);
    }
  }
  const index = buildTopicIndex();
  for (const child of getChildTopics(topicId)) nodeIds.add(String(child.id));
  const parent = index.get(topicId);
  if (parent?.parentId) nodeIds.add(String(parent.parentId));
  return {
    nodes: full.nodes.filter((n) => nodeIds.has(n.id)),
    links: full.links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target)),
  };
}

export function getAllTopicLinksForAdmin() {
  const index = buildTopicIndex();
  const rows = db.select().from(topicLinks).all();
  return rows.map((l) => ({
    ...l,
    fromTitle: index.get(l.fromTopicId)?.title ?? "?",
    toTitle: index.get(l.toTopicId)?.title ?? "?",
  }));
}

/* ------------------------------------------------------------------ */
/* Служебное                                                           */
/* ------------------------------------------------------------------ */

export function getAllTags(): Tag[] {
  return db.select().from(tags).orderBy(asc(tags.name)).all();
}

export function stateArticlesOf(articleId: number): number[] {
  return db
    .select({ stateId: stateArticles.stateId })
    .from(stateArticles)
    .where(eq(stateArticles.articleId, articleId))
    .all()
    .map((r) => r.stateId);
}

export function getStats() {
  const n = (rows: Array<{ n: number }>) => rows[0]?.n ?? 0;
  const countOf = sql<number>`count(*)`;
  return {
    topics: n(db.select({ n: countOf }).from(topics).all()),
    articles: n(
      db
        .select({ n: countOf })
        .from(articles)
        .where(eq(articles.status, "published"))
        .all()
    ),
    drafts: n(
      db.select({ n: countOf }).from(articles).where(eq(articles.status, "draft")).all()
    ),
    myths: n(
      db.select({ n: countOf }).from(myths).where(eq(myths.status, "published")).all()
    ),
    ideas: n(
      db.select({ n: countOf }).from(ideas).where(eq(ideas.status, "published")).all()
    ),
    sources: n(db.select({ n: countOf }).from(sources).all()),
    states: n(db.select({ n: countOf }).from(states).all()),
    links: n(db.select({ n: countOf }).from(topicLinks).all()),
  };
}
