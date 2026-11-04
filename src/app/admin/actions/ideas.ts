"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ideaRelations, ideaTopics, ideas } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { refreshIdeaSearch } from "@/lib/admin";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function ids(formData: FormData, key: string): number[] {
  return formData
    .getAll(key)
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);
}

export async function saveIdea(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/ideas");

  const values = {
    sourceId: Number(formData.get("sourceId") ?? 0) || null,
    title,
    text: String(formData.get("text") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    timecode: String(formData.get("timecode") ?? "").trim(),
    status: String(formData.get("status") ?? "draft") === "published" ? "published" : "draft",
    isDemo: formData.get("isDemo") ? 1 : 0,
  };

  let ideaId: number;
  if (id) {
    db.update(ideas).set(values).where(eq(ideas.id, id)).run();
    ideaId = id;
  } else {
    ideaId = db.insert(ideas).values(values).returning({ id: ideas.id }).get().id;
  }

  db.delete(ideaTopics).where(eq(ideaTopics.ideaId, ideaId)).run();
  for (const tid of ids(formData, "topicIds"))
    db.insert(ideaTopics).values({ ideaId, topicId: tid }).run();

  refreshIdeaSearch(ideaId);
  redirect(formData.get("returnTo") === "source" && values.sourceId
    ? `/admin/sources/${values.sourceId}`
    : "/admin/ideas");
}

export async function deleteIdea(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(ideas).where(eq(ideas.id, id)).run();
  redirect(formData.get("returnTo") === "source" && Number(formData.get("sourceId"))
    ? `/admin/sources/${Number(formData.get("sourceId"))}`
    : "/admin/ideas");
}

export async function saveIdeaRelation(formData: FormData) {
  await guard();
  const fromIdeaId = Number(formData.get("fromIdeaId"));
  const toIdeaId = Number(formData.get("toIdeaId"));
  const kind = String(formData.get("kind") ?? "complements");
  if (fromIdeaId && toIdeaId && fromIdeaId !== toIdeaId) {
    db.insert(ideaRelations).values({ fromIdeaId, toIdeaId, kind }).run();
  }
  redirect(String(formData.get("returnTo") ?? "/admin/ideas"));
}

export async function deleteIdeaRelation(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(ideaRelations).where(eq(ideaRelations.id, id)).run();
  redirect(String(formData.get("returnTo") ?? "/admin/ideas"));
}
