import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DemoBadge, EvidenceBadge } from "@/components/badge";
import { RouteRail, type RailStop } from "@/components/route-rail";
import { GraphView } from "@/components/graph-view";
import { EVIDENCE_LEVELS } from "@/lib/labels";
import { SOURCE_KINDS } from "@/lib/labels";
import { renderMarkdown } from "@/lib/markdown";
import { excerpt } from "@/lib/content";
import { colorOfTopic } from "@/lib/queries";
import {
  attachSourcesToIdeas,
  buildTopicIndex,
  getArticleBySlug,
  getArticleIdeas,
  getArticleSources,
  getArticleTags,
  getArticleTopics,
  getIdeaRelationsFor,
  getNeighborhood,
  getRelatedArticles,
  getTopicAncestors,
  getTopicLinksFor,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return { title: article?.title ?? "Статья" };
}

/** Остановка маршрута: линия 1px, акцентный штрих 24px, mono-индекс. */
function Stop({
  index,
  id,
  title,
  children,
}: {
  index: number;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mt-16 border-t border-line pt-8">
      <span aria-hidden="true" className="stop-tick" />
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[13px] tabular-nums text-ink-3">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="text-[26px] font-semibold leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const topics = getArticleTopics(article.id);
  const tags = getArticleTags(article.id);
  const sources = getArticleSources(article.id);
  const ideas = attachSourcesToIdeas(getArticleIdeas(article.id));
  const ideaRelations = getIdeaRelationsFor(ideas.map((i) => i.idea.id));
  const related = getRelatedArticles(article.id, topics.map((t) => t.id));
  const index = buildTopicIndex();
  const primary = topics[0];
  const color = primary ? colorOfTopic(primary, index) : "slate";
  const ancestors = primary ? getTopicAncestors(primary, index) : [];
  const neighbors = primary ? getTopicLinksFor(primary.id) : [];
  const graph = primary ? getNeighborhood(primary.id) : { nodes: [], links: [] };

  const updated = new Date(article.updatedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ideaRelsFor = (ideaId: number) =>
    ideaRelations.filter((r) => r.fromIdeaId === ideaId || r.toIdeaId === ideaId);

  /* Маршрут статьи: остановки существуют только у заполненных блоков. */
  const stops: RailStop[] = [];
  if (article.question) stops.push({ id: "stop-question", label: "Главный вопрос" });
  if (article.summary) stops.push({ id: "stop-summary", label: "Краткая суть" });
  if (article.content) stops.push({ id: "stop-discourse", label: "Разбор" });
  if (article.misconceptions) stops.push({ id: "stop-misconceptions", label: "Заблуждения" });
  if (article.examples) stops.push({ id: "stop-examples", label: "Примеры" });
  if (article.takeaways) stops.push({ id: "stop-takeaways", label: "Выводы" });
  let stopIndex = 0;
  const nextStop = () => ++stopIndex;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-10 min-[1200px]:pt-16">
      <div className="grid grid-cols-1 gap-y-10 text-[20px] min-[1200px]:grid-cols-[176px_minmax(0,62ch)] min-[1200px]:gap-x-16">
        <RouteRail stops={stops} />

        <div className="min-w-0">
          {/* Хлебные крошки: mono-строка */}
          <nav
            aria-label="Хлебные крошки"
            className="font-mono text-[13px] text-ink-3"
          >
            <Link href="/topics" className="hover:text-ink">Разделы</Link>
            {ancestors.map((a) => (
              <span key={a.id}>
                {" / "}
                <Link href={`/topics/${a.slug}`} className="hover:text-ink">{a.title}</Link>
              </span>
            ))}
            {primary && (
              <span>
                {" / "}
                <Link href={`/topics/${primary.slug}`} className="hover:text-ink">{primary.title}</Link>
              </span>
            )}
          </nav>

          {/* Шапка листа: mono-метка раздела + terrain-линейка */}
          <header className="mt-8">
            {primary && (
              <p className="font-mono text-[13px]">
                <Link href={`/topics/${primary.slug}`} className={`c-${color} hover:underline hover:underline-offset-4`}>
                  {primary.title}
                </Link>
              </p>
            )}
            <span
              aria-hidden="true"
              className="mt-2 block h-[2px] w-12"
              style={{ background: `var(--c-${color})` }}
            />
            <h1 className="mt-6 text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight text-balance">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-ink-2">
              <span className="tabular-nums">{article.readingMinutes} мин чтения</span>
              <EvidenceBadge level={article.evidenceLevel} />
              {article.isDemo === 1 && <DemoBadge />}
              <span>обновлено {updated}</span>
            </div>
          </header>

          {/* 01 Главный вопрос */}
          {article.question && (
            <Stop index={nextStop()} id="stop-question" title="Главный вопрос">
              <p className="border-l-2 border-route bg-paper-2 py-5 pl-6 pr-5 font-serif text-[26px] italic leading-snug text-ink">
                {article.question}
              </p>
            </Stop>
          )}

          {/* 02 Краткая суть */}
          {article.summary && (
            <Stop index={nextStop()} id="stop-summary" title="Краткая суть">
              <p className="text-[20px] leading-relaxed text-ink-2">{article.summary}</p>
            </Stop>
          )}

          {/* 03 Разбор */}
          {article.content && (
            <Stop index={nextStop()} id="stop-discourse" title="Разбор">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
              />
            </Stop>
          )}

          {/* 04 Заблуждения: пары "утверждение - вердикт", без рамок */}
          {article.misconceptions && (
            <Stop index={nextStop()} id="stop-misconceptions" title="Распространённые заблуждения">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.misconceptions) }}
              />
            </Stop>
          )}

          {/* 05 Примеры */}
          {article.examples && (
            <Stop index={nextStop()} id="stop-examples" title="Примеры из жизни">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.examples) }}
              />
            </Stop>
          )}

          {/* 06 Выводы: врезка на paper-2 */}
          {article.takeaways && (
            <Stop index={nextStop()} id="stop-takeaways" title="Практические выводы">
              <div className="bg-paper-2 p-6">
                <div
                  className="prose"
                  style={{ fontSize: 17 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(article.takeaways) }}
                />
              </div>
            </Stop>
          )}

          {/* Идеи из источников */}
          {ideas.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <h2 className="text-[26px] font-semibold leading-tight tracking-tight">
                Ключевые идеи из источников
              </h2>
              <ul className="mt-6">
                {ideas.map(({ idea, source }) => {
                  const rels = ideaRelsFor(idea.id);
                  return (
                    <li key={idea.id} className="border-l border-line pl-5 [&+&]:mt-6">
                      <p className="text-[17px] font-medium leading-snug">{idea.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{idea.text}</p>
                      {source && (
                        <p className="mt-1.5 font-mono text-[13px] text-ink-3">
                          <Link href={`/sources/${source.id}`} className="hover:text-ink hover:underline hover:underline-offset-4">
                            {source.title}
                          </Link>
                          {" · "}
                          {SOURCE_KINDS[source.kind]?.label ?? source.kind}
                          {source.author ? ` · ${source.author}` : ""}
                          {idea.timecode ? ` · ${idea.timecode}` : ""}
                        </p>
                      )}
                      {rels.length > 0 && (
                        <p className="mt-1 font-mono text-[13px] text-ink-3">
                          {rels.map((r) => {
                            const isFrom = r.fromIdeaId === idea.id;
                            const kindLabel =
                              r.kind === "develops" ? "развивает" : r.kind === "challenges" ? "оспаривает" : "дополняет";
                            const otherTitle = isFrom ? r.toTitle : r.fromTitle;
                            return (
                              <span key={`${r.fromIdeaId}-${r.toIdeaId}`}>
                                {kindLabel} идею {otherTitle}
                              </span>
                            );
                          })}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Источники: mono-строки с координатами */}
          {sources.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <h2 className="text-[26px] font-semibold leading-tight tracking-tight">Источники</h2>
              <ul className="mt-4 divide-y divide-line">
                {sources.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium leading-snug">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-ink-3 underline-offset-4 hover:decoration-route"
                          >
                            {s.title}
                          </a>
                        ) : (
                          <Link href={`/sources/${s.id}`} className="hover:text-route">{s.title}</Link>
                        )}
                      </p>
                      <p className="mt-0.5 font-mono text-[13px] text-ink-3">
                        {SOURCE_KINDS[s.kind]?.label ?? s.kind}
                        {s.author ? ` · ${s.author}` : ""}
                      </p>
                      {s.description && (
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                          {excerpt(s.description, 160)}
                        </p>
                      )}
                    </div>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Открыть источник: ${s.title}`}
                        className="mt-1 p-1 text-ink-3 hover:text-ink"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Темы и теги */}
          {(tags.length > 0 || topics.length > 0) && (
            <section className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[13px] text-ink-3">Темы и теги</p>
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
                {tags.map((t) => (
                  <span key={t.id} className="font-mono text-[13px] text-ink-3">
                    #{t.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Смежные листы: строки с точками-маркерами */}
          {neighbors.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[13px] text-ink-3">Смежные листы</p>
              <ul className="mt-3 divide-y divide-line">
                {neighbors.map((l) => {
                  const nColor = colorOfTopic(l.other, index);
                  return (
                    <li key={l.id} className="py-2.5">
                      <Link href={`/topics/${l.other.slug}`} className="group flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 translate-y-[-1px] rounded-full"
                          style={{ background: `var(--c-${nColor})` }}
                        />
                        <span className="text-[17px] group-hover:text-route">{l.other.title}</span>
                        {l.note && <span className="font-mono text-[13px] text-ink-3">- {l.note}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Похожие материалы */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[13px] text-ink-3">Похожие материалы</p>
              <ul className="mt-3 divide-y divide-line">
                {related.map((r, i) => (
                  <li key={r.id} className="index-row">
                    <span className="font-mono text-[13px] tabular-nums text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link href={`/articles/${r.slug}`} className="text-[17px] font-medium hover:text-route">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Локальная карта */}
          {graph.nodes.length > 1 && (
            <section className="mt-16 border-t border-line pt-8">
              <p className="font-mono text-[13px] text-ink-3">Тема на карте связей</p>
              <div className="mt-4">
                <GraphView nodes={graph.nodes} links={graph.links} height={300} />
              </div>
            </section>
          )}

          {/* Легенда достоверности: единая расшифровка бейджей */}
          <section className="mt-16 border-t border-line pt-8">
            <p className="font-mono text-[13px] text-ink-3">Легенда достоверности</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {Object.entries(EVIDENCE_LEVELS).map(([key, info]) => (
                <EvidenceBadge key={key} level={key} />
              ))}
            </div>
            <p className="mt-4 font-mono text-[13px] leading-relaxed text-ink-3">
              Уровень отмечен точкой и подписью: цвет - подсказка, подпись -
              значение.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
