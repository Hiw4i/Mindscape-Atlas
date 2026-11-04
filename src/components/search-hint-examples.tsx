const QUESTIONS = [
  "Почему я боюсь, что обо мне подумают другие?",
  "Почему я привязываюсь к тем, кому на меня всё равно?",
  "Что делает человека счастливым?",
  "Почему я понимаю, что нужно делать, но не делаю?",
];

export function SearchHintExamples() {
  return (
    <ul className="mt-2 space-y-1">
      {QUESTIONS.map((q) => (
        <li key={q}>{q}</li>
      ))}
    </ul>
  );
}
