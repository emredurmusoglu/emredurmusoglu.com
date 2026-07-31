import Link from "next/link";

import { QuickAddTask } from "@/components/panel/QuickAddTask";
import { TaskRow } from "@/components/panel/TaskRow";
import { formatDate } from "@/lib/date";
import {
  listDueTasks,
  listNotes,
  listProjectOptions,
  listProjects,
  listTasks,
} from "@/lib/dal";

const STATUS_LABEL: Record<string, string> = {
  idea: "Fikir",
  active: "Aktif",
  paused: "Duraklatıldı",
  shipped: "Yayında",
};

export default async function PanelHome() {
  const [due, doing, notes, projects, projectOptions] = await Promise.all([
    listDueTasks(),
    listTasks({ status: "doing" }),
    listNotes(),
    listProjects(),
    listProjectOptions(),
  ]);

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );
  const recentNotes = notes.slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Bugün</h1>
        <p className="mt-1 text-sm text-white/40">{formatDate(new Date())}</p>
      </header>

      <QuickAddTask projects={projectOptions} detailed />

      <section>
        <div className="mb-2 flex items-baseline justify-between px-3">
          <h2 className="text-sm font-medium text-white/70">
            Vadesi gelenler
            {due.length ? (
              <span className="ml-2 text-white/30">{due.length}</span>
            ) : null}
          </h2>
          <Link
            href="/panel/tasks"
            className="text-xs text-white/35 transition hover:text-white/70"
          >
            Tümü →
          </Link>
        </div>

        {due.length ? (
          <ul className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
            {due.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 text-center text-sm text-white/30">
            Bugüne yetişmesi gereken bir şey yok.
          </p>
        )}
      </section>

      {doing.length ? (
        <section>
          <h2 className="mb-2 px-3 text-sm font-medium text-white/70">
            Devam edenler
          </h2>
          <ul className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
            {doing.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <div className="mb-2 flex items-baseline justify-between px-3">
            <h2 className="text-sm font-medium text-white/70">Son notlar</h2>
            <Link
              href="/panel/notes"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              Tümü →
            </Link>
          </div>

          {recentNotes.length ? (
            <ul className="space-y-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
              {recentNotes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/panel/notes/${note.id}`}
                    className="block rounded-xl px-3 py-2 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm text-white/85">
                        {note.title}
                      </span>
                      {note.isPublic ? (
                        <span className="shrink-0 rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-300/80">
                          yayında
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-white/30">
                      {formatDate(note.updatedAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 text-center text-sm text-white/30">
              Henüz not yok.
            </p>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between px-3">
            <h2 className="text-sm font-medium text-white/70">Aktif projeler</h2>
            <Link
              href="/panel/projects"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              Tümü →
            </Link>
          </div>

          {activeProjects.length ? (
            <ul className="space-y-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
              {activeProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/panel/projects#p${project.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition hover:bg-white/[0.04]"
                  >
                    <span className="truncate text-sm text-white/85">
                      {project.title}
                    </span>
                    <span className="shrink-0 text-xs text-white/30">
                      {STATUS_LABEL[project.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 text-center text-sm text-white/30">
              Aktif proje yok.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
