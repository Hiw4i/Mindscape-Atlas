import Link from "next/link";

/** Колофон: mono-строки, линейки, без декора. */
export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-[17px] font-semibold tracking-tight text-ink">
              Атлас психологии
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              База знаний о психологии, отношениях, мышлении и жизни. Максимум
              смысла, минимум воды.
            </p>
          </div>
          <div>
            <p className="font-mono text-[13px] text-ink-3">Разделы</p>
            <ul className="mt-3 space-y-2 font-mono text-[13px] text-ink-2">
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/topics">Темы</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/articles">Статьи</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/myths">Мифы и заблуждения</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/states">Поиск по состоянию</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/map">Карта связей</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[13px] text-ink-3">Проект</p>
            <ul className="mt-3 space-y-2 font-mono text-[13px] text-ink-2">
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/about">О проекте и принципах</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/sources">Источники знаний</Link></li>
              <li><Link className="hover:text-ink hover:underline hover:underline-offset-4" href="/admin/login">Вход для редактора</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 font-mono text-[13px] leading-relaxed text-ink-3">
          Сайт является образовательным ресурсом и не заменяет психологическую
          и медицинскую помощь. В базе могут присутствовать демонстрационные
          материалы, помеченные значком Демо.
        </p>
      </div>
    </footer>
  );
}
