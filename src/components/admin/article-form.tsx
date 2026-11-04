import { saveArticle } from "@/app/admin/actions/articles";
import { CheckboxGrid, Field, Section } from "./form-ui";
import { EVIDENCE_LEVELS } from "@/lib/labels";
import type { Article } from "@/db/schema";

export interface ItemOption {
  id: number;
  label: string;
}

interface Props {
  article?: Article;
  topicItems: ItemOption[];
  sourceItems: ItemOption[];
  ideaItems: ItemOption[];
  stateItems: ItemOption[];
  selected?: {
    topicIds?: number[];
    sourceIds?: number[];
    ideaIds?: number[];
    stateIds?: number[];
    tagNames?: string;
  };
}

export function ArticleForm({
  article,
  topicItems,
  sourceItems,
  ideaItems,
  stateItems,
  selected = {},
}: Props) {
  return (
    <form action={saveArticle} className="space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}

      <Section title="Основное">
        <Field label="Заголовок">
          <input name="title" defaultValue={article?.title} required className="input" />
        </Field>
        {!article && (
          <Field label="Slug" hint="Оставьте пустым - сгенерируется из заголовка">
            <input name="slug" className="input" placeholder="strah-kritiki" />
          </Field>
        )}
        <Field label="Главный вопрос" hint="Какой вопрос закрывает материал">
          <textarea name="question" rows={2} defaultValue={article?.question} className="input" />
        </Field>
        <Field label="Краткая суть" hint="Самое ценное объяснение в нескольких предложениях">
          <textarea name="summary" rows={4} defaultValue={article?.summary} className="input" />
        </Field>
      </Section>

      <Section title="Блоки статьи (markdown, блоки необязательны)">
        <Field label="Глубокий разбор" hint="Механизмы, причины, факторы, нюансы">
          <textarea name="content" rows={14} defaultValue={article?.content} className="input font-mono text-xs" />
        </Field>
        <Field label="Распространённые заблуждения">
          <textarea name="misconceptions" rows={6} defaultValue={article?.misconceptions} className="input font-mono text-xs" />
        </Field>
        <Field label="Примеры из жизни">
          <textarea name="examples" rows={6} defaultValue={article?.examples} className="input font-mono text-xs" />
        </Field>
        <Field label="Практические выводы">
          <textarea name="takeaways" rows={6} defaultValue={article?.takeaways} className="input font-mono text-xs" />
        </Field>
      </Section>

      <Section title="Метаданные">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Статус">
            <select name="status" defaultValue={article?.status ?? "draft"} className="input">
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </Field>
          <Field label="Степень достоверности" hint="Уровень для ключевых утверждений">
            <select name="evidenceLevel" defaultValue={article?.evidenceLevel ?? "mixed"} className="input">
              {Object.entries(EVIDENCE_LEVELS).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Теги" hint="Через запятую; новые создаются автоматически">
          <input name="tags" defaultValue={selected.tagNames ?? ""} className="input" placeholder="тревога, самооценка" />
        </Field>
        <div className="flex gap-6 text-sm text-ink-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={article?.featured === 1} className="size-4 accent-[var(--accent)]" />
            На главной
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDemo" defaultChecked={article?.isDemo === 1} className="size-4 accent-[var(--accent)]" />
            Демо-материал
          </label>
        </div>
      </Section>

      <Section title="Связи">
        <Field label="Темы">
          <CheckboxGrid name="topicIds" items={topicItems} selected={selected.topicIds} />
        </Field>
        <Field label="Источники">
          <CheckboxGrid name="sourceIds" items={sourceItems} selected={selected.sourceIds} />
        </Field>
        <Field label="Идеи из источников">
          <CheckboxGrid name="ideaIds" items={ideaItems} selected={selected.ideaIds} columns="sm:grid-cols-1 lg:grid-cols-2" />
        </Field>
        <Field label="Состояния" hint="Страницы входа по переживанию">
          <CheckboxGrid name="stateIds" items={stateItems} selected={selected.stateIds} />
        </Field>
      </Section>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">Сохранить</button>
      </div>
    </form>
  );
}
