import { saveMyth } from "@/app/admin/actions/myths";
import { CheckboxGrid, Field, Section } from "./form-ui";
import { MYTH_VERDICTS } from "@/lib/labels";
import type { Myth } from "@/db/schema";
import type { ItemOption } from "@/lib/admin";

interface Props {
  myth?: Myth;
  topicItems: ItemOption[];
  selected?: {
    topicIds?: number[];
    tagNames?: string;
  };
}

export function MythForm({ myth, topicItems, selected = {} }: Props) {
  return (
    <form action={saveMyth} className="space-y-6">
      {myth && <input type="hidden" name="id" value={myth.id} />}

      <Section title="Разбираемое утверждение">
        <Field label="Утверждение" hint="Формулировка, которую нужно проверить">
          <textarea name="statement" rows={2} defaultValue={myth?.statement} required className="input" />
        </Field>
        {!myth && (
          <Field label="Slug" hint="Оставьте пустым для авто-генерации">
            <input name="slug" className="input" />
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Вердикт">
            <select name="verdict" defaultValue={myth?.verdict ?? "unproven"} className="input">
              {Object.entries(MYTH_VERDICTS).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Статус">
            <select name="status" defaultValue={myth?.status ?? "draft"} className="input">
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" name="isDemo" defaultChecked={myth?.isDemo === 1} className="size-4 accent-[var(--accent)]" />
          Демо-материал
        </label>
      </Section>

      <Section title="Разбор (markdown, блоки необязательны)">
        <Field label="Почему люди в это верят">
          <textarea name="whyBelieve" rows={4} defaultValue={myth?.whyBelieve} className="input font-mono text-xs" />
        </Field>
        <Field label="Что говорят доказательства" hint="Исследования и данные; без выдуманных ссылок">
          <textarea name="evidence" rows={6} defaultValue={myth?.evidence} className="input font-mono text-xs" />
        </Field>
        <Field label="Что известно и что остаётся неизвестным">
          <textarea name="unknown" rows={4} defaultValue={myth?.unknown} className="input font-mono text-xs" />
        </Field>
        <Field label="Более точная формулировка">
          <textarea name="better" rows={4} defaultValue={myth?.better} className="input font-mono text-xs" />
        </Field>
      </Section>

      <Section title="Связи и теги">
        <Field label="Темы">
          <CheckboxGrid name="topicIds" items={topicItems} selected={selected.topicIds} />
        </Field>
        <Field label="Теги" hint="Через запятую">
          <input name="tags" defaultValue={selected.tagNames ?? ""} className="input" />
        </Field>
      </Section>

      <button type="submit" className="btn btn-primary">Сохранить</button>
    </form>
  );
}
