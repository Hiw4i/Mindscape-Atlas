import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="font-mono text-[13px] text-ink-3">404</p>
      <h1 className="mt-4 text-[clamp(26px,4vw,34px)] font-semibold tracking-tight">
        Материал не найден
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">
        Страницы с таким адресом в базе нет. Попробуйте поиск или начните
        с разделов.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          На главную
        </Link>
        <Link href="/search" className="btn btn-secondary">
          Поиск
        </Link>
      </div>
    </div>
  );
}
