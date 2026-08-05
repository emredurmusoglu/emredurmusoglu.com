import Link from "next/link";
import { notFound } from "next/navigation";

import { SubmitButton } from "@/components/panel/SubmitButton";
import { deleteNote, setNotePublished, updateNote } from "@/lib/actions/notes";
import { getNote, listProjectOptions } from "@/lib/dal";
import { formatDateTime } from "@/lib/date";
import { readingTime } from "@/lib/markdown";

const fieldClass =
  "rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

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
          className="text-sm text-neutral-400 transition hover:text-neutral-700"
        >
          ← Notlar
        </Link>

        <div className="flex items-center gap-3">
          {note.isPublic ? (
            <Link
              href={`/yazilar/${note.slug}`}
              target="_blank"
              className="text-xs font-medium text-emerald-700 transition hover:text-emerald-800"
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
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                note.isPublic
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
              ].join(" ")}
            >
              {note.isPublic ? "Yayında · geri çek" : "Sitede yayınla"}
            </button>
          </form>
        </div>
      </div>

      <form action={updateNote} className="space-y-4">
        <input type="hidden" name="id" value={note.id} />

        {/* key = kayıt zamanı: action bitince alanlar yeniden mount olsun,
            yoksa React onları mount anındaki defaultValue'ya sıfırlıyor ve
            kaydedilen değer görünmüyor. Kaydet butonu bilerek bu sarmalın
            DIŞINDA: kendisi de sıfırlanırsa toast'ı tetikleyemez. */}
        <div key={note.updatedAt.toISOString()} className="space-y-4">
          <input
            name="title"
            defaultValue={note.title}
            maxLength={300}
            aria-label="Başlık"
            className="w-full bg-transparent text-2xl font-semibold tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300"
            placeholder="Başlık"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              name="projectId"
              defaultValue={note.projectId ?? ""}
              aria-label="Proje"
              className={fieldClass}
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
              className={fieldClass}
            />
          </div>

          <input
            name="excerpt"
            defaultValue={note.excerpt ?? ""}
            maxLength={500}
            aria-label="Özet"
            placeholder="Özet — blog listesinde görünür (boş bırakırsan içerikten türetilir)"
            className={`${fieldClass} w-full`}
          />

          <textarea
            name="content"
            defaultValue={note.content}
            rows={20}
            aria-label="İçerik"
            placeholder="Markdown yazabilirsin…"
            className={`${fieldClass} w-full resize-y p-4 font-mono leading-relaxed`}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            {formatDateTime(note.updatedAt)} · ~{readingTime(note.content)} dk ·{" "}
            <span className="font-mono">/{note.slug}</span>
            {note.isPublic ? " · slug yayında olduğu için sabit" : ""}
          </p>
          <SubmitButton className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60">
            Kaydet
          </SubmitButton>
        </div>
      </form>

      <form action={deleteNote} className="flex justify-end pt-4">
        <input type="hidden" name="id" value={note.id} />
        <button
          type="submit"
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-red-300 hover:text-red-600"
        >
          Notu sil
        </button>
      </form>
    </div>
  );
}
