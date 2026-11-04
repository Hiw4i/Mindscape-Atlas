import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { searchAll } from "@/lib/search";
import { excerpt } from "@/lib/content";

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchAll(q, true) : null;
  const total = results
    ? results.articles.length + results.myths.length + results.ideas.length + results.topics.length + results.states.length
    : 0;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Поиск по базе</h1>
      <p className="mt-1 text-sm text-ink-2">
        Поиск включает черновики. Результаты ведут прямо в редакторы.
      </p>

      <div className="mt-4 max-w-xl">
        <SearchBar defaultValue={q} />
      </div>

      {results && (
        <div className="mt-8 space-y-8">
          {total === 0 && (
            <p className="text-sm text-ink-3">
              По запросу "{q}" ничего не найдено.
            </p>
          )}

          {results.articles.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Статьи</h2>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
                {results.articles.map((hit) => (
                  <li key={hit.row.id} className="px-4 py-3 text-sm">
                    <Link href={`/admin/articles/${hit.row.id}`} className="font-medium hover:text-accent">
                      {hit.row.title}
                    </Link>
                    <span className="ml-2 text-xs text-ink-3">
                      {hit.row.status === "published" ? "опубликовано" : "черновик"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.myths.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Мифы</h2>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
                {results.myths.map((hit) => (
                  <li key={hit.row.id} className="px-4 py-3 text-sm">
                    <Link href={`/admin/myths/${hit.row.id}`} className="font-medium hover:text-accent">
                      {hit.row.statement}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.ideas.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Идеи</h2>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
                {results.ideas.map((hit) => (
                  <li key={hit.row.id} className="px-4 py-3 text-sm">
                    <Link href={`/admin/ideas/${hit.row.id}`} className="font-medium hover:text-accent">
                      {hit.row.title}
                    </Link>
                    <span className="ml-2 text-xs text-ink-3">{excerpt(hit.row.text, 90)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.topics.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Темы</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {results.topics.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/topics/${t.id}`}
                      className="inline-flex rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-2 hover:text-ink"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.states.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Состояния</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {results.states.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/admin/states/${s.id}`}
                      className="inline-flex rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-2 hover:text-ink"
                    >
                      {s.title}
                    </Link>
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
