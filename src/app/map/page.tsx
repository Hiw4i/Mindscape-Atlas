import { GraphView } from "@/components/graph-view";
import { colorOfTopic, getMapData, getSections } from "@/lib/queries";

export const metadata = { title: "Карта связей" };

/** Обзорный лист: топография понятий. */
export default function MapPage() {
  const { nodes, links } = getMapData();
  const sections = getSections();
  const legend = sections.map((s) => ({
    label: s.title,
    color: `var(--c-${colorOfTopic(s)})`,
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-tight">
          Карта связей понятий
        </h1>
        <p className="mt-5 font-mono text-[13px] leading-relaxed text-ink-2">
          Интерактивная схема: как психологические темы соединяются между
          собой. Клик по узлу открывает лист; колесо масштабирует,
          перетаскивание перемещает карту.
        </p>
      </header>

      {nodes.length === 0 ? (
        <p className="mt-16 font-mono text-[13px] text-ink-3">
          Пока нечего показывать: добавьте темы и связи между ними.
        </p>
      ) : (
        <div className="mt-10 border-y border-line">
          <GraphView nodes={nodes} links={links} height={640} legend={legend} />
        </div>
      )}

      <p className="mx-auto mt-8 max-w-2xl font-mono text-[13px] leading-relaxed text-ink-3">
        Цвет точки соответствует разделу. Наведите на узел - карточка
        покажет определение и число материалов. Карта растёт сама: каждая
        новая связь между темами добавляет узел или линию.
      </p>
    </div>
  );
}
