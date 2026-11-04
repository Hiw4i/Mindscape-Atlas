import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { href: "/topics", label: "Разделы" },
  { href: "/articles", label: "Статьи" },
  { href: "/myths", label: "Мифы" },
  { href: "/states", label: "Состояния" },
  { href: "/sources", label: "Источники" },
  { href: "/map", label: "Карта" },
  { href: "/about", label: "О проекте" },
];

/**
 * Навигация сжата до mono-строки 13px: на экране чтения интерфейс
 * не конкурирует с текстом. Иконки - только поиск и тема.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="relative mx-auto flex h-14 max-w-4xl items-center gap-6 px-6">
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-ink">
          Атлас психологии
        </Link>
        <nav
          className="hidden items-center gap-5 font-mono text-[13px] text-ink-2 lg:flex"
          aria-label="Основная навигация"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-ink hover:underline hover:decoration-route hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Поиск по базе знаний"
            className="p-2 text-ink-2 transition-colors hover:text-ink"
          >
            <Search className="size-[18px]" />
          </Link>
          <ThemeToggle />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
