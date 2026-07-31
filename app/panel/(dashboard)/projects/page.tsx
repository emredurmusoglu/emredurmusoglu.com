import Link from "next/link";

import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/actions/projects";
import { listProjects } from "@/lib/dal";
import type { Project } from "@/lib/db/schema";

const STATUS_OPTIONS = [
  { value: "idea", label: "Fikir" },
  { value: "active", label: "Aktif" },
  { value: "paused", label: "Duraklatıldı" },
  { value: "shipped", label: "Yayında" },
] as const;

const STATUS_STYLE: Record<string, string> = {
  idea: "bg-white/[0.06] text-white/50",
  active: "bg-sky-400/15 text-sky-200/90",
  paused: "bg-amber-400/10 text-amber-200/80",
  shipped: "bg-emerald-400/15 text-emerald-200/90",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 outline-none transition placeholder:text-white/25 focus:border-white/25";

function ProjectFields({ project }: { project?: Project }) {
  return (
    <>
      <input
        name="title"
        defaultValue={project?.title}
        required
        maxLength={160}
        placeholder="Proje adı"
        aria-label="Proje adı"
        className={inputClass}
      />

      <textarea
        name="description"
        defaultValue={project?.description ?? ""}
        rows={3}
        maxLength={2000}
        placeholder="Kısa açıklama — ana sayfadaki kartta bu görünür"
        aria-label="Açıklama"
        className={`${inputClass} resize-y`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="status"
          defaultValue={project?.status ?? "idea"}
          aria-label="Durum"
          className={inputClass}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          name="url"
          type="url"
          defaultValue={project?.url ?? ""}
          placeholder="https://…"
          aria-label="Bağlantı"
          className={inputClass}
        />

        <input
          name="iconUrl"
          defaultValue={project?.iconUrl ?? ""}
          placeholder="/logo.png"
          aria-label="İkon yolu"
          className={inputClass}
        />

        <input
          name="sort"
          type="number"
          defaultValue={project?.sort ?? 0}
          placeholder="Sıra"
          aria-label="Sıra"
          className={inputClass}
        />
      </div>

      <input
        name="accent"
        defaultValue={project?.accent ?? ""}
        placeholder="Kart alt çizgisi (tailwind gradient sınıfları)"
        aria-label="Vurgu rengi"
        className={`${inputClass} font-mono text-xs`}
      />

      <label className="flex items-center gap-2.5 text-sm text-white/60">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={project?.isPublic ?? false}
          className="h-4 w-4 rounded border-white/20 bg-white/10 accent-white"
        />
        Ana sayfada göster
      </label>
    </>
  );
}

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projeler</h1>
        <span className="text-sm text-white/30">{projects.length} proje</span>
      </header>

      <details className="rounded-2xl border border-white/10 bg-white/[0.04]">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm text-white/60 transition hover:text-white/90">
          + Yeni proje
        </summary>
        <form action={createProject} className="space-y-3 border-t border-white/[0.06] p-4">
          <ProjectFields />
          <button
            type="submit"
            className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
          >
            Oluştur
          </button>
        </form>
      </details>

      {projects.length ? (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              id={`p${project.id}`}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02]"
            >
              <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="text-sm font-medium text-white/90">
                  {project.title}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] ${STATUS_STYLE[project.status]}`}
                >
                  {
                    STATUS_OPTIONS.find((o) => o.value === project.status)
                      ?.label
                  }
                </span>
                {project.isPublic ? (
                  <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/45">
                    ana sayfada
                  </span>
                ) : null}

                <span className="ml-auto flex items-center gap-3 text-xs">
                  <Link
                    href={`/panel/tasks?project=${project.id}`}
                    className="text-white/35 transition hover:text-white/70"
                  >
                    İşleri →
                  </Link>
                </span>
              </div>

              {project.description ? (
                <p className="px-4 pb-3 text-xs leading-relaxed text-white/40">
                  {project.description}
                </p>
              ) : null}

              <details className="border-t border-white/[0.06]">
                <summary className="cursor-pointer list-none px-4 py-2.5 text-xs text-white/30 transition hover:text-white/60">
                  Düzenle
                </summary>
                {/* key = kayıt zamanı: kaydettikten sonra form yeniden mount
                    olsun, alanlar eski defaultValue'da takılı kalmasın. */}
                <form
                  key={project.updatedAt.toISOString()}
                  action={updateProject}
                  className="space-y-3 border-t border-white/[0.06] p-4"
                >
                  <input type="hidden" name="id" value={project.id} />
                  <ProjectFields project={project} />
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>

                <form action={deleteProject} className="border-t border-white/[0.06] px-4 py-3">
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    className="text-xs text-white/25 transition hover:text-red-300/90"
                  >
                    Projeyi sil (işler ve notlar silinmez, bağları kopar)
                  </button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-10 text-center text-sm text-white/30">
          Henüz proje yok.
        </p>
      )}
    </div>
  );
}
