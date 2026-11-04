import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SOURCE_KINDS } from "@/lib/labels";
import { excerpt } from "@/lib/content";
import {
  getIdeaRelationsFor,
  getIdeasBySource,
  getSourceById,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const source = getSourceById(Number(id));
  return { title: source?.title ?? "Источник" };
}

export default async function SourcePage({ params }: PageProps) {
  const { id } = await params;
  const source = getSourceById(Number(id));
  if (!source) notFound();

  const ideas = getIdeasBySource(source.id);
  const relations = getIdeaRelationsFor(ideas.map((i) => i.id));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Хлебные крошки" className="font-mono text-[13px] text-ink-3">
        <Link href="/sources" className="hover:text-ink">Источники</Link>
        <span>{" / "}{source.title}</span>
      </nav>

      <header className="mt-8">
        <p className="font-mono text-[13px] text-ink-3">
          {SOURCE_KINDS[source.kind]?.label ?? source.kind}
          {source.author ? ` · ${source.author}` : ""}
        </p>
        <span aria-hidden="true" className="mt-2 block h-[2px] w-12 bg-line" />
        <h1 className="mt-6 text-[clamp(26px,4vw,34px)] font-semibold leading-[1.15] tracking-tight text-balance">
          {source.title}
        </h1>
        {source.url && (
          <p className="mt-4">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[13px] text-route hover:underline hover:underline-offset-4"
            >
              Открыть источник <ExternalLink className="size-3.5" />
            </a>
          </p>
        )}
        {source.description && (
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
            {source.description}
          </p>
        )}
      </header>

      {source.notes && (
        <section className="mt-12 border-t border-line pt-8">
          <p className="font-mono text-[13px] text-ink-3">Конспект</p>
          <p className="mt-3 max-w-[62ch] whitespace-pre-wrap bg-paper-2 p-5 text-[15px] leading-relaxed text-ink-2">
            {source.notes}
          </p>
        </section>
      )}

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-[26px] font-semibold tracking-tight">Идеи из материала</h2>
        {ideas.length === 0 ? (
          <p className="mt-4 font-mono text-[13px] text-ink-3">
            Из этого источника идеи ещё не выписаны.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {ideas.map((idea) => {
              const rels = relations.filter(
                (r) => r.fromIdeaId === idea.id || r.toIdeaId === idea.id
              );
              return (
                <li key={idea.id} className="py-5">
                  <p className="text-[17px] font-medium leading-snug">{idea.title}</p>
                  <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{idea.text}</p>
                  {idea.quote && (
                    <blockquote className="mt-3 max-w-[62ch] bg-paper-2 p-4 font-serif text-[15px] italic leading-relaxed text-ink-2">
                      {idea.quote}
                      {idea.timecode && (
                        <span className="ml-2 font-mono text-[13px] not-italic text-ink-3">
                          {idea.timecode}
                        </span>
                      )}
                    </blockquote>
                  )}
                  {!idea.quote && idea.timecode && (
                    <p className="mt-1 font-mono text-[13px] text-ink-3">{idea.timecode}</p>
                  )}
                  {rels.length > 0 && (
                    <p className="mt-2 font-mono text-[13px] leading-relaxed text-ink-3">
                      {rels.map((r) => {
                        const isFrom = r.fromIdeaId === idea.id;
                        const kindLabel =
                          r.kind === "develops" ? "развивает" : r.kind === "challenges" ? "оспаривает" : "дополняет";
                        const otherTitle = isFrom ? r.toTitle : r.fromTitle;
                        return (
                          <span key={`${r.fromIdeaId}-${r.toIdeaId}`} className="mr-4">
                            {kindLabel}: {otherTitle ? excerpt(otherTitle, 60) : ""}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
