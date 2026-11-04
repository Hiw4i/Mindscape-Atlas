import { Plus, Trash2 } from "lucide-react";
import { deleteTopicLink, saveTopicLink } from "@/app/admin/actions/links";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Field, Section } from "@/components/admin/form-ui";
import { TOPIC_LINK_KINDS } from "@/lib/labels";
import { getAllTopicLinksForAdmin } from "@/lib/queries";
import { topicOptions } from "@/lib/admin";

export default async function AdminConnectionsPage() {
  const rows = getAllTopicLinksForAdmin();
  const topics = topicOptions();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Связи тем</h1>
        <p className="mt-1 text-sm text-ink-2">
          Каждая связь появляется на карте понятий и в списках связанных тем.
        </p>

        <ul className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
          {rows.map((l) => (
            <li key={l.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="font-medium">{l.fromTitle}</span>
                <span className="text-ink-3"> - {TOPIC_LINK_KINDS[l.kind]?.label ?? l.kind} - </span>
                <span className="font-medium">{l.toTitle}</span>
                {l.note && <span className="text-ink-3"> ({l.note})</span>}
              </span>
              <form action={deleteTopicLink}>
                <input type="hidden" name="id" value={l.id} />
                <ConfirmSubmit message="Удалить связь?" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose">
                  <Trash2 className="size-4" />
                </ConfirmSubmit>
              </form>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="mt-4 text-sm text-ink-3">Связей пока нет.</p>}
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Plus className="size-5 text-accent" /> Новая связь
        </h2>
        <form action={saveTopicLink} className="mt-4">
          <Section title="Создание">
            <Field label="Тема 1">
              <select name="fromTopicId" required className="input">
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Тип связи">
              <select name="kind" className="input">
                {Object.entries(TOPIC_LINK_KINDS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Тема 2">
              <select name="toTopicId" required className="input">
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Пояснение" hint="Короткое пояснение связи, необязательно">
              <input name="note" className="input" />
            </Field>
            <button type="submit" className="btn btn-primary">
              <Plus className="size-4" /> Создать связь
            </button>
          </Section>
        </form>
      </div>
    </div>
  );
}
