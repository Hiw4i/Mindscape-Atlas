import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { deleteIdea, saveIdea } from "@/app/admin/actions/ideas";
import { deleteSource, saveSource } from "@/app/admin/actions/sources";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CheckboxGrid, Field, Section } from "@/components/admin/form-ui";
import { SOURCE_KINDS } from "@/lib/labels";
import { excerpt } from "@/lib/content";
import { topicOptions } from "@/lib/admin";
import { getIdeasBySource, getSourceById } from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSourceEditPage({ params }: PageProps) {
  const { id } = await params;
  const source = getSourceById(Number(id));
  if (!source) notFound();

  const ideas = getIdeasBySource(source.id);
  const topics = topicOptions();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">{source.title}</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/admin/sources" className="text-ink-2 hover:text-ink">к списку</Link>
        </div>
      </div>

      {/* Редактирование источника */}
      <form action={saveSource} className="mt-5">
        <input type="hidden" name="id" value={source.id} />
        <Section title="Источник">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Тип">
              <select name="kind" defaultValue={source.kind} className="input">
                {Object.entries(SOURCE_KINDS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Автор">
              <input name="author" defaultValue={source.author} className="input" />
            </Field>
          </div>
          <Field label="Название">
            <input name="title" defaultValue={source.title} required className="input" />
          </Field>
          <Field label="Ссылка">
            <input name="url" type="url" defaultValue={source.url} className="input" />
          </Field>
          <Field label="Описание">
            <textarea name="description" rows={3} defaultValue={source.description} className="input" />
          </Field>
          <Field label="Конспект">
            <textarea name="notes" rows={4} defaultValue={source.notes} className="input" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" name="isDemo" defaultChecked={source.isDemo === 1} className="size-4 accent-[var(--accent)]" />
            Демо-материал
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Сохранить</button>
          </div>
        </Section>
      </form>

      {/* Идеи источника */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Идеи из материала</h2>
        <p className="mt-1 text-sm text-ink-2">
          Разбивайте материал на отдельные мысли: одна идея - одно наблюдение,
          привязанное к темам.
        </p>

        <ul className="mt-4 space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="flex items-start gap-2 rounded-lg border border-line bg-surface px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  <Link href={`/admin/ideas/${idea.id}`} className="hover:text-accent">{idea.title}</Link>
                  {idea.status !== "published" && (
                    <span className="ml-2 rounded-md px-1.5 py-0.5 text-xs tone-amber">черновик</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{excerpt(idea.text, 140)}</p>
              </div>
              <Link href={`/admin/ideas/${idea.id}`} className="text-xs text-ink-3 hover:text-ink">
                редактор
              </Link>
              <form action={deleteIdea}>
                <input type="hidden" name="id" value={idea.id} />
                <input type="hidden" name="returnTo" value="source" />
                <input type="hidden" name="sourceId" value={source.id} />
                <ConfirmSubmit message="Удалить идею?" className="rounded-md p-1 text-ink-3 hover:c-rose">
                  <Trash2 className="size-3.5" />
                </ConfirmSubmit>
              </form>
            </li>
          ))}
        </ul>
        {ideas.length === 0 && <p className="mt-3 text-sm text-ink-3">Идей пока нет - добавьте первую ниже.</p>}

        <form action={saveIdea} className="mt-5">
          <input type="hidden" name="sourceId" value={source.id} />
          <input type="hidden" name="returnTo" value="source" />
          <Section title="Новая идея">
            <Field label="Краткое название идеи">
              <input name="title" required className="input" />
            </Field>
            <Field label="Суть идеи">
              <textarea name="text" rows={4} className="input" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Цитата" hint="Дословная цитата, если есть">
                <textarea name="quote" rows={2} className="input" />
              </Field>
              <Field label="Таймкод" hint="Для видео: 12:34">
                <input name="timecode" className="input" placeholder="12:34" />
              </Field>
            </div>
            <Field label="Темы">
              <CheckboxGrid name="topicIds" items={topics} />
            </Field>
            <Field label="Статус">
              <select name="status" className="input">
                <option value="published">Опубликовано</option>
                <option value="draft">Черновик</option>
              </select>
            </Field>
            <button type="submit" className="btn btn-primary">
              <Plus className="size-4" /> Добавить идею
            </button>
          </Section>
        </form>
      </section>

      <div className="mt-8 border-t border-line pt-6">
        <form action={deleteSource}>
          <input type="hidden" name="id" value={source.id} />
          <ConfirmSubmit message={`Удалить источник "${source.title}"?`}>
            <Trash2 className="size-4" /> Удалить источник
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
