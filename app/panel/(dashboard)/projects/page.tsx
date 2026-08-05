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
  idea: "bg-neutral-100 text-neutral-600",
  active: "bg-sky-50 text-sky-700",
  paused: "bg-amber-50 text-amber-700",
  shipped: "bg-emerald-50 text-emerald-700",
};

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

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
          placeholder="Web adresi — https://…"
          aria-label="Web adresi"
          className={inputClass}
        />

        <input
          name="iosUrl"
          type="url"
          defaultValue={project?.iosUrl ?? ""}
          placeholder="App Store linki"
          aria-label="App Store linki"
          className={inputClass}
        />

        <input
          name="androidUrl"
          type="url"
          defaultValue={project?.androidUrl ?? ""}
          placeholder="Google Play linki"
          aria-label="Google Play linki"
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

      <p className="text-xs leading-relaxed text-neutral-400">
        Her iki mağaza linki de doluysa kart, tıklandığında hangi platform
        olduğunu sorar. Tek link varsa doğrudan oraya gider.
      </p>

      <input
        name="accent"
        defaultValue={project?.accent ?? ""}
        placeholder="Kart alt çizgisi (tailwind gradient sınıfları)"
        aria-label="Vurgu rengi"
        className={`${inputClass} font-mono text-xs`}
      />

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2.5 text-sm text-neutral-600">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={project?.isPublic ?? false}
            className="h-4 w-4 rounded border-neutral-300 accent-indigo-600"
          />
          Ana sayfada göster
        </label>

        <label className="flex items-center gap-2.5 text-sm text-neutral-600">
          <input
            type="checkbox"
            name="comingSoon"
            defaultChecked={project?.comingSoon ?? false}
            className="h-4 w-4 rounded border-neutral-300 accent-indigo-600"
          />
          Yakında (kart tıklanmaz)
        </label>
      </div>
    </>
  );
}

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projeler</h1>
        <span className="text-sm text-neutral-400">{projects.length} proje</span>
      </header>

      <details className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-indigo-600 transition hover:text-indigo-700">
          + Yeni proje
        </summary>
        <form
          action={createProject}
          className="space-y-3 border-t border-neutral-100 p-4"
        >
          <ProjectFields />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
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
              className="rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="text-sm font-medium text-neutral-900">
                  {project.title}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[project.status]}`}
                >
                  {STATUS_OPTIONS.find((o) => o.value === project.status)?.label}
                </span>
                {project.isPublic ? (
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                    ana sayfada
                  </span>
                ) : null}
                {project.comingSoon ? (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    yakında
                  </span>
                ) : null}

                <span className="ml-auto flex items-center gap-3 text-xs">
                  <Link
                    href={`/panel/tasks?project=${project.id}`}
                    className="text-neutral-400 transition hover:text-neutral-700"
                  >
                    İşleri →
                  </Link>
                </span>
              </div>

              {project.description ? (
                <p className="px-4 pb-3 text-xs leading-relaxed text-neutral-500">
                  {project.description}
                </p>
              ) : null}

              <details className="border-t border-neutral-100">
                <summary className="cursor-pointer list-none px-4 py-2.5 text-xs text-neutral-400 transition hover:text-neutral-700">
                  Düzenle
                </summary>
                {/* key = kayıt zamanı: kaydettikten sonra form yeniden mount
                    olsun, alanlar eski defaultValue'da takılı kalmasın. */}
                <form
                  key={project.updatedAt.toISOString()}
                  action={updateProject}
                  className="space-y-3 border-t border-neutral-100 p-4"
                >
                  <input type="hidden" name="id" value={project.id} />
                  <ProjectFields project={project} />
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>

                <form
                  action={deleteProject}
                  className="border-t border-neutral-100 px-4 py-3"
                >
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    className="text-xs text-neutral-400 transition hover:text-red-600"
                  >
                    Projeyi sil (işler ve notlar silinmez, bağları kopar)
                  </button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-400 shadow-sm">
          Henüz proje yok.
        </p>
      )}
    </div>
  );
}
