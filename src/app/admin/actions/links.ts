"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { topicLinks } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export async function saveTopicLink(formData: FormData) {
  await guard();
  const fromTopicId = Number(formData.get("fromTopicId"));
  const toTopicId = Number(formData.get("toTopicId"));
  const kind = String(formData.get("kind") ?? "related");
  const note = String(formData.get("note") ?? "").trim();
  if (fromTopicId && toTopicId && fromTopicId !== toTopicId) {
    db.insert(topicLinks).values({ fromTopicId, toTopicId, kind, note }).run();
  }
  redirect("/admin/connections");
}

export async function deleteTopicLink(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (id) db.delete(topicLinks).where(eq(topicLinks.id, id)).run();
  redirect("/admin/connections");
}
