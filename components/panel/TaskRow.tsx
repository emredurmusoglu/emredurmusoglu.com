import { SubmitButton } from "@/components/panel/SubmitButton";
import { TaskItem } from "@/components/panel/TaskItem";
import { deleteTask, toggleTask, updateTask } from "@/lib/actions/tasks";
import { describeDue, toDateInput } from "@/lib/date";

export type TaskRowData = {
  id: number;
  title: string;
  note?: string | null;
  status: "todo" | "doing" | "done";
  priority: number;
  dueDate: Date | null;
  projectId: number | null;
  projectTitle: string | null;
};

type ProjectOption = { id: number; title: string };

const editFieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500";

export function TaskRow({
  task,
  projects = [],
  showProject = true,
}: {
  task: TaskRowData;
  projects?: ProjectOption[];
  showProject?: boolean;
}) {
  const done = task.status === "done";
  const due = describeDue(task.dueDate);

  return (
    <TaskItem
      title={task.title}
      done={done}
      priority={task.priority}
      projectTitle={task.projectTitle}
      // Tarih etiketi sunucuda hesaplanıyor — istemcide üretilirse
      // saat dilimi farkı yüzünden hydration uyuşmazlığı çıkabilir.
      dueText={due?.text ?? null}
      dueTone={due?.tone ?? null}
      showProject={showProject}
      toggleForm={
        <form action={toggleTask}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="done" value={done ? "false" : "true"} />
          <button
            type="submit"
            aria-label={done ? "Geri al" : "Tamamlandı olarak işaretle"}
            className={[
              "flex h-[18px] w-[18px] items-center justify-center rounded-md border transition",
              done
                ? "border-indigo-600 bg-indigo-600"
                : "border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50",
            ].join(" ")}
          >
            {done ? (
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            ) : null}
          </button>
        </form>
      }
      deleteForm={
        <form action={deleteTask}>
          <input type="hidden" name="id" value={task.id} />
          <button
            type="submit"
            aria-label="Sil"
            className="rounded-md p-1 text-neutral-300 transition hover:text-red-600 md:text-transparent md:group-hover:text-neutral-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </form>
      }
      editForm={
        <form action={updateTask} className="space-y-2">
          <input type="hidden" name="id" value={task.id} />

          <textarea
            name="title"
            defaultValue={task.title}
            rows={3}
            maxLength={300}
            required
            aria-label="Başlık"
            className={`${editFieldClass} resize-y`}
          />

          <textarea
            name="note"
            defaultValue={task.note ?? ""}
            rows={2}
            maxLength={5000}
            placeholder="Not (isteğe bağlı)"
            aria-label="Not"
            className={`${editFieldClass} resize-y`}
          />

          <div className="flex flex-wrap gap-2">
            <select
              name="projectId"
              defaultValue={task.projectId ?? ""}
              aria-label="Proje"
              className={`${editFieldClass} w-auto flex-1`}
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
              defaultValue={String(task.priority)}
              aria-label="Öncelik"
              className={`${editFieldClass} w-auto`}
            >
              <option value="0">Normal</option>
              <option value="1">Önemli</option>
              <option value="2">Acil</option>
            </select>

            <input
              type="date"
              name="dueDate"
              defaultValue={toDateInput(task.dueDate)}
              aria-label="Termin"
              className={`${editFieldClass} w-auto`}
            />
          </div>

          <SubmitButton className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60">
            Kaydet
          </SubmitButton>
        </form>
      }
    />
  );
}
