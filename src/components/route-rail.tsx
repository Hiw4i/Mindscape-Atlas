"use client";

import { useEffect, useRef, useState } from "react";

export interface RailStop {
  id: string;
  label: string;
}

/**
 * Рельс маршрута чтения. На desktop (>=1200px) - вертикальная линейка
 * слева от колонки: узлы 01-06 с подписями, пройденная часть окрашивается
 * в --route по мере скролла (linear, без easing). На узких экранах рельс
 * сворачивается в верхний прогресс-бар 2px. При prefers-reduced-motion
 * рельс статичен: узлы видны и кликабельны, окрашивания по скроллу нет.
 */
export function RouteRail({ stops }: { stops: RailStop[] }) {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedRef.current) return;

    const els = stops
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const onScroll = () => {
      const marker = window.scrollY + Math.round(window.innerHeight * 0.35);
      let idx = -1;
      for (let i = 0; i < els.length; i++) {
        if (els[i].getBoundingClientRect().top + window.scrollY <= marker) {
          idx = i;
        }
      }
      setActive(idx);

      const start = els[0].getBoundingClientRect().top + window.scrollY;
      const end =
        els[els.length - 1].getBoundingClientRect().top + window.scrollY;
      const total = Math.max(end - start, 1);
      const p = (window.scrollY + window.innerHeight * 0.35 - start) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stops]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reducedRef.current ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      {/* Desktop: рельс слева от колонки чтения */}
      <nav
        aria-label="Маршрут чтения"
        className="sticky top-24 hidden self-start min-[1200px]:block"
      >
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute left-[3px] top-3 bottom-3 w-[2px] bg-line"
          />
          {active >= 0 && (
            <span
              aria-hidden="true"
              className="absolute left-[3px] top-3 w-[2px] bg-route"
              style={{ height: `${((active + 1) / stops.length) * 100}%` }}
            />
          )}
          {stops.map((s, i) => {
            const passed = i <= active;
            const current = i === active;
            return (
              <li key={s.id} className="relative py-2">
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-current={current ? "true" : undefined}
                  className="group flex min-h-[40px] items-center gap-3 text-left"
                >
                  <span
                    aria-hidden="true"
                    className="relative z-10 size-2 rounded-full border"
                    style={{
                      background: passed ? "var(--route)" : "var(--paper)",
                      borderColor: passed ? "var(--route)" : "var(--ink-3)",
                    }}
                  />
                  <span
                    className="font-mono text-[13px] tabular-nums"
                    style={{ color: passed ? "var(--route)" : "var(--ink-3)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[13px] leading-tight ${
                      current ? "text-ink" : "text-ink-3 group-hover:text-ink-2"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile: верхний прогресс-бар 2px под шапкой */}
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 top-14 z-30 h-[2px] min-[1200px]:hidden"
      >
        <div
          className="h-full origin-left bg-route"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </>
  );
}
