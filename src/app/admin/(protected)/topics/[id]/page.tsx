import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteTopic, saveTopic } from "@/app/admin/actions/topics";
import { deleteTopicLink } from "@/app/admin/actions/links";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Field, Section } from "@/components/admin/form-ui";
import { ICON_NAMES } from "@/lib/icons";
import {
  getAllTopics,
  getTopicAncestors,
  getTopicById,
  getTopicLinksFor,
} from "@/lib/queries";
import { TOPIC_LINK_KINDS } from "@/lib/labels";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTopicEditPage({ params }: PageProps) {
  const { id } = await params;
  const topic = getTopicById(Number(id));
  if (!topic) notFound();

  const all = getAllTopics().filter((t) => t.id !== topic.id);
  const ancestors = getTopicAncestors(topic);
  const links = getTopicLinksFor(topic.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Тема: {topic.title}
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          Slug: {topic.slug}
          {ancestors.length > 0 && ` · внутри ${ancestors.map((a) => a.title).join(" -> ")}`}
        </p>

        <form action={saveTopic} className="mt-5">
          <input type="hidden" name="id" value={topic.id} />
          <Section title="Основное">
            <Field label="Название">
              <input name="title" defaultValue={topic.title} required className="input" />
            </Field>
            <Field label="Родитель" hint="Пусто - верхний уровень (раздел)">
              <select name="parentId" defaultValue={topic.parentId ?? ""} className="input">
                <option value="">- верхний уровень -</option>
                {all.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} (#{t.id})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Иконка">
              <select name="icon" defaultValue={topic.icon} className="input">
                <option value="">- нет -</option>
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Порядок">
              <input name="sortOrder" type="number" defaultValue={topic.sortOrder} className="input" />
            </Field>
            <Field label="Описание">
              <textarea name="description" rows={4} defaultValue={topic.description} className="input" />
            </Field>
            <button type="submit" className="btn btn-primary">Сохранить</button>
          </Section>
        </form>
      </div>

      <div>
        <Section title="Связи этой темы">
          {links.length === 0 ? (
            <p className="text-sm text-ink-3">
              Связей нет. Добавьте их на странице Связи тем.
            </p>
          ) : (
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={`${l.id}-${l.direction}`} className="flex items-center gap-2 text-sm">
                  <span className="text-ink-2">
                    <Link href={`/topics/${l.other.slug}`} className="text-ink hover:text-accent">
                      {l.other.title}
                    </Link>
                    {" "}- {TOPIC_LINK_KINDS[l.kind]?.label ?? l.kind}
                    {l.note ? ` (${l.note})` : ""}
                  </span>
                  <form action={deleteTopicLink} className="ml-auto">
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="returnTo" value={`/admin/topics/${topic.id}`} />
                    <ConfirmSubmit message="Удалить эту связь?" className="rounded-md p-1 text-ink-3 hover:c-rose">
                      <Trash2 className="size-3.5" />
                    </ConfirmSubmit>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-ink-3">
            Управление связями: <Link href="/admin/connections" className="text-accent hover:underline">Связи тем</Link>
          </p>
        </Section>

        <div className="mt-6">
          <form action={deleteTopic}>
            <input type="hidden" name="id" value={topic.id} />
            <ConfirmSubmit
              message={`Удалить тему "${topic.title}"? Связанные материалы останутся, но потеряют эту тему.`}
            >
              <Trash2 className="size-4" /> Удалить тему
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </div>
  );
}
