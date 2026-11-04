import { MythForm } from "@/components/admin/myth-form";
import { topicOptions } from "@/lib/admin";

export default function NewMythPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight">Новый разбор мифа</h1>
      <p className="mt-1 text-sm text-ink-2">
        Спорное утверждение не объявляйте мифом без достаточных оснований:
        для этого есть вердикт Спорно и Не подтверждено.
      </p>
      <div className="mt-5">
        <MythForm topicItems={topicOptions()} />
      </div>
    </div>
  );
}
