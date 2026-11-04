import Link from "next/link";
import { getMythTopics, getPublishedMyths } from "@/lib/queries";
import { MYTH_VERDICTS } from "@/lib/labels";
import { DemoBadge, VerdictBadge } from "@/components/badge";

interface PageProps {
  searchParams: Promise<{ verdict?: string }>;
}

export const metadata = { title: "Мифы и заблуждения" };

/** Указатель разборов; фильтры - mono-переключатели, не чипы. */
export default async function MythsPage({ searchParams }: PageProps) {
  const { verdict } = await searchParams;
  const myths = getPublishedMyths(verdict);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Мифы и заблуждения
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Разбор популярных утверждений: откуда они взялись, что подтверждают
          исследования, что остаётся спорным. Спорное не объявляется мифом
          без достаточных оснований - для этого у каждого разбора есть
          вердикт.
        </p>
      </header>

      {/* Фильтры: mono-строки-переключатели, активный подчёркнут --route */}
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px] text-ink-2">
        <Link
          href="/myths"
          className={!verdict ? "filter-on" : "hover:text-ink"}
        >
          Все
        </Link>
        {Object.entries(MYTH_VERDICTS).map(([key, info]) => (
          <Link
            key={key}
            href={`/myths?verdict=${key}`}
            className={verdict === key ? "filter-on" : "hover:text-ink"}
          >
            {info.label}
          </Link>
        ))}
      </div>

      {myths.length === 0 && (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          По этому фильтру разборов нет.
        </p>
      )}

      <ul className="mt-10 divide-y divide-line border-t border-line">
        {myths.map((myth, i) => {
          const topics = getMythTopics(myth.id);
          return (
            <li key={myth.id} className="py-5">
              <Link href={`/myths/${myth.slug}`} className="group block">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] tabular-nums text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 text-[20px] leading-snug group-hover:text-route">
                    {myth.statement}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-[2.1rem]">
                  <VerdictBadge verdict={myth.verdict} />
                  {myth.isDemo === 1 && <DemoBadge />}
                  {topics.length > 0 && (
                    <span className="font-mono text-[13px] text-ink-3">
                      {topics.map((t) => t.title).join(" · ")}
                    </span>
                  )}
                </div>
                {myth.better && (
                  <p className="mt-2 pl-[2.1rem] text-[15px] leading-relaxed text-ink-2">
                    {myth.better.slice(0, 180) + (myth.better.length > 180 ? "..." : "")}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
