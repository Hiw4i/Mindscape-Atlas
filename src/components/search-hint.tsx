import { SearchHintExamples } from "./search-hint-examples";

/**
 * Подсказка под поиском: примеры живых вопросов, на которые база
 * отвечает. Приглашает к формулировке в своих словах.
 */
export function SearchHint() {
  return (
    <div className="mt-4 font-mono text-[13px] text-ink-3">
      <p>Попробуйте спросить:</p>
      <SearchHintExamples />
    </div>
  );
}
