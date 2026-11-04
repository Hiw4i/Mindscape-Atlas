"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/topics", label: "Темы" },
  { href: "/admin/articles", label: "Статьи" },
  { href: "/admin/myths", label: "Мифы" },
  { href: "/admin/sources", label: "Источники" },
  { href: "/admin/ideas", label: "Идеи" },
  { href: "/admin/states", label: "Состояния" },
  { href: "/admin/connections", label: "Связи тем" },
  { href: "/admin/search", label: "Поиск" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1" aria-label="Навигация админ-панели">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-accent-soft text-accent-ink font-medium" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
