import Link from "next/link";
import { Pencil } from "lucide-react";
import { deleteMyth } from "@/app/admin/actions/myths";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Badge } from "@/components/badge";
import { MYTH_VERDICTS } from "@/lib/labels";
import { getAllMythsForAdmin } from "@/lib/queries";

export default async function AdminMythsPage() {
  const list = getAllMythsForAdmin();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Мифы и заблуждения</h1>
        <Link href="/admin/myths/new" className="btn btn-primary">Новый разбор</Link>
      </div>

      {list.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">Разборов пока нет.</p>
      ) : (
        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {list.map((m) => {
            const verdict = MYTH_VERDICTS[m.verdict];
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">
                    <Link href={`/admin/myths/${m.id}`} className="hover:text-accent">
                      {m.statement}
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {m.isDemo === 1 && <Badge tone="slate">Демо</Badge>}
                  <Badge tone={verdict?.tone ?? "slate"}>{verdict?.label ?? m.verdict}</Badge>
                  <Badge tone={m.status === "published" ? "green" : "amber"}>
                    {m.status === "published" ? "Опубликовано" : "Черновик"}
                  </Badge>
                  <Link href={`/admin/myths/${m.id}`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Редактировать">
                    <Pencil className="size-4" />
                  </Link>
                  {m.status === "published" && (
                    <Link href={`/myths/${m.slug}`} className="text-xs text-ink-3 hover:text-ink">открыть</Link>
                  )}
                  <form action={deleteMyth}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit message={`Удалить разбор "${m.statement}"?`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose">
                      <span aria-hidden>×</span>
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
