import { Search } from "lucide-react";

/** Компас: mono-поле 15px, рамка 1px, радиус 2px. */
export function SearchBar({
  defaultValue = "",
  big = false,
  placeholder = "ищите понятие, состояние или миф",
}: {
  defaultValue?: string;
  big?: boolean;
  placeholder?: string;
}) {
  return (
    <form action="/search" role="search" className="flex gap-2">
      <div className="relative flex-1">
        <Search
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 ${big ? "size-[18px]" : "size-4"}`}
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="Поиск по базе знаний"
          style={{ paddingLeft: big ? "2.6rem" : "2.3rem" }}
          className={`input ${big ? "h-12" : "h-10"}`}
        />
      </div>
      <button type="submit" className={`btn btn-secondary ${big ? "h-12 px-5" : "h-10 px-4"}`}>
        Найти
      </button>
    </form>
  );
}
