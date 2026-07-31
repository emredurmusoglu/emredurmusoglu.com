import Link from "next/link";

import { createNote } from "@/lib/actions/notes";
import { listNotes } from "@/lib/dal";
import { formatDate } from "@/lib/date";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const all = await listNotes();

  const query = q?.trim().toLowerCase() ?? "";
  const notes = all.filter((note) => {
    if (tag && !note.tags.includes(tag)) return false;
    if (!query) return true;
    return (
      note.title.toLowerCase().includes(query) ||
      (note.excerpt ?? "").toLowerCase().includes(query)
    );
  });

  const allTags = [...new Set(all.flatMap((note) => note.tags))].sort();

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Notlar</h1>
        <form action={createNote}>
          <input type="hidden" name="title" value="Başlıksız not" />
          <button
            type="submit"
            className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
          >
            Yeni not
          </button>
        </form>
      </header>

      <form className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
        {tag ? <input type="hidden" name="tag" value={tag} /> : null}
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Notlarda ara…"
          aria-label="Notlarda ara"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </form>

      {allTags.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/panel/notes"
            className={[
              "rounded-full px-3 py-1.5 text-xs transition",
              tag
                ? "bg-white/[0.05] text-white/45 hover:bg-white/10 hover:text-white/75"
                : "bg-white/15 text-white",
            ].join(" ")}
          >
            Tümü
          </Link>
          {allTags.map((item) => (
            <Link
              key={item}
              href={`/panel/notes?tag=${encodeURIComponent(item)}`}
              className={[
                "rounded-full px-3 py-1.5 text-xs transition",
                tag === item
                  ? "bg-white/15 text-white"
                  : "bg-white/[0.05] text-white/45 hover:bg-white/10 hover:text-white/75",
              ].join(" ")}
            >
              #{item}
            </Link>
          ))}
        </div>
      ) : null}

      {notes.length ? (
        <ul className="space-y-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/panel/notes/${note.id}`}
                className="block rounded-xl px-4 py-3 transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-white/90">
                    {note.title}
                  </span>
                  {note.isPublic ? (
                    <span className="shrink-0 rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-300/80">
                      yayında
                    </span>
                  ) : null}
                </div>

                {note.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-xs text-white/40">
                    {note.excerpt}
                  </p>
                ) : null}

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/25">
                  <span>{formatDate(note.updatedAt)}</span>
                  {note.projectTitle ? <span>· {note.projectTitle}</span> : null}
                  {note.tags.map((item) => (
                    <span key={item}>#{item}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-10 text-center text-sm text-white/30">
          {query || tag ? "Eşleşen not yok." : "Henüz not yok. Yeni not ile başla."}
        </p>
      )}
    </div>
  );
}
