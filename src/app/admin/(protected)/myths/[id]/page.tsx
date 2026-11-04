import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMyth } from "@/app/admin/actions/myths";
import { MythForm } from "@/components/admin/myth-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { topicOptions } from "@/lib/admin";
import { getMythById, getMythTags, getMythTopics } from "@/lib/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMythEditPage({ params }: PageProps) {
  const { id } = await params;
  const myth = getMythById(Number(id));
  if (!myth) notFound();

  const selectedTopicIds = getMythTopics(myth.id).map((t) => t.id);
  const tagNames = getMythTags(myth.id).map((t) => t.name).join(", ");

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Редактирование разбора</h1>
        <div className="flex items-center gap-3 text-sm">
          {myth.status === "published" && (
            <Link href={`/myths/${myth.slug}`} className="text-ink-2 hover:text-ink">открыть на сайте</Link>
          )}
          <Link href="/admin/myths" className="text-ink-2 hover:text-ink">к списку</Link>
        </div>
      </div>

      <div className="mt-5">
        <MythForm myth={myth} topicItems={topicOptions()} selected={{ topicIds: selectedTopicIds, tagNames }} />
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <form action={deleteMyth}>
          <input type="hidden" name="id" value={myth.id} />
          <ConfirmSubmit message={`Удалить разбор "${myth.statement}"?`}>
            <Trash2 className="size-4" /> Удалить разбор
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
