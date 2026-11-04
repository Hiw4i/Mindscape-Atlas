import Link from "next/link";
import { notFound } from "next/navigation";
import { GraphView } from "@/components/graph-view";
import { EvidenceBadge } from "@/components/badge";
import {
  colorOfTopic,
  getArticlesByTopic,
  getChildTopics,
  getIdeasByTopic,
  getMythTopics,
  getMythsByTopic,
  getNeighborhood,
  getRootSection,
  getTopicAncestors,
  getTopicBySlug,
  getTopicLinksFor,
} from "@/lib/queries";
import { SOURCE_KINDS } from "@/lib/labels";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  return { title: topic?.title ?? "Тема" };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  // Вводный текст темы: абзацы разделены пустой строкой
  const descParas = (topic.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const [descLede, ...descBody] = descParas;

  const ancestors = getTopicAncestors(topic);
  const color = colorOfTopic(topic);
  const root = getRootSection(topic);
  const children = getChildTopics(topic.id);
  const articles = getArticlesByTopic(topic.id);
  const myths = getMythsByTopic(topic.id);
  const ideas = getIdeasByTopic(topic.id);
  const links = getTopicLinksFor(topic.id);
  const graph = getNeighborhood(topic.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Хлебные крошки" className="font-mono text-[13px] text-ink-3">
        <Link href="/topics" className="hover:text-ink">Разделы</Link>
        {ancestors.map((a) => (
          <span key={a.id}>
            {" / "}
            <Link href={`/topics/${a.slug}`} className="hover:text-ink">{a.title}</Link>
          </span>
        ))}
        <span>{" / "}{topic.title}</span>
      </nav>

      {/* Шапка-штамп: раздел, определение, число листов */}
      <header className="mt-8">
        <p className="font-mono text-[13px]">
          <span className={`c-${color}`}>{root?.title ?? topic.title}</span>
          <span className="text-ink-3">
            {" "}· листов: {articles.length + myths.length}
          </span>
        </p>
        <span
          aria-hidden="true"
          className="mt-2 block h-[2px] w-12"
          style={{ background: `var(--c-${color})` }}
        />
        <h1 className="mt-6 text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          {topic.title}
        </h1>
        {descLede && (
          <p className="mt-5 max-w-[62ch] text-[20px] leading-relaxed text-ink-2">
            {descLede}
          </p>
        )}
      </header>

      {/* Вводный текст темы до ссылок */}
      {descBody.length > 0 && (
        <div className="mt-10 max-w-[62ch]">
          {descBody.map((p, i) => (
            <p key={i} className={i === 0 ? "text-[17px] leading-relaxed" : "mt-5 text-[17px] leading-relaxed"}>
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Материалы: указатель строками */}
      {articles.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="flex items-baseline gap-3">
            <span className="text-[26px] font-semibold tracking-tight">Материалы темы</span>
            <span className="font-mono text-[13px] tabular-nums text-ink-3">{articles.length}</span>
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {articles.map((a, i) => (
              <li key={a.id}>
                <Link href={`/articles/${a.slug}`} className="index-row group">
                  <span className="font-mono text-[13px] tabular-nums text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-[20px] leading-snug group-hover:text-route">
                    {a.title}
                  </span>
                  <span className="ml-auto hidden shrink-0 items-center gap-4 sm:flex">
                    <span className="font-mono text-[13px] tabular-nums text-ink-3">
                      {a.readingMinutes} мин
                    </span>
                    <EvidenceBadge level={a.evidenceLevel} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Подтемы */}
      {children.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[13px] text-ink-3">Подтемы</p>
          <ul className="mt-3 divide-y divide-line">
            {children.map((c) => {
              const n = getArticlesByTopic(c.id).length;
              const childColor = colorOfTopic(c);
              return (
                <li key={c.id}>
                  <Link href={`/topics/${c.slug}`} className="index-row group">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 translate-y-[-2px] rounded-full"
                      style={{ background: `var(--c-${childColor})` }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[17px] leading-snug group-hover:text-route">
                      {c.title}
                    </span>
                    {n > 0 && (
                      <span className="font-mono text-[13px] tabular-nums text-ink-3">{n}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Смежные листы: перекрёстные связи */}
      {links.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[13px] text-ink-3">Смежные листы</p>
          <ul className="mt-3 divide-y divide-line">
            {links.map((l) => {
              const lColor = colorOfTopic(l.other);
              const kindLabel =
                l.kind === "influences" && l.direction === "from"
                  ? "влияет на"
                  : l.kind === "opposes"
                    ? "противоположно"
                    : l.kind === "similar"
                      ? "близко по смыслу"
                      : "связано";
              return (
                <li key={`${l.id}-${l.direction}`} className="py-2.5">
                  <Link href={`/topics/${l.other.slug}`} className="group flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 translate-y-[-1px] rounded-full"
                      style={{ background: `var(--c-${lColor})` }}
                    />
                    <span className="text-[17px] group-hover:text-route">{l.other.title}</span>
                    <span className="font-mono text-[13px] text-ink-3">
                      {kindLabel}
                      {l.note ? ` - ${l.note}` : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Мифы по теме */}
      {myths.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[26px] font-semibold tracking-tight">Мифы по теме</h2>
          <ul className="mt-4 divide-y divide-line">
            {myths.map((m) => {
              const mTopics = getMythTopics(m.id);
              return (
                <li key={m.id}>
                  <Link href={`/myths/${m.slug}`} className="index-row group">
                    <span className="min-w-0 flex-1 text-[17px] leading-snug group-hover:text-route">
                      {m.statement}
                    </span>
                    {mTopics.length > 0 && (
                      <span className="ml-auto hidden shrink-0 font-mono text-[13px] text-ink-3 sm:block">
                        {mTopics.slice(0, 2).map((t) => t.title).join(" · ")}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Идеи из источников */}
      {ideas.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[26px] font-semibold tracking-tight">Идеи из источников</h2>
          <ul className="mt-4 divide-y divide-line">
            {ideas.map(({ idea, source }) => (
              <li key={idea.id} className="py-4">
                <p className="max-w-[62ch] text-[17px] leading-relaxed">{idea.text}</p>
                {source && (
                  <p className="mt-1.5 font-mono text-[13px] text-ink-3">
                    <Link href={`/sources/${source.id}`} className="hover:text-ink hover:underline hover:underline-offset-4">
                      {source.title}
                    </Link>
                    {" · "}
                    {SOURCE_KINDS[source.kind]?.label ?? source.kind}
                    {source.author ? ` · ${source.author}` : ""}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Локальная карта */}
      {graph.nodes.length > 1 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-[26px] font-semibold tracking-tight">Тема на карте</h2>
          <div className="mt-4 border-y border-line">
            <GraphView nodes={graph.nodes} links={graph.links} height={340} />
          </div>
        </section>
      )}
    </div>
  );
}
