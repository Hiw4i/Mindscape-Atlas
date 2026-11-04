import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "../actions/auth";

export const metadata = { title: "Панель редактора" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-4">
        <Link href="/admin" className="font-semibold tracking-tight">
          Редактор базы
        </Link>
        <AdminNav />
        <div className="ml-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-ink-2 hover:text-ink">
            Открыть сайт
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-secondary">
              <LogOut className="size-4" /> Выйти
            </button>
          </form>
        </div>
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
