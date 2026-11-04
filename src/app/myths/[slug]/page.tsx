import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge } from "@/components/badge";
import { RouteRail, type RailStop } from "@/components/route-rail";
import { renderMarkdown } from "@/lib/markdown";
import { MYTH_VERDICTS, type Tone } from "@/lib/labels";
import { getMythBySlug, getMythTopics } from "@/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  return { title: myth ? `Миф: ${myth.statement}` : "Миф" };
}

/**
 * Положение вердикта на шкале "миф - правда" (0-100%).
 * Пары "утверждение - вердикт" следуют существующим лейблам.
 */
const VERDICT_POSITION: Record<string, number> = {
  debunked: 2,
  misleading: 25,
  unproven: 50,
  disputed: 66,
  partly: 85,
};

function VerdictScale({ verdict }: { verdict: string }) {
  const info = MYTH_VERDICTS[verdict];
  const pos = VERDICT_POSITION[verdict] ?? 50;
  return (
    <div className="mt-8">
      <div className="flex justify-between font-mono text-[13px] text-ink-3">
        <span>миф</span>
        <span>правда</span>
      </div>
      <div className="relative mt-3 h-7">
        <span aria-hidden="true" className="absolute left-0 right-0 top-3 h-[4px] bg-line" />
        <span
          aria-hidden="true"
          className="absolute top-0 h-5 w-[2px] bg-route"
          style={{ left: `${pos}%` }}
        />
        <span
          className="absolute top-7 -translate-x-1/2 whitespace-nowrap font-mono text-[13px]"
          style={{
            left: `${pos}%`,
            color: `var(--t-${info?.tone ?? "slate"})`,
          }}
        >
          {info?.label ?? verdict}
        </span>
      </div>
      <div className="h-6" />
    </div>
  );
}

export default async function MythPage({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) notFound();

  const topics = getMythTopics(myth.id);
  const verdict = MYTH_VERDICTS[myth.verdict];

  /* Разбор по шагам: остановки маршрута из заполненных блоков. */
  const stops: RailStop[] = [];
  if (myth.whyBelieve) stops.push({ id: "stop-why", label: "Почему верят" });
  if (myth.evidence) stops.push({ id: "stop-evidence", label: "Доказательства" });
  if (myth.unknown) stops.push({ id: "stop-unknown", label: "Что неизвестно" });
  if (myth.better) stops.push({ id: "stop-better", label: "Точная формулировка" });
  let stopIndex = 0;
  const nextStop = () => ++stopIndex;

  function Step({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section id={id} className="relative mt-16 border-t border-line pt-8">
        <span aria-hidden="true" className="stop-tick" />
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[13px] tabular-nums text-ink-3">
            {String(nextStop()).padStart(2, "0")}
          </span>
          <h2 className="text-[26px] font-semibold leading-tight tracking-tight">{title}</h2>
        </div>
        <div className="prose mt-5">{children}</div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-10 min-[1200px]:pt-16">
      <div className="grid grid-cols-1 gap-y-10 text-[20px] min-[1200px]:grid-cols-[176px_minmax(0,62ch)] min-[1200px]:gap-x-16">
        <RouteRail stops={stops} />

        <div className="min-w-0">
          <nav aria-label="Хлебные крошки" className="font-mono text-[13px] text-ink-3">
            <Link href="/myths" className="hover:text-ink">Мифы и заблуждения</Link>
          </nav>

          <header className="mt-8">
            {/* Утверждение - объект проверки */}
            <p className="font-mono text-[13px] text-ink-3">Проверка утверждения</p>
            <span aria-hidden="true" className="mt-2 block h-[2px] w-12 bg-route" />
            <h1 className="mt-6 text-[clamp(26px,4vw,34px)] font-semibold leading-[1.15] tracking-tight text-balance">
              "{myth.statement}"
            </h1>
            {/* Вердикт: штамп в рамке 2px, лёгкий поворот, без свечения */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <p
                className="verdict-stamp"
                style={
                  verdict
                    ? ({ "--stamp-color": `var(--t-${verdict.tone as Tone})` } as React.CSSProperties)
                    : undefined
                }
              >
                {verdict?.label ?? myth.verdict}
              </p>
              {myth.isDemo === 1 && <DemoBadge />}
            </div>
            <VerdictScale verdict={myth.verdict} />
          </header>

          {myth.whyBelieve && (
            <Step id="stop-why" title="Почему в это верят">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(myth.whyBelieve) }} />
            </Step>
          )}

          {myth.evidence && (
            <Step id="stop-evidence" title="Что говорят доказательства">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(myth.evidence) }} />
            </Step>
          )}

          {myth.unknown && (
            <Step id="stop-unknown" title="Что известно и что остаётся неизвестным">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(myth.unknown) }} />
            </Step>
          )}

          {myth.better && (
            <Step id="stop-better" title="Более точная формулировка">
              <div className="bg-paper-2 p-6">
                <div
                  className="prose"
                  style={{ fontSize: 17 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(myth.better) }}
                />
              </div>
            </Step>
          )}

          {topics.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[13px] text-ink-3">Темы</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {topics.map((t) => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="font-mono text-[13px] text-ink-2 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-route"
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <p className="mt-16 border-t border-line pt-8 font-mono text-[13px] leading-relaxed text-ink-3">
            Проверьте источники самостоятельно: разбор опирается на
            опубликованные исследования, но наука уточняет выводы со временем.
          </p>
        </div>
      </div>
    </div>
  );
}
