import Link from "next/link";

import { QuickAddTask } from "@/components/panel/QuickAddTask";
import { TaskRow } from "@/components/panel/TaskRow";
import { clearDoneTasks } from "@/lib/actions/tasks";
import { listProjectOptions, listTasks } from "@/lib/dal";

type View = "open" | "todo" | "doing" | "done" | "all";

const VIEWS: { key: View; label: string }[] = [
  { key: "open", label: "Açık" },
  { key: "doing", label: "Yapılıyor" },
  { key: "done", label: "Tamamlanan" },
  { key: "all", label: "Hepsi" },
];

function chip(active: boolean) {
  return [
    "shrink-0 rounded-full px-3 py-1.5 text-xs transition",
    active
      ? "bg-indigo-600 font-medium text-white"
      : "border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-800",
  ].join(" ");
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; project?: string }>;
}) {
  const params = await searchParams;

  const view: View = VIEWS.some((v) => v.key === params.view)
    ? (params.view as View)
    : "open";

  const projectId = params.project ? Number.parseInt(params.project, 10) : null;
  const validProjectId =
    projectId !== null && Number.isFinite(projectId) ? projectId : undefined;

  const [all, projectOptions] = await Promise.all([
    listTasks(validProjectId !== undefined ? { projectId: validProjectId } : {}),
    listProjectOptions(),
  ]);

  const tasks = all.filter((task) => {
    if (view === "all") return true;
    if (view === "open") return task.status !== "done";
    return task.status === view;
  });

  const buildHref = (next: Partial<{ view: View; project: string }>) => {
    const search = new URLSearchParams();
    const v = next.view ?? view;
    const p = next.project ?? (validProjectId ? String(validProjectId) : "");
    if (v !== "open") search.set("view", v);
    if (p) search.set("project", p);
    const qs = search.toString();
    return qs ? `/panel/tasks?${qs}` : "/panel/tasks";
  };

  const doneCount = all.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Yapılacaklar</h1>
        <span className="text-sm text-neutral-400">{tasks.length} kayıt</span>
      </header>

      <QuickAddTask
        projects={projectOptions}
        defaultProjectId={validProjectId}
        detailed
      />

      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((item) => (
          <Link
            key={item.key}
            href={buildHref({ view: item.key })}
            className={chip(view === item.key)}
          >
            {item.label}
          </Link>
        ))}

        <span className="mx-1 h-4 w-px bg-neutral-200" />

        <Link
          href={buildHref({ project: "" })}
          className={chip(validProjectId === undefined)}
        >
          Tüm projeler
        </Link>
        {projectOptions.map((project) => (
          <Link
            key={project.id}
            href={buildHref({ project: String(project.id) })}
            className={chip(validProjectId === project.id)}
          >
            {project.title}
          </Link>
        ))}
      </div>

      {tasks.length ? (
        <ul className="rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              showProject={validProjectId === undefined}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-400 shadow-sm">
          Bu filtrede kayıt yok.
        </p>
      )}

      {/* Toplu silme tüm projeleri kapsıyor — bu yüzden sadece filtresiz görünümde */}
      {view === "done" && validProjectId === undefined && doneCount > 0 ? (
        <form action={clearDoneTasks} className="flex justify-end">
          <button
            type="submit"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-red-300 hover:text-red-600"
          >
            Tamamlananları sil ({doneCount})
          </button>
        </form>
      ) : null}
    </div>
  );
}
