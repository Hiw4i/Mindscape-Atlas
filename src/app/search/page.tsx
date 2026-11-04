import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { VerdictBadge } from "@/components/badge";
import { searchAll } from "@/lib/search";
import { attachTopics } from "@/lib/queries";
import { excerpt } from "@/lib/content";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = { title: "Поиск" };

/** Компас: ведёт к листам. Плотный указатель с mono-меткой типа. */
export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q ? searchAll(q) : null;
  const articleTopicsList = results ? attachTopics(results.articles.map((h) => h.row)) : [];
  const topicsById = new Map(articleTopicsList.map((r) => [r.article.id, r.topics]));

  const total = results
    ? results.articles.length + results.myths.length + results.ideas.length + results.topics.length + results.states.length
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Поиск
        </h1>
        <p className="mt-5 max-w-2xl font-mono text-[13px] leading-relaxed text-ink-2">
          Работает по заголовкам, тексту материалов, тегам и синонимам.
        </p>
      </header>

      <div className="mt-8">
        <SearchBar defaultValue={q} big />
      </div>

      {!results && (
        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          Введите вопрос своими словами: "почему я боюсь критики",
          "привязанность", "что делает человека счастливым".
        </p>
      )}

      {results && (
        <div className="mt-12">
          {total === 0 && (
            <div className="mt-4 border-t border-line pt-8">
              <p className="text-[26px] font-semibold tracking-tight">Ничего не нашлось</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
                Попробуйте другие слова или короче. База наполняется
                постепенно: отсутствие результата означает, что материала по
                этому вопросу ещё нет.
              </p>
              <p className="mt-6 font-mono text-[13px] text-ink-3">Три стартовых маршрута</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                <li>
                  <Link href="/topics" className="index-row group">
                    <span className="font-mono text-[13px] text-ink-3">01</span>
                    <span className="text-[17px] group-hover:text-route">К разделам - от общего понятия к частному</span>
                  </Link>
                </li>
                <li>
                  <Link href="/states" className="index-row group">
                    <span className="font-mono text-[13px] text-ink-3">02</span>
                    <span className="text-[17px] group-hover:text-route">К состояниям - начать с того, что чувствуете</span>
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="index-row group">
                    <span className="font-mono text-[13px] text-ink-3">03</span>
                    <span className="text-[17px] group-hover:text-route">К карте связей - увидеть систему целиком</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {results.states.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[13px] text-ink-3">Состояния</p>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {results.states.map((s) => (
                  <li key={s.id}>
                    <Link href={`/states/${s.slug}`} className="index-row group">
                      <span className="font-mono text-[13px] text-ink-3">состояние</span>
                      <span className="min-w-0">
                        <span className="block text-[17px] leading-snug group-hover:text-route">
                          {s.title}
                        </span>
                        <span className="block truncate font-mono text-[13px] text-ink-3">
                          {excerpt(s.description, 110)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.topics.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[13px] text-ink-3">Темы</p>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {results.topics.map((t) => (
                  <li key={t.id}>
                    <Link href={`/topics/${t.slug}`} className="index-row group">
                      <span className="font-mono text-[13px] text-ink-3">тема</span>
                      <span className="min-w-0">
                        <span className="block text-[17px] leading-snug group-hover:text-route">
                          {t.title}
                        </span>
                        {t.description && (
                          <span className="block truncate font-mono text-[13px] text-ink-3">
                            {excerpt(t.description, 110)}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.articles.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[13px] text-ink-3">Статьи</p>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {results.articles.map((hit) => (
                  <li key={hit.row.id} className="py-4">
                    <Link
                      href={`/articles/${hit.row.slug}`}
                      className="group flex items-baseline gap-3"
                    >
                      <span className="font-mono text-[13px] text-ink-3">статья</span>
                      <span className="text-[20px] leading-snug group-hover:text-route">
                        {hit.row.title}
                      </span>
                    </Link>
                    {hit.snippet && (
                      <p
                        className="mt-1 pl-[4.2rem] text-[15px] leading-relaxed text-ink-2 [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{ __html: hit.snippet }}
                      />
                    )}
                    {(topicsById.get(hit.row.id) ?? []).length > 0 && (
                      <p className="mt-1 pl-[4.2rem] font-mono text-[13px] text-ink-3">
                        {(topicsById.get(hit.row.id) ?? []).slice(0, 3).map((t) => t.title).join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.myths.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[13px] text-ink-3">Мифы</p>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {results.myths.map((hit) => (
                  <li key={hit.row.id} className="py-4">
                    <Link
                      href={`/myths/${hit.row.slug}`}
                      className="group flex items-baseline gap-3"
                    >
                      <span className="font-mono text-[13px] text-ink-3">миф</span>
                      <span className="text-[17px] leading-snug group-hover:text-route">
                        {hit.row.statement}
                      </span>
                    </Link>
                    <div className="mt-1.5 pl-[4.2rem]">
                      <VerdictBadge verdict={hit.row.verdict} />
                    </div>
                    {hit.snippet && (
                      <p
                        className="mt-1.5 pl-[4.2rem] text-[15px] leading-relaxed text-ink-2 [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{ __html: hit.snippet }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.ideas.length > 0 && (
            <section className="mt-10">
              <p className="font-mono text-[13px] text-ink-3">Идеи</p>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {results.ideas.map((hit) => (
                  <li key={hit.row.id} className="py-4">
                    <p className="flex items-baseline gap-3">
                      <span className="font-mono text-[13px] text-ink-3">идея</span>
                      <span className="text-[17px] font-medium leading-snug">{hit.row.title}</span>
                    </p>
                    {hit.snippet && (
                      <p
                        className="mt-1 pl-[4.2rem] text-[15px] leading-relaxed text-ink-2 [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{ __html: hit.snippet }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
