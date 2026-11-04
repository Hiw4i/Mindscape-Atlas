import Link from "next/link";
import { excerpt } from "@/lib/content";
import { getStatesList } from "@/lib/queries";

export const metadata = { title: "Поиск по состоянию" };

/** "Вы здесь": состояния - точки, где стоит читатель. */
export default function StatesPage() {
  const states = getStatesList();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Поиск по состоянию
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Второй вход в базу знаний: не через тему, а через то, что вы
          чувствуете сейчас. Каждое состояние собрано из статей, тем и
          разборов мифов, которые помогают именно с ним.
        </p>
      </header>

      {states.length === 0 ? (
        <p className="mt-12 font-mono text-[13px] text-ink-3">
          Состояния ещё не добавлены. Их можно создать в админ-панели.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {states.map((state) => (
            <li key={state.id}>
              <Link href={`/states/${state.slug}`} className="index-row group">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-route"
                />
                <span className="min-w-0">
                  <span className="block text-[20px] leading-snug group-hover:text-route">
                    {state.title}
                  </span>
                  {state.description && (
                    <span className="block truncate font-mono text-[13px] text-ink-3">
                      {excerpt(state.description, 100)}
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
      )}
    </div>
  );
}
