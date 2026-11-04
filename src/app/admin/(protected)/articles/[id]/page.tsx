import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/app/admin/actions/articles";
import { ArticleForm } from "@/components/admin/article-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { ideaOptions, sourceOptions, stateOptions, topicOptions } from "@/lib/admin";
import {
  getArticleById,
  getArticleIdeas,
  getArticleSources,
  getArticleTags,
  getArticleTopics,
  stateArticlesOf,
} from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArticleEditPage({ params }: PageProps) {
  const { id } = await params;
  const article = getArticleById(Number(id));
  if (!article) notFound();

  const selectedTopicIds = getArticleTopics(article.id).map((t) => t.id);
  const selectedSourceIds = getArticleSources(article.id).map((s) => s.id);
  const selectedIdeaIds = getArticleIdeas(article.id).map((i) => i.id);
  const selectedStateIds = stateArticlesOf(article.id);
  const tagNames = getArticleTags(article.id).map((t) => t.name).join(", ");

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Редактирование статьи</h1>
        <div className="flex items-center gap-3 text-sm">
          {article.status === "published" && (
            <Link href={`/articles/${article.slug}`} className="text-ink-2 hover:text-ink">
              открыть на сайте
            </Link>
          )}
          <Link href="/admin/articles" className="text-ink-2 hover:text-ink">к списку</Link>
        </div>
      </div>

      <div className="mt-5">
        <ArticleForm
          article={article}
          topicItems={topicOptions()}
          sourceItems={sourceOptions()}
          ideaItems={ideaOptions()}
          stateItems={stateOptions()}
          selected={{
            topicIds: selectedTopicIds,
            sourceIds: selectedSourceIds,
            ideaIds: selectedIdeaIds,
            stateIds: selectedStateIds,
            tagNames,
          }}
        />
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <form action={deleteArticle}>
          <input type="hidden" name="id" value={article.id} />
          <ConfirmSubmit message={`Удалить статью "${article.title}"?`}>
            <Trash2 className="size-4" /> Удалить статью
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
