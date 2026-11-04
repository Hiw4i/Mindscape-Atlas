import Link from "next/link";
import { ArticleForm } from "@/components/admin/article-form";
import {
  ideaOptions,
  sourceOptions,
  stateOptions,
  topicOptions,
} from "@/lib/admin";

export default async function NewArticlePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight">Новая статья</h1>
      <p className="mt-1 text-sm text-ink-2">
        Заполняйте только нужные блоки: пустые блоки на сайте не показываются.
      </p>
      <div className="mt-5">
        <ArticleForm
          topicItems={topicOptions()}
          sourceItems={sourceOptions()}
          ideaItems={ideaOptions()}
          stateItems={stateOptions()}
        />
      </div>
      <p className="mt-4 text-xs text-ink-3">
        <Link href="/admin/articles" className="text-accent hover:underline">К списку статей</Link>
      </p>
    </div>
  );
}
