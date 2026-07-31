import { deleteTask, toggleTask } from "@/lib/actions/tasks";
import { describeDue } from "@/lib/date";

const DUE_TONE: Record<string, string> = {
  overdue: "text-red-600",
  today: "text-amber-600",
  soon: "text-neutral-500",
  later: "text-neutral-400",
};

const PRIORITY_DOT: Record<number, string> = {
  1: "bg-amber-500",
  2: "bg-red-500",
};

export type TaskRowData = {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  priority: number;
  dueDate: Date | null;
  projectId: number | null;
  projectTitle: string | null;
};

export function TaskRow({
  task,
  showProject = true,
}: {
  task: TaskRowData;
  showProject?: boolean;
}) {
  const done = task.status === "done";
  const due = describeDue(task.dueDate);

  return (
    <li className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-neutral-50">
      {/* Checkbox yerine form — JS olmadan da çalışır */}
      <form action={toggleTask} className="pt-0.5">
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

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {PRIORITY_DOT[task.priority] && !done ? (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`}
              aria-label={task.priority === 2 ? "Acil" : "Önemli"}
            />
          ) : null}
          <span
            className={[
              "truncate text-sm",
              done ? "text-neutral-400 line-through" : "text-neutral-800",
            ].join(" ")}
          >
            {task.title}
          </span>
        </div>

        {(showProject && task.projectTitle) || due ? (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {showProject && task.projectTitle ? (
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-neutral-500">
                {task.projectTitle}
              </span>
            ) : null}
            {due && !done ? (
              <span className={DUE_TONE[due.tone]}>{due.text}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <form action={deleteTask} className="pt-0.5">
        <input type="hidden" name="id" value={task.id} />
        <button
          type="submit"
          aria-label="Sil"
          className="rounded-md p-1 text-transparent transition group-hover:text-neutral-300 hover:!text-red-600 focus-visible:text-neutral-400"
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
    </li>
  );
}
