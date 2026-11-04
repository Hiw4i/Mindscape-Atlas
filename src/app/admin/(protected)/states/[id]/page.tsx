import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteState, saveState } from "@/app/admin/actions/states";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CheckboxGrid, Field, Section } from "@/components/admin/form-ui";
import { ICON_NAMES } from "@/lib/icons";
import { articleOptions, mythOptions, topicOptions } from "@/lib/admin";
import {
  getStateArticles,
  getStateMyths,
  getStateTopics,
  getStateById,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminStateEditPage({ params }: PageProps) {
  const { id } = await params;
  const state = getStateById(Number(id));
  if (!state) notFound();

  const selectedArticleIds = getStateArticles(state.id).map((a) => a.id);
  const selectedTopicIds = getStateTopics(state.id).map((t) => t.id);
  const selectedMythIds = getStateMyths(state.id).map((m) => m.id);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Состояние: {state.title}</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link href={`/states/${state.slug}`} className="text-ink-2 hover:text-ink">открыть на сайте</Link>
          <Link href="/admin/states" className="text-ink-2 hover:text-ink">к списку</Link>
        </div>
      </div>

      <form action={saveState} className="mt-5">
        <input type="hidden" name="id" value={state.id} />
        <Section title="Основное">
          <Field label="Название">
            <input name="title" defaultValue={state.title} required className="input" />
          </Field>
          <Field label="Иконка">
            <select name="icon" defaultValue={state.icon} className="input">
              <option value="">- нет -</option>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Порядок">
            <input name="sortOrder" type="number" defaultValue={state.sortOrder} className="input" />
          </Field>
          <Field label="Описание">
            <textarea name="description" rows={4} defaultValue={state.description} className="input" />
          </Field>
        </Section>

        <div className="mt-6">
          <Section title="Содержимое состояния">
            <Field label="Статьи">
              <CheckboxGrid name="articleIds" items={articleOptions()} selected={selectedArticleIds} />
            </Field>
            <Field label="Темы">
              <CheckboxGrid name="topicIds" items={topicOptions()} selected={selectedTopicIds} />
            </Field>
            <Field label="Мифы">
              <CheckboxGrid name="mythIds" items={mythOptions()} selected={selectedMythIds} columns="sm:grid-cols-1 lg:grid-cols-2" />
            </Field>
            <button type="submit" className="btn btn-primary">Сохранить</button>
          </Section>
        </div>
      </form>

      <div className="mt-8 border-t border-line pt-6">
        <form action={deleteState}>
          <input type="hidden" name="id" value={state.id} />
          <ConfirmSubmit message={`Удалить состояние "${state.title}"?`}>
            <Trash2 className="size-4" /> Удалить состояние
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
