import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { deleteIdea, deleteIdeaRelation, saveIdea, saveIdeaRelation } from "@/app/admin/actions/ideas";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CheckboxGrid, Field, Section } from "@/components/admin/form-ui";
import { IDEA_RELATION_KINDS } from "@/lib/labels";
import { ideaOptions, sourceOptions, topicOptions } from "@/lib/admin";
import {
  getIdeaById,
  getIdeaRelationsFor,
  getIdeaTopics,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminIdeaEditPage({ params }: PageProps) {
  const { id } = await params;
  const idea = getIdeaById(Number(id));
  if (!idea) notFound();

  const sources = sourceOptions();
  const topics = topicOptions();
  const selectedTopicIds = getIdeaTopics(idea.id).map((t) => t.id);
  const relations = getIdeaRelationsFor([idea.id]);
  const otherIdeas = ideaOptions(idea.id);
  const returnTo = `/admin/ideas/${idea.id}`;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Редактирование идеи</h1>
        <Link href="/admin/ideas" className="text-sm text-ink-2 hover:text-ink">к списку</Link>
      </div>

      <form action={saveIdea} className="mt-5">
        <input type="hidden" name="id" value={idea.id} />
        <Section title="Идея">
          <Field label="Название">
            <input name="title" defaultValue={idea.title} required className="input" />
          </Field>
          <Field label="Источник" hint="Пусто - личное наблюдение без источника">
            <select name="sourceId" defaultValue={idea.sourceId ?? ""} className="input">
              <option value="">- личное наблюдение -</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Суть идеи">
            <textarea name="text" rows={5} defaultValue={idea.text} className="input" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Цитата">
              <textarea name="quote" rows={2} defaultValue={idea.quote} className="input" />
            </Field>
            <Field label="Таймкод">
              <input name="timecode" defaultValue={idea.timecode} className="input" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Статус">
              <select name="status" defaultValue={idea.status} className="input">
                <option value="published">Опубликовано</option>
                <option value="draft">Черновик</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" name="isDemo" defaultChecked={idea.isDemo === 1} className="size-4 accent-[var(--accent)]" />
            Демо-материал
          </label>
          <Field label="Темы">
            <CheckboxGrid name="topicIds" items={topics} selected={selectedTopicIds} />
          </Field>
          <button type="submit" className="btn btn-primary">Сохранить</button>
        </Section>
      </form>

      {/* Связи с другими идеями */}
      <section className="mt-8">
        <Section title="Связи с другими идеями">
          {relations.length === 0 ? (
            <p className="text-sm text-ink-3">
              Связей нет. Связи помогают увидеть, какие идеи развивают,
              дополняют или оспаривают друг друга.
            </p>
          ) : (
            <ul className="space-y-2">
              {relations.map((r) => {
                const isFrom = r.fromIdeaId === idea.id;
                const kindLabel = IDEA_RELATION_KINDS[r.kind]?.label ?? r.kind;
                const otherTitle = isFrom ? r.toTitle : r.fromTitle;
                return (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-ink-2">
                    <span>
                      {isFrom ? (
                        <>
                          <span className="text-ink-3">эта идея </span>
                          <span className="text-ink">{kindLabel.toLowerCase()}</span>
                          <span className="text-ink-3">: </span>
                          <span className="text-ink">{otherTitle}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-ink">{otherTitle}</span>
                          <span className="text-ink-3"> {kindLabel.toLowerCase()} эту идею</span>
                        </>
                      )}
                    </span>
                    <form action={deleteIdeaRelation} className="ml-auto">
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <ConfirmSubmit message="Удалить связь?" className="rounded-md p-1 text-ink-3 hover:c-rose">
                        <Trash2 className="size-3.5" />
                      </ConfirmSubmit>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}

          <form action={saveIdeaRelation} className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
            <input type="hidden" name="fromIdeaId" value={idea.id} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <div>
              <label className="block text-sm font-medium">Тип связи</label>
              <select name="kind" className="input">
                {Object.entries(IDEA_RELATION_KINDS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">К какой идее</label>
              <select name="toIdeaId" className="input" required>
                {otherIdeas.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-secondary h-[38px]">
              <Plus className="size-4" /> Связать
            </button>
          </form>
        </Section>
      </section>

      <div className="mt-8 border-t border-line pt-6">
        <form action={deleteIdea}>
          <input type="hidden" name="id" value={idea.id} />
          <ConfirmSubmit message={`Удалить идею "${idea.title}"?`}>
            <Trash2 className="size-4" /> Удалить идею
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
