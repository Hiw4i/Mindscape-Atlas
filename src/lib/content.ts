/** Служебные функции для контента: индекс поиска и время чтения. */

export function readingMinutes(text: string): number {
  const words = text
    .replace(/[#*_>`~\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Денормализованная строка для полнотекстового поиска: собирает всё,
 * по чему материал должен находиться, включая теги, их синонимы и
 * названия связанных тем.
 */
export function buildSearchText(parts: Array<string | null | undefined>): string {
  return parts
    .filter((p) => p && p.trim())
    .map((p) => p!.trim())
    .join(" \n ")
    .slice(0, 20000);
}

export function excerpt(text: string, length = 220): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return clean.slice(0, length).replace(/\s+\S*$/, "") + "…";
}
