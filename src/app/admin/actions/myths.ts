"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mythTags, mythTopics, myths } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { ensureTagIds, refreshMythSearch, uniquifySlug } from "@/lib/admin";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function ids(formData: FormData, key: string): number[] {
  return formData
    .getAll(key)
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);
}

export async function saveMyth(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const statement = String(formData.get("statement") ?? "").trim();
  if (!statement) redirect("/admin/myths");

  const values = {
    statement,
    verdict: String(formData.get("verdict") ?? "unproven"),
    whyBelieve: String(formData.get("whyBelieve") ?? ""),
    evidence: String(formData.get("evidence") ?? ""),
    unknown: String(formData.get("unknown") ?? ""),
    better: String(formData.get("better") ?? ""),
    status: String(formData.get("status") ?? "draft") === "published" ? "published" : "draft",
    isDemo: formData.get("isDemo") ? 1 : 0,
    updatedAt: new Date().toISOString(),
  };

  let mythId: number;
  if (id) {
    db.update(myths).set(values).where(eq(myths.id, id)).run();
    mythId = id;
  } else {
    const slug = uniquifySlug(String(formData.get("slug") ?? "") || statement, "myths");
    mythId = db.insert(myths).values({ slug, ...values }).returning({ id: myths.id }).get().id;
  }

  db.delete(mythTopics).where(eq(mythTopics.mythId, mythId)).run();
  for (const tid of ids(formData, "topicIds"))
    db.insert(mythTopics).values({ mythId, topicId: tid }).run();

  db.delete(mythTags).where(eq(mythTags.mythId, mythId)).run();
  for (const tid of ensureTagIds(String(formData.get("tags") ?? "")))
    db.insert(mythTags).values({ mythId, tagId: tid }).run();

  refreshMythSearch(mythId);
  redirect("/admin/myths");
}

export async function deleteMyth(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(myths).where(eq(myths.id, id)).run();
  redirect("/admin/myths");
}
