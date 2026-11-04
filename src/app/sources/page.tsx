import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SOURCE_KINDS } from "@/lib/labels";
import { getSourcesList } from "@/lib/queries";

export const metadata = { title: "Источники" };

export default function SourcesPage() {
  const rows = getSourcesList();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Библиотека источников
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Материалы, из которых собирается база: видео, книги, лекции и
          исследования. Каждый источник разбит на отдельные идеи, а идеи
          привязаны к темам.
        </p>
      </header>

      {rows.length === 0 && (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          Источники ещё не добавлены. Первый источник можно добавить в
          админ-панели.
        </p>
      )}

      <ul className="mt-10 divide-y divide-line border-y border-line">
        {rows.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[13px] text-ink-3">
                {SOURCE_KINDS[s.kind]?.label ?? s.kind}
                {s.author ? ` · ${s.author}` : ""}
                {s.ideaCount > 0 ? ` · ${s.ideaCount} идей` : ""}
              </p>
              <h2 className="mt-1 text-[20px] font-semibold leading-snug">
                <Link href={`/sources/${s.id}`} className="hover:text-route">
                  {s.title}
                </Link>
              </h2>
              {s.description && (
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{s.description}</p>
              )}
            </div>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Открыть источник: ${s.title}`}
                className="mt-1 p-1.5 text-ink-3 hover:text-ink"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
