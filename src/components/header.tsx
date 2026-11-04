"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * Активный раздел: точное совпадение или вложенный маршрут
 * (/articles/... подсвечивает "Статьи").
 */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Навигация сжата до mono-строки 13px: на экране чтения интерфейс
 * не конкурирует с текстом. Иконки - только поиск и тема.
 * Текущий раздел подчёркнут тем же цветом маршрута, что и hover.
 */
export function Header() {
  const pathname = usePathname();
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
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-ink underline decoration-route underline-offset-4"
                    : "hover:text-ink hover:underline hover:decoration-route hover:underline-offset-4"
                }
              >
                {item.label}
              </Link>
            );
          })}
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
          <MobileNav items={NAV} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
