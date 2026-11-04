export function CheckboxGrid({
  name,
  items,
  selected = [],
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  name: string;
  items: Array<{ id: number; label: string }>;
  selected?: number[];
  columns?: string;
}) {
  if (!items.length) {
    return <p className="text-sm text-ink-3">Пока нет доступных значений.</p>;
  }
  return (
    <div className={`grid gap-1.5 ${columns}`}>
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            name={name}
            value={item.id}
            defaultChecked={selected.includes(item.id)}
            className="size-4 accent-[var(--accent)]"
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
