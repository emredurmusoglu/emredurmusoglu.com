import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteNote, setNotePublished, updateNote } from "@/lib/actions/notes";
import { getNote, listProjectOptions } from "@/lib/dal";
import { formatDateTime } from "@/lib/date";
import { readingTime, renderMarkdown } from "@/lib/markdown";

export default async function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id)) notFound();

  const [note, projectOptions] = await Promise.all([
    getNote(id),
    listProjectOptions(),
  ]);
  if (!note) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/panel/notes"
          className="text-sm text-white/35 transition hover:text-white/70"
        >
          ← Notlar
        </Link>

        <div className="flex items-center gap-3">
          {note.isPublic ? (
            <Link
              href={`/yazilar/${note.slug}`}
              target="_blank"
              className="text-xs text-emerald-300/80 transition hover:text-emerald-200"
            >
              Sitede gör ↗
            </Link>
          ) : null}

          <form action={setNotePublished}>
            <input type="hidden" name="id" value={note.id} />
            <input
              type="hidden"
              name="isPublic"
              value={note.isPublic ? "false" : "true"}
            />
            <button
              type="submit"
              className={[
                "rounded-full px-3 py-1.5 text-xs transition",
                note.isPublic
                  ? "bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80",
              ].join(" ")}
            >
              {note.isPublic ? "Yayında · geri çek" : "Sitede yayınla"}
            </button>
          </form>
        </div>
      </div>

      {/* key = kayıt zamanı: action bittikten sonra form yeniden mount olsun.
          Aksi halde React, kontrolsüz select/input'ları mount anındaki
          defaultValue'ya sıfırlıyor ve alanlar kaydedilen değeri göstermiyor. */}
      <form
        key={note.updatedAt.toISOString()}
        action={updateNote}
        className="space-y-4"
      >
        <input type="hidden" name="id" value={note.id} />

        <input
          name="title"
          defaultValue={note.title}
          maxLength={300}
          aria-label="Başlık"
          className="w-full bg-transparent text-2xl font-semibold tracking-tight text-white outline-none placeholder:text-white/25"
          placeholder="Başlık"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            name="projectId"
            defaultValue={note.projectId ?? ""}
            aria-label="Proje"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 outline-none transition focus:border-white/25"
          >
            <option value="">Proje yok</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          <input
            name="tags"
            defaultValue={note.tags.join(", ")}
            aria-label="Etiketler"
            placeholder="etiketler: swift, saas, fikir"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 outline-none transition placeholder:text-white/25 focus:border-white/25"
          />
        </div>

        <input
          name="excerpt"
          defaultValue={note.excerpt ?? ""}
          maxLength={500}
          aria-label="Özet"
          placeholder="Özet — blog listesinde görünür (boş bırakırsan içerikten türetilir)"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 outline-none transition placeholder:text-white/25 focus:border-white/25"
        />

        <textarea
          name="content"
          defaultValue={note.content}
          rows={20}
          aria-label="İçerik"
          placeholder="Markdown yazabilirsin…"
          className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] p-4 font-mono text-sm leading-relaxed text-white/85 outline-none transition placeholder:text-white/25 focus:border-white/25"
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            {formatDateTime(note.updatedAt)} · ~{readingTime(note.content)} dk ·{" "}
            <span className="font-mono">/{note.slug}</span>
            {note.isPublic ? " · slug yayında olduğu için sabit" : ""}
          </p>
          <button
            type="submit"
            className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
          >
            Kaydet
          </button>
        </div>
      </form>

      {note.content.trim() ? (
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h2 className="mb-4 text-xs uppercase tracking-wider text-white/25">
            Önizleme
          </h2>
          <div
            className="prose-note"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
          />
        </section>
      ) : null}

      <form action={deleteNote} className="flex justify-end pt-4">
        <input type="hidden" name="id" value={note.id} />
        <button
          type="submit"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/35 transition hover:border-red-400/30 hover:text-red-300/90"
        >
          Notu sil
        </button>
      </form>
    </div>
  );
}
