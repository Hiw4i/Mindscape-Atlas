"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

/** Мобильное меню: плавающий слой с единственной разрешённой тенью. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
        aria-expanded={open}
        className="p-2 text-ink-2 transition-colors hover:text-ink"
      >
        {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
      </button>
      {open && (
        <nav
          className="absolute left-0 right-0 top-14 z-40 border-b border-line bg-bg px-6 py-3"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 font-mono text-[15px] text-ink-2 last:border-b-0 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
