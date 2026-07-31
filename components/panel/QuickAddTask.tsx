import { createTask } from "@/lib/actions/tasks";

type ProjectOption = { id: number; title: string };

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
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-2"
    >
      <div className="flex items-center gap-2">
        <input
          name="title"
          required
          maxLength={300}
          placeholder="Ne yapılacak?"
          aria-label="Yeni iş"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
        >
          Ekle
        </button>
      </div>

      {detailed ? (
        <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-1 pt-2">
          <select
            name="projectId"
            defaultValue={defaultProjectId ?? ""}
            aria-label="Proje"
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/70 outline-none transition hover:bg-white/10"
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
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/70 outline-none transition hover:bg-white/10"
          >
            <option value="0">Normal</option>
            <option value="1">Önemli</option>
            <option value="2">Acil</option>
          </select>

          <input
            type="date"
            name="dueDate"
            aria-label="Termin"
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/70 outline-none transition hover:bg-white/10"
          />
        </div>
      ) : (
        defaultProjectId !== undefined && (
          <input type="hidden" name="projectId" value={defaultProjectId} />
        )
      )}
    </form>
  );
}
