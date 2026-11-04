import Link from "next/link";
import {
  colorOfTopic,
  getArticlesByTopic,
  getChildTopics,
  getSections,
} from "@/lib/queries";

export const metadata = { title: "Разделы и темы" };

export default function TopicsPage() {
  const sections = getSections();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Разделы и темы
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Вход в базу знаний по темам. Внутри раздела можно идти от общего
          понятия к частному: например, от "Общения и людей" к "Страху
          критики" и дальше к самооценке и стыду.
        </p>
      </header>

      {sections.length === 0 && (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          Разделы ещё не созданы. Добавьте первый раздел в админ-панели.
        </p>
      )}

      {sections.map((section) => {
        const color = colorOfTopic(section);
        const children = getChildTopics(section.id);
        return (
          <section key={section.id} className="mt-14">
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
                {children.length}
              </span>
            </h2>
            {section.description && (
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
                {section.description}
              </p>
            )}
            {children.length > 0 && (
              <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                {children.map((child) => {
                  const n = getArticlesByTopic(child.id).length;
                  const childColor = colorOfTopic(child);
                  return (
                    <li key={child.id} className="border-t border-line">
                      <Link href={`/topics/${child.slug}`} className="index-row group w-full">
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 translate-y-[-2px] rounded-full"
                          style={{ background: `var(--c-${childColor})` }}
                        />
                        <span className="min-w-0 flex-1 truncate text-[17px] leading-snug group-hover:text-route">
                          {child.title}
                        </span>
                        {n > 0 && (
                          <span className="ml-auto font-mono text-[13px] tabular-nums text-ink-3">
                            {n}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
