import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { GraphView } from "@/components/graph-view";
import { EvidenceBadge, VerdictBadge } from "@/components/badge";
import { SectionCard } from "@/components/cards";
import { SearchHint } from "@/components/search-hint";
import { EVIDENCE_LEVELS } from "@/lib/labels";
import { excerpt } from "@/lib/content";
import {
  attachTopics,
  buildTopicIndex,
  getChildTopics,
  getFeaturedArticles,
  getMapData,
  getPublishedArticles,
  getPublishedMyths,
  getSections,
  getStatesList,
  getStats,
  colorOfTopic,
  type Topic,
} from "@/lib/queries";

/** Главная - титульный лист атласа: обложка издания, а не SaaS-hero. */
export default function HomePage() {
  const sections = getSections();
  const states = getStatesList();
  const featured = attachTopics(getFeaturedArticles()).slice(0, 3);
  const articles = attachTopics(getPublishedArticles());
  const myths = getPublishedMyths().slice(0, 3);
  const stats = getStats();
  const map = getMapData();
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
  const countBySection = new Map<number, number>();
  for (const { topics: articleTopics } of articles) {
    const roots = new Set(articleTopics.map(rootIdOf));
    for (const id of roots) countBySection.set(id, (countBySection.get(id) ?? 0) + 1);
  }

  const legend = sections.map((s) => ({
    label: s.title,
    color: `var(--c-${colorOfTopic(s, index)})`,
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20">
      {/* Титул */}
      <section className="border-b border-line pb-12 pt-16 sm:pt-24">
        <h1 className="max-w-3xl text-balance text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Атлас психологии человека
        </h1>
        <p className="mt-5 max-w-2xl font-mono text-[13px] leading-relaxed text-ink-2">
          База знаний о мышлении, эмоциях, отношениях и жизни - с указанием
          степени достоверности каждого утверждения, без воды, клише и
          псевдонауки.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/states" className="btn btn-primary">
            Начать с состояния
          </Link>
          <p className="font-mono text-[13px] text-ink-3">
            или ищите: база отвечает на вопросы своими словами
          </p>
        </div>
        <div className="mt-6 max-w-2xl">
          <SearchBar big />
          <SearchHint />
        </div>
      </section>

      {/* Вход через состояние: mono-указатель строк */}
      {states.length > 0 && (
        <section className="pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">Начать с состояния</h2>
            <span className="font-mono text-[13px] tabular-nums text-ink-3">{states.length}</span>
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            Точка, где стоит читатель: конкретное переживание вместо каталога
            понятий.
          </p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {states.map((s) => (
              <li key={s.id}>
                <Link href={`/states/${s.slug}`} className="index-row group">
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-route"
                  />
                  <span className="min-w-0">
                    <span className="block text-[20px] leading-snug group-hover:text-route">
                      {s.title}
                    </span>
                    {s.description && (
                      <span className="block truncate font-mono text-[13px] text-ink-3">
                        {excerpt(s.description, 90)}
                      </span>
                    )}
                  </span>
                  <span aria-hidden="true" className="ml-auto font-mono text-[13px] text-ink-3">
                    лист
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Разделы: соседние листы атласа */}
      {sections.length > 0 && (
        <section className="pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">Разделы</h2>
            <Link
              href="/topics"
              className="font-mono text-[13px] text-ink-2 hover:text-ink hover:underline hover:underline-offset-4"
            >
              все темы <ArrowRight className="inline size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                children={getChildTopics(section.id)}
                articleCount={countBySection.get(section.id) ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Статьи: строки-указатели */}
      {featured.length > 0 && (
        <section className="pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">Статьи</h2>
            <Link
              href="/articles"
              className="font-mono text-[13px] text-ink-2 hover:text-ink hover:underline hover:underline-offset-4"
            >
              указатель статей <ArrowRight className="inline size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {featured.map(({ article, topics: at }, i) => (
              <li key={article.id}>
                <Link href={`/articles/${article.slug}`} className="index-row group">
                  <span className="font-mono text-[13px] tabular-nums text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[20px] leading-snug group-hover:text-route">
                      {article.title}
                    </span>
                    <span className="block truncate font-mono text-[13px] text-ink-3">
                      {at[0] ? at[0].title : ""}
                      {at[0] ? " · " : ""}
                      {article.readingMinutes} мин
                    </span>
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

      {/* Мифы: утверждение - вердикт */}
      {myths.length > 0 && (
        <section className="pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">Мифы и заблуждения</h2>
            <Link
              href="/myths"
              className="font-mono text-[13px] text-ink-2 hover:text-ink hover:underline hover:underline-offset-4"
            >
              все разборы <ArrowRight className="inline size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {myths.map((myth) => (
              <li key={myth.id}>
                <Link href={`/myths/${myth.slug}`} className="index-row group">
                  <span className="min-w-0 text-[17px] leading-snug group-hover:text-route">
                    {myth.statement}
                  </span>
                  <span className="ml-auto shrink-0">
                    <VerdictBadge verdict={myth.verdict} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Обзорный лист: фрагмент карты связей */}
      {map.nodes.length > 1 && (
        <section className="pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">Карта связей</h2>
            <Link
              href="/map"
              className="font-mono text-[13px] text-ink-2 hover:text-ink hover:underline hover:underline-offset-4"
            >
              обзорный лист <ArrowRight className="inline size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6">
            <GraphView nodes={map.nodes} links={map.links} height={320} interactive={false} legend={legend} />
          </div>
        </section>
      )}

      {/* Колофон: легенда достоверности + счётчики листов */}
      <section className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-[13px] text-ink-3">Легенда достоверности</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(EVIDENCE_LEVELS).map(([key]) => (
            <EvidenceBadge key={key} level={key} />
          ))}
        </div>
        <p className="mt-6 font-mono text-[13px] tabular-nums text-ink-3">
          {stats.topics} тем · {stats.articles} статей · {stats.myths} разборов
          мифов · {stats.states} состояний · {stats.links} связей
        </p>
      </section>
    </div>
  );
}
