import { count } from "drizzle-orm";
import type { Db } from "./index";
import {
  topics,
  tags,
  sources,
  articles,
  myths,
  ideas,
  states,
  topicLinks,
  ideaRelations,
  articleTopics,
  articleTags,
  articleSources,
  articleIdeas,
  mythTopics,
  mythTags,
  ideaTopics,
  stateArticles,
  stateTopics,
  stateMyths,
} from "./schema";
import {
  SEED_TOPICS,
  SEED_TAGS,
  SEED_SOURCES,
  SEED_MYTHS,
  SEED_STATES,
  SEED_LINKS,
  SEED_IDEAS,
  SEED_IDEA_RELATIONS,
} from "./seed-data";
import { SEED_ARTICLES } from "./seed-articles";
import { buildSearchText, readingMinutes } from "@/lib/content";

/**
 * Наполнение пустой базы демонстрационными материалами. При наличии
 * любых тем в базе засев пропускается - демонстрационные данные можно
 * полностью удалить или отредактировать в админ-панели.
 */
export function ensureSeed(db: Db): void {
  const { n } = db.select({ n: count() }).from(topics).get()!;
  if (n > 0) return;

  const now = new Date().toISOString();
  const topicIdByKey = new Map<string, number>();
  const tagIdBySlug = new Map<string, number>();
  const sourceIdByKey = new Map<string, number>();
  const articleIdBySlug = new Map<string, number>();
  const mythIdBySlug = new Map<string, number>();
  const ideaIdByKey = new Map<string, number>();
  const pendingArticleIdeas: Array<{ articleId: number; ideaKey: string }> = [];

  const topicTitle = (key: string) =>
    SEED_TOPICS.find((t) => t.key === key)?.title ?? "";

  db.transaction((tx) => {
    // Темы и разделы
    for (const t of SEED_TOPICS) {
      const res = tx
        .insert(topics)
        .values({
          slug: t.slug,
          title: t.title,
          description: t.description ?? "",
          icon: t.icon ?? "",
          parentId: t.parentKey ? (topicIdByKey.get(t.parentKey) ?? null) : null,
          sortOrder: 0,
          createdAt: now,
        })
        .returning({ id: topics.id })
        .get();
      topicIdByKey.set(t.key, res.id);
    }

    // Теги
    for (const t of SEED_TAGS) {
      const res = tx
        .insert(tags)
        .values({ slug: t.slug, name: t.name, synonyms: t.synonyms ?? "" })
        .returning({ id: tags.id })
        .get();
      tagIdBySlug.set(t.slug, res.id);
    }

    // Источники
    for (const s of SEED_SOURCES) {
      const res = tx
        .insert(sources)
        .values({
          kind: s.kind,
          title: s.title,
          author: s.author ?? "",
          url: s.url ?? "",
          description: s.description ?? "",
          notes: "",
          isDemo: 1,
          createdAt: now,
        })
        .returning({ id: sources.id })
        .get();
      sourceIdByKey.set(s.key, res.id);
    }

    // Статьи
    for (const a of SEED_ARTICLES) {
      const searchText = buildSearchText([
        a.title,
        a.question,
        a.summary,
        a.content,
        a.misconceptions,
        a.examples,
        a.takeaways,
        a.topics.map(topicTitle).join(" "),
        a.tags
          .map((k) => {
            const tag = SEED_TAGS.find((t) => t.slug === k);
            return tag ? `${tag.name} ${tag.synonyms ?? ""}` : "";
          })
          .join(" "),
      ]);
      const res = tx
        .insert(articles)
        .values({
          slug: a.slug,
          title: a.title,
          question: a.question,
          summary: a.summary,
          content: a.content,
          misconceptions: a.misconceptions,
          examples: a.examples,
          takeaways: a.takeaways,
          evidenceLevel: a.evidenceLevel,
          status: "published",
          isDemo: 1,
          featured: a.featured ? 1 : 0,
          readingMinutes: readingMinutes(
            [a.summary, a.content, a.misconceptions, a.examples, a.takeaways].join(" ")
          ),
          searchText,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: articles.id })
        .get();
      articleIdBySlug.set(a.slug, res.id);

      for (const key of a.topics) {
        const tid = topicIdByKey.get(key);
        if (tid) tx.insert(articleTopics).values({ articleId: res.id, topicId: tid }).run();
      }
      for (const key of a.tags) {
        const tid = tagIdBySlug.get(key);
        if (tid) tx.insert(articleTags).values({ articleId: res.id, tagId: tid }).run();
      }
      for (const key of a.sources) {
        const sid = sourceIdByKey.get(key);
        if (sid) tx.insert(articleSources).values({ articleId: res.id, sourceId: sid }).run();
      }
      for (const key of a.ideas) {
        pendingArticleIdeas.push({ articleId: res.id, ideaKey: key });
      }
    }

    // Мифы
    for (const m of SEED_MYTHS) {
      const searchText = buildSearchText([
        m.statement,
        m.whyBelieve,
        m.evidence,
        m.unknown,
        m.better,
        m.topics.map(topicTitle).join(" "),
      ]);
      const res = tx
        .insert(myths)
        .values({
          slug: m.slug,
          statement: m.statement,
          verdict: m.verdict,
          whyBelieve: m.whyBelieve,
          evidence: m.evidence,
          unknown: m.unknown,
          better: m.better,
          status: "published",
          isDemo: 1,
          searchText,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: myths.id })
        .get();
      mythIdBySlug.set(m.slug, res.id);

      for (const key of m.topics) {
        const tid = topicIdByKey.get(key);
        if (tid) tx.insert(mythTopics).values({ mythId: res.id, topicId: tid }).run();
      }
      for (const key of m.tags) {
        const tid = tagIdBySlug.get(key);
        if (tid) tx.insert(mythTags).values({ mythId: res.id, tagId: tid }).run();
      }
    }

    // Идеи
    for (const i of SEED_IDEAS) {
      const searchText = buildSearchText([
        i.title,
        i.text,
        i.quote ?? "",
        i.topics.map(topicTitle).join(" "),
      ]);
      const res = tx
        .insert(ideas)
        .values({
          sourceId: i.sourceKey ? (sourceIdByKey.get(i.sourceKey) ?? null) : null,
          title: i.title,
          text: i.text,
          quote: i.quote ?? "",
          timecode: "",
          status: "published",
          isDemo: 1,
          searchText,
          createdAt: now,
        })
        .returning({ id: ideas.id })
        .get();
      ideaIdByKey.set(i.key, res.id);
      for (const key of i.topics) {
        const tid = topicIdByKey.get(key);
        if (tid) tx.insert(ideaTopics).values({ ideaId: res.id, topicId: tid }).run();
      }
    }

    // Связи идей между собой
    for (const r of SEED_IDEA_RELATIONS) {
      const from = ideaIdByKey.get(r.from);
      const to = ideaIdByKey.get(r.to);
      if (from && to)
        tx.insert(ideaRelations).values({ fromIdeaId: from, toIdeaId: to, kind: r.kind }).run();
    }

    // Связи статей с идеями
    for (const p of pendingArticleIdeas) {
      const iid = ideaIdByKey.get(p.ideaKey);
      if (iid) tx.insert(articleIdeas).values({ articleId: p.articleId, ideaId: iid }).run();
    }

    // Состояния
    for (let idx = 0; idx < SEED_STATES.length; idx++) {
      const s = SEED_STATES[idx];
      const res = tx
        .insert(states)
        .values({
          slug: s.slug,
          title: s.title,
          description: s.description,
          icon: s.icon,
          sortOrder: idx,
          createdAt: now,
        })
        .returning({ id: states.id })
        .get();
      for (const slug of s.articles) {
        const aid = articleIdBySlug.get(slug);
        if (aid) tx.insert(stateArticles).values({ stateId: res.id, articleId: aid }).run();
      }
      for (const key of s.topics) {
        const tid = topicIdByKey.get(key);
        if (tid) tx.insert(stateTopics).values({ stateId: res.id, topicId: tid }).run();
      }
      for (const slug of s.myths) {
        const mid = mythIdBySlug.get(slug);
        if (mid) tx.insert(stateMyths).values({ stateId: res.id, mythId: mid }).run();
      }
    }

    // Связи тем между собой (карта)
    for (const l of SEED_LINKS) {
      const from = topicIdByKey.get(l.from);
      const to = topicIdByKey.get(l.to);
      if (from && to)
        tx.insert(topicLinks).values({ fromTopicId: from, toTopicId: to, kind: l.kind, note: l.note ?? "" }).run();
    }
  });
}
