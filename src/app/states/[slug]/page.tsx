import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceBadge, VerdictBadge } from "@/components/badge";
import {
  attachTopics,
  getMythTopics,
  getStateArticles,
  getStateBySlug,
  getStateMyths,
  getStateTopics,
  getStatesList,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  return { title: state?.title ?? "Состояние" };
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const articles = attachTopics(getStateArticles(state.id));
  const topics = getStateTopics(state.id);
  const myths = getStateMyths(state.id);
  const siblings = getStatesList().filter((s) => s.id !== state.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Хлебные крошки" className="font-mono text-[13px] text-ink-3">
        <Link href="/states" className="hover:text-ink">Состояния</Link>
        <span>{" / "}{state.title}</span>
      </nav>

      {/* Заголовок - вопрос читателя */}
      <header className="mt-8">
        <p className="font-mono text-[13px] text-ink-3">Вы здесь</p>
        <span aria-hidden="true" className="mt-2 block h-[2px] w-12 bg-route" />
        <h1 className="mt-6 max-w-3xl text-[clamp(26px,4vw,34px)] font-semibold italic leading-[1.2] tracking-tight text-balance">
          {state.title}
        </h1>
        {state.description && (
          <p className="mt-5 max-w-[62ch] text-[20px] leading-relaxed text-ink-2">
            {state.description}
          </p>
        )}
      </header>

      {/* Релевантные темы */}
      {topics.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[13px] text-ink-3">Релевантные темы</p>
          <ul className="mt-3 divide-y divide-line">
            {topics.map((t) => (
              <li key={t.id}>
                <Link href={`/topics/${t.slug}`} className="index-row group">
                  <span className="min-w-0 flex-1 text-[17px] leading-snug group-hover:text-route">
                    {t.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Статьи */}
      {articles.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[26px] font-semibold tracking-tight">
            Статьи для этого состояния
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {articles.map(({ article, topics: at }) => (
              <li key={article.id}>
                <Link href={`/articles/${article.slug}`} className="index-row group">
                  <span className="min-w-0">
                    <span className="block text-[20px] leading-snug group-hover:text-route">
                      {article.title}
                    </span>
                    {at[0] && (
                      <span className="block truncate font-mono text-[13px] text-ink-3">
                        {at[0].title} · {article.readingMinutes} мин
                      </span>
                    )}
                  </span>
                  <span className="ml-auto hidden shrink-0 sm:block">
                    <EvidenceBadge level={article.evidenceLevel} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Мифы */}
      {myths.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[26px] font-semibold tracking-tight">
            Мифы, которые мешают
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {myths.map((m) => (
              <li key={m.id}>
                <Link href={`/myths/${m.slug}`} className="index-row group">
                  <span className="min-w-0 flex-1 text-[17px] leading-snug group-hover:text-route">
                    {m.statement}
                  </span>
                  <span className="ml-auto shrink-0">
                    <VerdictBadge verdict={m.verdict} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Развилки: соседние состояния строками-стрелками */}
      {siblings.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[13px] text-ink-3">Куда идти дальше</p>
          <ul className="mt-3 divide-y divide-line">
            {siblings.map((s) => (
              <li key={s.id}>
                <Link href={`/states/${s.slug}`} className="index-row group">
                  <span aria-hidden="true" className="font-mono text-[13px] text-ink-3">
                    →
                  </span>
                  <span className="text-[17px] leading-snug group-hover:text-route">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {articles.length === 0 && myths.length === 0 && topics.length === 0 && siblings.length === 0 && (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          Для этого состояния пока не подобраны материалы.
        </p>
      )}
    </div>
  );
}
