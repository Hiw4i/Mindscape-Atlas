import Link from "next/link";
import { Compass } from "lucide-react";
import { loginAction } from "../actions/auth";

export const metadata = { title: "Вход в панель редактора" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-xl border border-line bg-surface p-6">
        <div className="flex items-center gap-2">
          <Compass className="size-5 text-accent" />
          <h1 className="text-lg font-semibold">Панель редактора</h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Закрытый раздел для наполнения базы знаний. Пароль задаётся в файле
          .env.local, переменная ADMIN_PASSWORD.
        </p>
        <form action={loginAction} className="mt-5 space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Пароль"
            className="input"
          />
          {error && <p className="text-sm c-rose">Пароль неверный.</p>}
          <button type="submit" className="btn btn-primary w-full justify-center">
            Войти
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-3">
          <Link href="/" className="hover:text-ink">Вернуться на сайт</Link>
        </p>
      </div>
    </div>
  );
}
