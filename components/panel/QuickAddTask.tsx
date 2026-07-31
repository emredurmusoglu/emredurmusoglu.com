import { createTask } from "@/lib/actions/tasks";

type ProjectOption = { id: number; title: string };

const chipClass =
  "rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-600 outline-none transition hover:border-neutral-300 focus:border-indigo-500";

export function QuickAddTask({
  projects,
  defaultProjectId,
  detailed = false,
}: {
  projects: ProjectOption[];
  defaultProjectId?: number;
  detailed?: boolean;
}) {
  return (
    <form
      action={createTask}
      className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <input
          name="title"
          required
          maxLength={300}
          placeholder="Ne yapılacak?"
          aria-label="Yeni iş"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Ekle
        </button>
      </div>

      {detailed ? (
        <div className="flex flex-wrap gap-2 border-t border-neutral-100 px-1 pt-2">
          <select
            name="projectId"
            defaultValue={defaultProjectId ?? ""}
            aria-label="Proje"
            className={chipClass}
          >
            <option value="">Proje yok</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          <select
            name="priority"
            defaultValue="0"
            aria-label="Öncelik"
            className={chipClass}
          >
            <option value="0">Normal</option>
            <option value="1">Önemli</option>
            <option value="2">Acil</option>
          </select>

          <input type="date" name="dueDate" aria-label="Termin" className={chipClass} />
        </div>
      ) : (
        defaultProjectId !== undefined && (
          <input type="hidden" name="projectId" value={defaultProjectId} />
        )
      )}
    </form>
  );
}
