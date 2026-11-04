import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { deleteSource, saveSource } from "@/app/admin/actions/sources";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Field, Section } from "@/components/admin/form-ui";
import { getSourceKindIcon } from "@/lib/icons";
import { SOURCE_KINDS } from "@/lib/labels";
import { getSourcesList } from "@/lib/queries";

export default async function AdminSourcesPage() {
  const rows = getSourcesList();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Источники</h1>
        <p className="mt-1 text-sm text-ink-2">
          Видео, книги, лекции и исследования - сырьё для базы знаний.
        </p>

        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {rows.map((s) => {
            const Icon = getSourceKindIcon(s.kind);
            return (
              <li key={s.id} className="flex items-start gap-3 px-4 py-3">
                <Icon className="mt-1 size-4 text-ink-3" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">
                    <Link href={`/admin/sources/${s.id}`} className="hover:text-accent">{s.title}</Link>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {SOURCE_KINDS[s.kind]?.label ?? s.kind}
                    {s.author ? ` · ${s.author}` : ""} · {s.ideaCount} идей
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-ink" aria-label="Открыть источник">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <Link href={`/admin/sources/${s.id}`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Редактировать">
                    <Pencil className="size-4" />
                  </Link>
                  <form action={deleteSource}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmSubmit
                      message={`Удалить источник "${s.title}"? Его идеи останутся в базе без источника.`}
                      className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose"
                    >
                      <span aria-hidden>×</span>
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
        {rows.length === 0 && <p className="mt-4 text-sm text-ink-3">Источников пока нет.</p>}
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Plus className="size-5 text-accent" /> Новый источник
        </h2>
        <form action={saveSource} className="mt-4">
          <Section title="Добавление">
            <Field label="Тип">
              <select name="kind" className="input">
                {Object.entries(SOURCE_KINDS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Название">
              <input name="title" required className="input" />
            </Field>
            <Field label="Автор">
              <input name="author" className="input" />
            </Field>
            <Field label="Ссылка" hint="URL видео, статьи или исследования">
              <input name="url" type="url" className="input" placeholder="https://" />
            </Field>
            <Field label="Описание">
              <textarea name="description" rows={3} className="input" />
            </Field>
            <Field label="Конспект" hint="Общие заметки по материалу">
              <textarea name="notes" rows={4} className="input" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              <input type="checkbox" name="isDemo" className="size-4 accent-[var(--accent)]" />
              Демо-материал
            </label>
            <button type="submit" className="btn btn-primary">
              <Plus className="size-4" /> Добавить
            </button>
          </Section>
        </form>
      </div>
    </div>
  );
}
