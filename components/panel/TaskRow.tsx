import { deleteTask, toggleTask } from "@/lib/actions/tasks";
import { describeDue } from "@/lib/date";

const DUE_TONE: Record<string, string> = {
  overdue: "text-red-300/90",
  today: "text-amber-200/90",
  soon: "text-white/50",
  later: "text-white/35",
};

const PRIORITY_DOT: Record<number, string> = {
  1: "bg-amber-400/80",
  2: "bg-red-400/90",
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
    <li className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.03]">
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
              ? "border-white/25 bg-white/20"
              : "border-white/25 hover:border-white/50 hover:bg-white/10",
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
          {PRIORITY_DOT[task.priority] ? (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`}
              aria-label={task.priority === 2 ? "Acil" : "Önemli"}
            />
          ) : null}
          <span
            className={[
              "truncate text-sm",
              done ? "text-white/30 line-through" : "text-white/85",
            ].join(" ")}
          >
            {task.title}
          </span>
        </div>

        {(showProject && task.projectTitle) || due ? (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {showProject && task.projectTitle ? (
              <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-white/45">
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
          className="rounded-md p-1 text-white/0 transition group-hover:text-white/30 hover:!text-red-300/90 focus-visible:text-white/50"
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
