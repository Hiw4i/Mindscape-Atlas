"use server";

import { redirect } from "next/navigation";
import { eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { topics } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uniquifySlug } from "@/lib/admin";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function siblings(parentId: number | null) {
  return (
    parentId
      ? db.select().from(topics).where(eq(topics.parentId, parentId)).all()
      : db.select().from(topics).where(isNull(topics.parentId)).all()
  ).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export async function saveTopic(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/topics");

  const parentId = Number(formData.get("parentId") ?? 0) || null;
  const values = {
    title,
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    parentId,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  if (id) {
    db.update(topics).set(values).where(eq(topics.id, id)).run();
    redirect(`/admin/topics`);
  }

  const slug = uniquifySlug(String(formData.get("slug") ?? "") || title, "topics");
  const list = siblings(parentId);
  const sortOrder = values.sortOrder || (list.length ? list[list.length - 1].sortOrder + 1 : 0);
  db.insert(topics).values({ slug, ...values, sortOrder }).run();
  redirect(`/admin/topics`);
}

export async function deleteTopic(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(topics).where(eq(topics.id, id)).run();
  redirect(`/admin/topics`);
}

export async function moveTopic(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  const dir = String(formData.get("dir") ?? "up");
  const topic = db.select().from(topics).where(eq(topics.id, id)).get();
  if (!topic) redirect(`/admin/topics`);

  const list = siblings(topic.parentId);
  const i = list.findIndex((s) => s.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < list.length) {
    const other = list[j];
    db.update(topics).set({ sortOrder: other.sortOrder || j }).where(eq(topics.id, topic.id)).run();
    db.update(topics).set({ sortOrder: topic.sortOrder || i }).where(eq(topics.id, other.id)).run();
  }
  redirect(`/admin/topics`);
}
