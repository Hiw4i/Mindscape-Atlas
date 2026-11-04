"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  articleIdeas,
  articleSources,
  articleTags,
  articleTopics,
  articles,
  stateArticles,
} from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { ensureTagIds, refreshArticleSearch, uniquifySlug } from "@/lib/admin";
import { readingMinutes } from "@/lib/content";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function ids(formData: FormData, key: string): number[] {
  return formData
    .getAll(key)
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);
}

export async function saveArticle(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/articles");

  const values = {
    title,
    question: String(formData.get("question") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    misconceptions: String(formData.get("misconceptions") ?? ""),
    examples: String(formData.get("examples") ?? ""),
    takeaways: String(formData.get("takeaways") ?? ""),
    evidenceLevel: String(formData.get("evidenceLevel") ?? "mixed"),
    status: String(formData.get("status") ?? "draft") === "published" ? "published" : "draft",
    featured: formData.get("featured") ? 1 : 0,
    isDemo: formData.get("isDemo") ? 1 : 0,
    readingMinutes: readingMinutes(
      [
        String(formData.get("summary") ?? ""),
        String(formData.get("content") ?? ""),
        String(formData.get("misconceptions") ?? ""),
        String(formData.get("examples") ?? ""),
        String(formData.get("takeaways") ?? ""),
      ].join(" ")
    ),
    updatedAt: new Date().toISOString(),
  };

  let articleId: number;
  if (id) {
    db.update(articles).set(values).where(eq(articles.id, id)).run();
    articleId = id;
  } else {
    const slug = uniquifySlug(String(formData.get("slug") ?? "") || title, "articles");
    articleId = db
      .insert(articles)
      .values({ slug, ...values })
      .returning({ id: articles.id })
      .get().id;
  }

  // Связи: полная пересинхронизация
  db.delete(articleTopics).where(eq(articleTopics.articleId, articleId)).run();
  for (const tid of ids(formData, "topicIds"))
    db.insert(articleTopics).values({ articleId, topicId: tid }).run();

  db.delete(articleTags).where(eq(articleTags.articleId, articleId)).run();
  for (const tid of ensureTagIds(String(formData.get("tags") ?? "")))
    db.insert(articleTags).values({ articleId, tagId: tid }).run();

  db.delete(articleSources).where(eq(articleSources.articleId, articleId)).run();
  for (const sid of ids(formData, "sourceIds"))
    db.insert(articleSources).values({ articleId, sourceId: sid }).run();

  db.delete(articleIdeas).where(eq(articleIdeas.articleId, articleId)).run();
  for (const iid of ids(formData, "ideaIds"))
    db.insert(articleIdeas).values({ articleId, ideaId: iid }).run();

  db.delete(stateArticles).where(eq(stateArticles.articleId, articleId)).run();
  for (const sid of ids(formData, "stateIds"))
    db.insert(stateArticles).values({ stateId: sid, articleId }).run();

  refreshArticleSearch(articleId);
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(articles).where(eq(articles.id, id)).run();
  redirect("/admin/articles");
}
