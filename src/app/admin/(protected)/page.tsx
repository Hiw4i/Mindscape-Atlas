import Link from "next/link";
import { FileText, Lightbulb, Map as MapIcon, Quote, SmilePlus, Users } from "lucide-react";
import { getStats } from "@/lib/queries";

export default async function AdminDashboard() {
  const stats = getStats();

  const cards = [
    { href: "/admin/topics", icon: Users, label: "Темы и разделы", value: stats.topics },
    { href: "/admin/articles", icon: FileText, label: "Статьи", value: stats.articles, extra: stats.drafts ? `${stats.drafts} черновиков` : undefined },
    { href: "/admin/myths", icon: Quote, label: "Мифы", value: stats.myths },
    { href: "/admin/sources", icon: Lightbulb, label: "Источники", value: stats.sources },
    { href: "/admin/ideas", icon: Lightbulb, label: "Идеи", value: stats.ideas },
    { href: "/admin/states", icon: SmilePlus, label: "Состояния", value: stats.states },
    { href: "/admin/connections", icon: MapIcon, label: "Связи тем", value: stats.links },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Дашборд</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/articles/new" className="btn btn-primary">Новая статья</Link>
          <Link href="/admin/myths/new" className="btn btn-secondary">Новый миф</Link>
          <Link href="/admin/sources/new" className="btn btn-secondary">Новый источник</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink-3"
          >
            <div className="flex items-center gap-2 text-sm text-ink-2">
              <c.icon className="size-4 text-accent" />
              {c.label}
            </div>
            <p className="mt-1.5 text-2xl font-semibold">
              {c.value}
              {c.extra && <span className="ml-2 text-xs font-normal text-ink-3">{c.extra}</span>}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink-2">
        <h2 className="font-semibold text-ink">Как наполнять базу</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>Добавьте источники: видео по ссылке, книги, исследования.</li>
          <li>Выпишите из каждого источника отдельные идеи и привяжите их к темам.</li>
          <li>На основе идей пишите статьи в редакторе с блоками структуры.</li>
          <li>Разбирайте популярные утверждения в разделе Мифы.</li>
          <li>Связывайте темы между собой - карта связей строится автоматически.</li>
          <li>Создавайте состояния и собирайте в них материалы по конкретным переживаниям.</li>
        </ol>
        <p className="mt-3 text-xs text-ink-3">
          Демонстрационные материалы помечены флажком Демо - их можно
          редактировать и удалять. База хранится в файле data/atlas.db рядом с
          проектом; для резервной копии достаточно скопировать этот файл.
        </p>
      </section>
    </div>
  );
}
