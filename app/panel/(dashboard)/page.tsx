import Link from "next/link";

import { QuickAddTask } from "@/components/panel/QuickAddTask";
import { TaskRow } from "@/components/panel/TaskRow";
import { formatDate } from "@/lib/date";
import { listNotes, listProjectOptions, listTasks } from "@/lib/dal";

const cardClass = "rounded-2xl border border-neutral-200 bg-white shadow-sm";
const emptyClass = `${cardClass} px-4 py-6 text-center text-sm text-neutral-400`;

export default async function PanelHome() {
  const [todo, doing, notes, projectOptions] = await Promise.all([
    listTasks({ status: "todo" }),
    listTasks({ status: "doing" }),
    listNotes(),
    listProjectOptions(),
  ]);

  const recentNotes = notes.slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Bugün</h1>
        <p className="mt-1 text-sm text-neutral-500">{formatDate(new Date())}</p>
      </header>

      <QuickAddTask projects={projectOptions} detailed />

      <section>
        <div className="mb-2 flex items-baseline justify-between px-3">
          <h2 className="text-sm font-medium text-neutral-700">
            Yapılacaklar
            {todo.length ? (
              <span className="ml-2 text-neutral-400">{todo.length}</span>
            ) : null}
          </h2>
          <Link
            href="/panel/tasks"
            className="text-xs text-neutral-400 transition hover:text-neutral-700"
          >
            Tümü →
          </Link>
        </div>

        {todo.length ? (
          <ul className={`${cardClass} p-1`}>
            {todo.map((task) => (
              <TaskRow key={task.id} task={task} projects={projectOptions} />
            ))}
          </ul>
        ) : (
          <p className={emptyClass}>Bekleyen bir iş yok.</p>
        )}
      </section>

      {doing.length ? (
        <section>
          <h2 className="mb-2 px-3 text-sm font-medium text-neutral-700">
            Devam edenler
          </h2>
          <ul className={`${cardClass} p-1`}>
            {doing.map((task) => (
              <TaskRow key={task.id} task={task} projects={projectOptions} />
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="mb-2 flex items-baseline justify-between px-3">
          <h2 className="text-sm font-medium text-neutral-700">Son notlar</h2>
          <Link
            href="/panel/notes"
            className="text-xs text-neutral-400 transition hover:text-neutral-700"
          >
            Tümü →
          </Link>
        </div>

        {recentNotes.length ? (
          <ul className={`${cardClass} space-y-1 p-1`}>
            {recentNotes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/panel/notes/${note.id}`}
                  className="block rounded-xl px-3 py-2 transition hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-neutral-800">
                      {note.title}
                    </span>
                    {note.isPublic ? (
                      <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                        yayında
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {formatDate(note.updatedAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={emptyClass}>Henüz not yok.</p>
        )}
      </section>
    </div>
  );
}
