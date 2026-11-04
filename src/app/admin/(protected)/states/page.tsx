import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { deleteState, saveState } from "@/app/admin/actions/states";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Field, Section } from "@/components/admin/form-ui";
import { getIcon } from "@/lib/icons";
import { getStatesList } from "@/lib/queries";

export default async function AdminStatesPage() {
  const rows = getStatesList();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Состояния</h1>
        <p className="mt-1 text-sm text-ink-2">
          Вход в базу через переживание: "Мне страшно знакомиться", "Меня
          отвергли" и подобные. Каждое состояние собирает статьи, темы и мифы.
        </p>

        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {rows.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                <Icon className="size-4 text-ink-3" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    <Link href={`/admin/states/${s.id}`} className="hover:text-accent">{s.title}</Link>
                  </p>
                  <p className="text-xs text-ink-3">{s.slug}</p>
                </div>
                <Link href={`/admin/states/${s.id}`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Редактировать">
                  <Pencil className="size-4" />
                </Link>
                <Link href={`/states/${s.slug}`} className="text-xs text-ink-3 hover:text-ink">открыть</Link>
                <form action={deleteState}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmSubmit message={`Удалить состояние "${s.title}"?`} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose">
                    <span aria-hidden>×</span>
                  </ConfirmSubmit>
                </form>
              </li>
            );
          })}
        </ul>
        {rows.length === 0 && <p className="mt-4 text-sm text-ink-3">Состояний пока нет.</p>}
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Plus className="size-5 text-accent" /> Новое состояние
        </h2>
        <form action={saveState} className="mt-4">
          <Section title="Создание">
            <Field label="Название" hint="Формулировка от первого лица">
              <input name="title" required className="input" placeholder="Мне страшно знакомиться" />
            </Field>
            <Field label="Описание">
              <textarea name="description" rows={4} className="input" />
            </Field>
            <Field label="Иконка">
              <select name="icon" className="input">
                <option value="">- нет -</option>
                {["heart", "chat", "brain", "smile", "eye", "clock", "target", "help", "users", "shield", "compass", "flame", "moon", "anchor"].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
            <button type="submit" className="btn btn-primary">
              <Plus className="size-4" /> Создать
            </button>
          </Section>
        </form>
      </div>
    </div>
  );
}
