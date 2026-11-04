import type { Tone } from "@/lib/labels";
import { EVIDENCE_LEVELS, MYTH_VERDICTS } from "@/lib/labels";

/**
 * Легенда: прямоугольная mono-метка 13px с маркером-точкой 6px.
 * Точка окрашена тоном, текст остаётся спокойным - уровень различается
 * подписью, а не только цветом.
 */
export function Badge({
  tone,
  children,
  className = "",
}: {
  tone: Tone | "accent";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`badge tone-${tone} ${className}`}>
      <span className="badge-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

export function EvidenceBadge({ level }: { level: string }) {
  const info = EVIDENCE_LEVELS[level];
  if (!info) return null;
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

export function VerdictBadge({ verdict }: { verdict: string }) {
  const info = MYTH_VERDICTS[verdict];
  if (!info) return null;
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

export function DemoBadge() {
  return <Badge tone="slate">Демо</Badge>;
}
