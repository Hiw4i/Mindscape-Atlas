import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { deleteIdea } from "@/app/admin/actions/ideas";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Badge } from "@/components/badge";
import { excerpt } from "@/lib/content";
import { attachSourcesToIdeas, getAllIdeasForAdmin } from "@/lib/queries";

export default async function AdminIdeasPage() {
  const rows = attachSourcesToIdeas(getAllIdeasForAdmin());

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Идеи</h1>
          <p className="mt-1 text-sm text-ink-2">
            Атомарные мысли из источников и личные наблюдения.
          </p>
        </div>
        <Link href="/admin/sources" className="btn btn-secondary">
          <Plus className="size-4" /> Добавить через источник
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">
          Идей пока нет. Добавьте источник и выпишите из него первую идею.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {rows.map(({ idea, source }) => (
            <li key={idea.id} className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  <Link href={`/admin/ideas/${idea.id}`} className="hover:text-accent">{idea.title}</Link>
                  {idea.status !== "published" && (
                    <span className="ml-2 rounded-md px-1.5 py-0.5 text-xs tone-amber">черновик</span>
                  )}
                  {idea.isDemo === 1 && <Badge tone="slate" className="ml-2">Демо</Badge>}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{excerpt(idea.text, 140)}</p>
                {source && (
                  <p className="mt-0.5 text-xs text-ink-3">
                    источник: <Link href={`/admin/sources/${source.id}`} className="hover:text-ink">{source.title}</Link>
                    {idea.timecode ? ` · ${idea.timecode}` : ""}
                  </p>
                )}
              </div>
              <Link href={`/admin/ideas/${idea.id}`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Редактировать">
                <Pencil className="size-4" />
              </Link>
              <form action={deleteIdea}>
                <input type="hidden" name="id" value={idea.id} />
                <ConfirmSubmit message={`Удалить идею "${idea.title}"?`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose">
                  <span aria-hidden>×</span>
                </ConfirmSubmit>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
