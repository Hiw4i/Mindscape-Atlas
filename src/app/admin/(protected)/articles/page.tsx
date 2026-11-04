import Link from "next/link";
import { Pencil } from "lucide-react";
import { deleteArticle } from "@/app/admin/actions/articles";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Badge } from "@/components/badge";
import { excerpt } from "@/lib/content";
import { getAllArticlesForAdmin } from "@/lib/queries";

export default async function AdminArticlesPage() {
  const rows = getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Статьи</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">Новая статья</Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">Статей пока нет.</p>
      ) : (
        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">
                  <Link href={`/admin/articles/${a.id}`} className="hover:text-accent">
                    {a.title}
                  </Link>
                </p>
                <p className="mt-0.5 text-xs text-ink-3">{excerpt(a.summary || a.content, 110)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {a.isDemo === 1 && <Badge tone="slate">Демо</Badge>}
                {a.featured === 1 && <Badge tone="accent">На главной</Badge>}
                <Badge tone={a.status === "published" ? "green" : "amber"}>
                  {a.status === "published" ? "Опубликовано" : "Черновик"}
                </Badge>
                <Link href={`/admin/articles/${a.id}`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Редактировать">
                  <Pencil className="size-4" />
                </Link>
                {a.status === "published" && (
                  <Link href={`/articles/${a.slug}`} className="text-xs text-ink-3 hover:text-ink">
                    открыть
                  </Link>
                )}
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={a.id} />
                  <ConfirmSubmit message={`Удалить статью "${a.title}"?`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose">
                    <span aria-hidden>×</span>
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
