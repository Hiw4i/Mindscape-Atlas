/**
 * Словари для степеней достоверности, вердиктов мифов, типов связей
 * и источников. Единая точка правды для сайта и админ-панели.
 */

export type Tone =
  | "green"
  | "amber"
  | "red"
  | "slate"
  | "violet"
  | "blue"
  | "rose"
  | "orange";

export const EVIDENCE_LEVELS: Record<string, { label: string; tone: Tone }> = {
  research: { label: "Подтверждено исследованиями", tone: "green" },
  hypothesis: { label: "Научная гипотеза", tone: "amber" },
  interpretation: { label: "Авторская интерпретация", tone: "violet" },
  observation: { label: "Личное наблюдение", tone: "slate" },
  mixed: { label: "Смешанные данные", tone: "blue" },
  disputed: { label: "Спорный вопрос", tone: "red" },
};

export const MYTH_VERDICTS: Record<string, { label: string; tone: Tone }> = {
  debunked: { label: "Опровергнуто", tone: "red" },
  misleading: { label: "Вводит в заблуждение", tone: "amber" },
  partly: { label: "Частично верно", tone: "blue" },
  unproven: { label: "Не подтверждено", tone: "slate" },
  disputed: { label: "Спорно", tone: "violet" },
};

export const TOPIC_LINK_KINDS: Record<string, { label: string }> = {
  related: { label: "Связано" },
  similar: { label: "Близко по смыслу" },
  opposes: { label: "Противоположно" },
  influences: { label: "Влияет на" },
};

export const IDEA_RELATION_KINDS: Record<string, { label: string }> = {
  develops: { label: "Развивает" },
  complements: { label: "Дополняет" },
  challenges: { label: "Оспаривает" },
};

export const SOURCE_KINDS: Record<string, { label: string; icon: string }> = {
  video: { label: "Видео", icon: "video" },
  book: { label: "Книга", icon: "book" },
  article: { label: "Статья", icon: "quote" },
  lecture: { label: "Лекция", icon: "graduation" },
  research: { label: "Исследование", icon: "flask" },
  other: { label: "Другое", icon: "quote" },
};

/** Цвет раздела: привязка корневых разделов к палитре сайта. */
export const SECTION_COLORS: Record<string, Tone> = {
  love: "rose",
  social: "orange",
  mind: "violet",
  emotion: "green",
  growth: "blue",
  money: "slate",
};

export const TONE_KEYS = ["rose", "orange", "violet", "green", "blue", "slate"] as const;
export type ColorKey = Exclude<Tone, "amber" | "red">;

export function colorForSectionSlug(slug: string): ColorKey {
  const value = SECTION_COLORS[slug];
  if (value === "rose" || value === "orange" || value === "violet" || value === "green" || value === "blue" || value === "slate") {
    return value;
  }
  return "slate";
}
