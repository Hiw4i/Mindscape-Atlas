"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sources } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export async function saveSource(formData: FormData) {
  await guard();
  const id = Number(formData.get("id") ?? 0) || undefined;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/sources");

  const values = {
    kind: String(formData.get("kind") ?? "other"),
    title,
    author: String(formData.get("author") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    notes: String(formData.get("notes") ?? ""),
    isDemo: formData.get("isDemo") ? 1 : 0,
  };

  if (id) {
    db.update(sources).set(values).where(eq(sources.id, id)).run();
  } else {
    db.insert(sources).values(values).run();
  }
  redirect("/admin/sources");
}

export async function deleteSource(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(sources).where(eq(sources.id, id)).run();
  redirect("/admin/sources");
}
