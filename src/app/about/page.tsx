import { EvidenceBadge, VerdictBadge } from "@/components/badge";
import { EVIDENCE_LEVELS, MYTH_VERDICTS } from "@/lib/labels";

export const metadata = { title: "О проекте" };

const PRINCIPLES = [
  {
    title: "Механизмы, а не советы",
    text: "Материалы объясняют, как явление устроено и почему возникает. Понимание механизма полезнее списка рекомендаций, потому что переносится на новые ситуации.",
  },
  {
    title: "Достоверность - явная",
    text: "Ключевое утверждение материала несёт степень достоверности: от подтверждённого исследованиями до личного наблюдения. Несколько объяснений не схлопываются в одно ложное.",
  },
  {
    title: "Никакой воды",
    text: "Структура материала передаёт смысл, а не заполняет объём. Если по вопросу нет однозначного ответа, это сказано прямо.",
  },
  {
    title: "Мифы разбираются, а не игнорируются",
    text: "Популярное утверждение проверяется: почему в него верят, что показывают данные, что остаётся неизвестным. Спорное не объявляется мифом без оснований.",
  },
  {
    title: "Связи между явлениями",
    text: "Страх критики, самооценка, стыд и потребность в одобрении - одна система. Карта связей помогает увидеть её целиком, а не изучать темы изолированно.",
  },
  {
    title: "Источники видны",
    text: "Статьи собираются из библиотеки источников: видео, книг, исследований. Каждый материал можно открыть и проверить самостоятельно.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          О проекте
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
          Атлас психологии - интерактивная база знаний о психологии, отношениях,
          мышлении и жизни. Цель - не дать универсальные советы, а помочь
          разбираться в себе, других людях и устройстве психики. Сложные
          явления объясняются простым и точным языком, а ценность измеряется
          качеством, а не количеством материалов.
        </p>
      </header>

      <section className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-[13px] text-ink-3">Принципы</p>
        <dl className="mt-4 divide-y divide-line">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="py-4">
              <dt className="text-[17px] font-medium">{p.title}</dt>
              <dd className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-[13px] text-ink-3">Степени достоверности</p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
          Каждая статья помечена уровнем достоверности ключевых утверждений.
          Психология - область, где данные часто противоречат друг другу, и
          честная энциклопедия показывает эту сложность вместо ложной
          определённости.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(EVIDENCE_LEVELS).map(([key]) => (
            <EvidenceBadge key={key} level={key} />
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-[13px] text-ink-3">Вердикты разбора мифов</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(MYTH_VERDICTS).map(([key]) => (
            <VerdictBadge key={key} verdict={key} />
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-[13px] text-ink-3">Как развивается база</p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
          Контент собирается вручную: источники добавляются в библиотеку,
          из них выписываются идеи, идеи связываются с темами, и на их основе
          пишутся статьи. Любое автоматически обработанное содержимое проходит
          проверку редактора перед публикацией. Сейчас в базе могут быть
          демонстрационные материалы, помеченные значком Демо: они показывают
          структуру системы и будут заменены настоящими разборами.
        </p>
      </section>

      <p className="mt-14 border-t border-line pt-8 font-mono text-[13px] leading-relaxed text-ink-3">
        Сайт является образовательным ресурсом. Он не ставит диагнозов и не
        заменяет психологическую и медицинскую помощь. Если состояние мешает
        жить, обращение к специалисту - разумный шаг, а не слабость.
      </p>
    </div>
  );
}
