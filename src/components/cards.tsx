import Link from "next/link";
import { DemoBadge, EvidenceBadge, VerdictBadge } from "./badge";
import { excerpt } from "@/lib/content";
import { colorOfTopic } from "@/lib/queries";
import type { Article, Myth, State, Topic } from "@/db/schema";

/**
 * Материал как элемент указателя: mono-метки, serif-название, без
 * карточек, рамок и иконок. Место декора занимает terrain-линейка
 * и mono-метка раздела.
 */
export function ArticleCard({
  article,
  topics,
}: {
  article: Article;
  topics: Topic[];
}) {
  const color = topics.length ? colorOfTopic(topics[0]) : "slate";
  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {topics.slice(0, 2).map((t) => (
          <Link
            key={t.id}
            href={`/topics/${t.slug}`}
            className={`font-mono text-[13px] c-${color} hover:underline hover:underline-offset-4`}
          >
            {t.title}
          </Link>
        ))}
        {article.isDemo === 1 && <DemoBadge />}
      </div>
      <h3 className="mt-1.5 text-[20px] font-semibold leading-snug tracking-tight">
        <Link href={`/articles/${article.slug}`} className="hover:text-route">
          {article.title}
        </Link>
      </h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">
        {excerpt(article.summary, 180)}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[13px] text-ink-3">
        <span className="tabular-nums">{article.readingMinutes} мин</span>
        <EvidenceBadge level={article.evidenceLevel} />
      </div>
    </article>
  );
}

export function MythCard({ myth, topics }: { myth: Myth; topics: Topic[] }) {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {topics.slice(0, 2).map((t) => (
          <Link
            key={t.id}
            href={`/topics/${t.slug}`}
            className="font-mono text-[13px] text-ink-3 hover:underline hover:underline-offset-4"
          >
            {t.title}
          </Link>
        ))}
        {myth.isDemo === 1 && <DemoBadge />}
      </div>
      <h3 className="mt-1.5 text-[17px] font-semibold leading-snug">
        <Link href={`/myths/${myth.slug}`} className="hover:text-route">
          {myth.statement}
        </Link>
      </h3>
      <div className="mt-2">
        <VerdictBadge verdict={myth.verdict} />
      </div>
    </article>
  );
}

/** Раздел: terrain-линейка, serif-название, mono-счётчик - без рамок. */
export function SectionCard({
  section,
  children,
  articleCount,
}: {
  section: Topic;
  children: Topic[];
  articleCount?: number;
}) {
  const color = colorOfTopic(section);
  return (
    <Link href={`/topics/${section.slug}`} className="group block">
      <span
        aria-hidden="true"
        className="block h-[2px] w-12"
        style={{ background: `var(--c-${color})` }}
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[20px] font-semibold tracking-tight group-hover:text-route">
          {section.title}
        </h2>
        {typeof articleCount === "number" && articleCount > 0 && (
          <span className="font-mono text-[13px] tabular-nums text-ink-3">
            {articleCount}
          </span>
        )}
      </div>
      <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
        {section.description || children.map((c) => c.title).join(", ")}
      </p>
      {children.length > 0 && (
        <p className="mt-1.5 font-mono text-[13px] leading-relaxed text-ink-3 line-clamp-2">
          {children.slice(0, 6).map((c) => c.title).join(" · ")}
        </p>
      )}
    </Link>
  );
}

export function StateChip({ state }: { state: State }) {
  return (
    <Link
      href={`/states/${state.slug}`}
      className="inline-flex items-center gap-2 font-mono text-[14px] text-ink-2 hover:text-ink"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-route" />
      {state.title}
    </Link>
  );
}

export function TopicChip({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="font-mono text-[13px] text-ink-2 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-route"
    >
      {topic.title}
    </Link>
  );
}
