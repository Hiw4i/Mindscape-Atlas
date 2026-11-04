"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  stateArticles,
  stateMyths,
  stateTopics,
  states,
} from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uniquifySlug } from "@/lib/admin";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function ids(formData: FormData, key: string): number[] {
  return formData
    .getAll(key)
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);
}

export async function saveState(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/states");

  const values = {
    title,
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  let stateId: number;
  if (id) {
    db.update(states).set(values).where(eq(states.id, id)).run();
    stateId = id;
  } else {
    const slug = uniquifySlug(String(formData.get("slug") ?? "") || title, "states");
    stateId = db.insert(states).values({ slug, ...values }).returning({ id: states.id }).get().id;
  }

  db.delete(stateArticles).where(eq(stateArticles.stateId, stateId)).run();
  for (const aid of ids(formData, "articleIds"))
    db.insert(stateArticles).values({ stateId, articleId: aid }).run();

  db.delete(stateTopics).where(eq(stateTopics.stateId, stateId)).run();
  for (const tid of ids(formData, "topicIds"))
    db.insert(stateTopics).values({ stateId, topicId: tid }).run();

  db.delete(stateMyths).where(eq(stateMyths.stateId, stateId)).run();
  for (const mid of ids(formData, "mythIds"))
    db.insert(stateMyths).values({ stateId, mythId: mid }).run();

  redirect("/admin/states");
}

export async function deleteState(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(states).where(eq(states.id, id)).run();
  redirect("/admin/states");
}
