import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { deleteTopic, moveTopic, saveTopic } from "@/app/admin/actions/topics";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Field, Section } from "@/components/admin/form-ui";
import { ICON_NAMES, getIcon } from "@/lib/icons";
import { colorOfTopic, getChildTopics, getSections } from "@/lib/queries";

export default async function AdminTopicsPage() {
  const sections = getSections();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Дерево тем */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Темы и разделы</h1>
        <p className="mt-1 text-sm text-ink-2">
          Дерево без ограничения глубины. Верхний уровень - разделы, вложенные
          - темы и понятия.
        </p>

        <div className="mt-5 space-y-6">
          {sections.map((section) => {
            const Icon = getIcon(section.icon);
            const color = colorOfTopic(section);
            const children = getChildTopics(section.id);
            return (
              <div key={section.id}>
                <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
                  <Icon className={`size-5 c-${color}`} />
                  <Link href={`/admin/topics/${section.id}`} className="font-medium hover:text-accent">
                    {section.title}
                  </Link>
                  <span className="text-xs text-ink-3">{section.slug}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <form action={moveTopic}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Выше">
                        <ArrowUp className="size-4" />
                      </button>
                    </form>
                    <form action={moveTopic}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Ниже">
                        <ArrowDown className="size-4" />
                      </button>
                    </form>
                    <Link
                      href={`/admin/topics/${section.id}`}
                      className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"
                      aria-label="Редактировать"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteTopic}>
                      <input type="hidden" name="id" value={section.id} />
                      <ConfirmSubmit
                        message={`Удалить раздел "${section.title}" вместе с подтемами и связями?`}
                        className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:c-rose"
                      >
                        <span aria-hidden>×</span>
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="ml-8 mt-1.5 space-y-1.5">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
                        <Link href={`/admin/topics/${child.id}`} className="hover:text-accent">
                          {child.title}
                        </Link>
                        <span className="text-xs text-ink-3">{child.slug}</span>
                        <div className="ml-auto flex items-center gap-1">
                          <form action={moveTopic}>
                            <input type="hidden" name="id" value={child.id} />
                            <input type="hidden" name="dir" value="up" />
                            <button className="rounded-md p-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Выше">
                              <ArrowUp className="size-3.5" />
                            </button>
                          </form>
                          <form action={moveTopic}>
                            <input type="hidden" name="id" value={child.id} />
                            <input type="hidden" name="dir" value="down" />
                            <button className="rounded-md p-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Ниже">
                              <ArrowDown className="size-3.5" />
                            </button>
                          </form>
                          <Link
                            href={`/admin/topics/${child.id}`}
                            className="rounded-md p-1 text-ink-3 hover:bg-surface-2 hover:text-ink"
                            aria-label="Редактировать"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <form action={deleteTopic}>
                            <input type="hidden" name="id" value={child.id} />
                            <ConfirmSubmit
                              message={`Удалить тему "${child.title}" вместе со связями?`}
                              className="rounded-md p-1 text-ink-3 hover:bg-surface-2 hover:c-rose"
                            >
                              <span aria-hidden>×</span>
                            </ConfirmSubmit>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Форма создания */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Plus className="size-5 text-accent" /> Новый раздел или тема
        </h2>
        <form action={saveTopic} className="mt-4">
          <Section title="Создание">
            <Field label="Название">
              <input name="title" required className="input" placeholder="Например: Зависть" />
            </Field>
            <Field label="Родитель" hint="Пусто - верхний уровень (раздел)">
              <select name="parentId" className="input">
                <option value="">- верхний уровень -</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Иконка">
              <select name="icon" className="input">
                <option value="">- нет -</option>
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Описание">
              <textarea name="description" rows={3} className="input" />
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
