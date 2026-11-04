import Link from "next/link";
import {
  attachTopics,
  buildTopicIndex,
  colorOfTopic,
  getPublishedArticles,
  getSections,
  type Topic,
} from "@/lib/queries";
import { DemoBadge, EvidenceBadge } from "@/components/badge";

export const metadata = { title: "Статьи" };

/** Указатель: оглавление тома, не галерея. Строки 48px по разделам. */
export default function ArticlesPage() {
  const rows = attachTopics(getPublishedArticles());
  const sections = getSections();
  const index = buildTopicIndex();

  const rootIdOf = (t: Topic) => {
    let cur = t;
    while (cur.parentId) {
      const parent = index.get(cur.parentId);
      if (!parent) break;
      cur = parent;
    }
    return cur.id;
  };

  const grouped = new Map<number, typeof rows>();
  const orphans: typeof rows = [];
  for (const row of rows) {
    if (!row.topics.length) {
      orphans.push(row);
      continue;
    }
    const rootId = rootIdOf(row.topics[0]);
    const list = grouped.get(rootId) ?? [];
    list.push(row);
    grouped.set(rootId, list);
  }

  let counter = 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Статьи
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Глубокие разборы по разделам. У каждого материала указана степень
          достоверности ключевых утверждений.
        </p>
      </header>

      {rows.length === 0 && (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          Опубликованных статей пока нет. Демо-материалы появляются после
          первого запуска проекта.
        </p>
      )}

      {sections.map((section) => {
        const list = grouped.get(section.id) ?? [];
        if (!list.length) return null;
        const color = colorOfTopic(section, index);
        return (
          <section key={section.id} className="mt-14">
            {/* Terrain-линейка 2px над группой */}
            <span
              aria-hidden="true"
              className="block h-[2px] w-12"
              style={{ background: `var(--c-${color})` }}
            />
            <h2 className="mt-3 flex items-baseline gap-3">
              <Link
                href={`/topics/${section.slug}`}
                className={`font-mono text-[13px] c-${color} hover:underline hover:underline-offset-4`}
              >
                {section.title}
              </Link>
              <span className="font-mono text-[13px] tabular-nums text-ink-3">
                {list.length}
              </span>
            </h2>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {list.map(({ article, topics }) => {
                counter += 1;
                const sub = topics.find((t) => t.id !== section.id && t.parentId !== null);
                return (
                  <li key={article.id}>
                    <Link href={`/articles/${article.slug}`} className="index-row group">
                      <span className="font-mono text-[13px] tabular-nums text-ink-3">
                        {String(counter).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[20px] leading-snug group-hover:text-route">
                          {article.title}
                        </span>
                        {sub && (
                          <span className="block truncate font-mono text-[13px] text-ink-3">
                            {sub.title}
                          </span>
                        )}
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-4">
                        {article.isDemo === 1 && <DemoBadge />}
                        <span className="hidden font-mono text-[13px] tabular-nums text-ink-3 sm:inline">
                          {article.readingMinutes} мин
                        </span>
                        <EvidenceBadge level={article.evidenceLevel} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {orphans.length > 0 && (
        <section className="mt-14">
          <span aria-hidden="true" className="block h-[2px] w-12 bg-line" />
          <h2 className="mt-3 font-mono text-[13px] text-ink-3">Без раздела</h2>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {orphans.map(({ article }) => {
              counter += 1;
              return (
                <li key={article.id}>
                  <Link href={`/articles/${article.slug}`} className="index-row group">
                    <span className="font-mono text-[13px] tabular-nums text-ink-3">
                      {String(counter).padStart(2, "0")}
                    </span>
                    <span className="text-[20px] leading-snug group-hover:text-route">
                      {article.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
