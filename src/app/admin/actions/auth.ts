"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, createSession, destroySession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) redirect("/admin/login?error=1");
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
