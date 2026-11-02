import Link from "next/link";

import { SourceLayer } from "@/components/source/SourceLayer";
import type { getPublicNotes } from "@/lib/content";
import { formatDate } from "@/lib/date";
import notesSource from "@/lib/source/notes.json";

type Note = Awaited<ReturnType<typeof getPublicNotes>>[number];

/** Ana sayfadaki son yazılar — arkasında listeyi çizen kod duruyor. */
export function NotesSection({ notes }: { notes: Note[] }) {
  return (
    <section className="src-host relative isolate mt-16 md:mt-24">
      <SourceLayer snippet={notesSource} variant="bare" />
      <div className="mb-6 flex items-baseline gap-3">
        <h2 className="src-island text-xs uppercase tracking-[0.15em] text-white/40">
          Yazılar
        </h2>
        <span className="h-px flex-1 bg-white/10" />
        <Link
          href="/yazilar"
          className="src-island text-xs text-white/40 transition hover:text-white/80"
        >
          Tümü →
        </Link>
      </div>

      <ul className="space-y-3">
        {notes.slice(0, 3).map((note) => (
          <li key={note.slug}>
            <Link
              href={`/yazilar/${note.slug}`}
              className="src-island group flex items-baseline justify-between gap-4 text-white/70 transition hover:text-white"
            >
              <span className="truncate underline decoration-white/15 underline-offset-4 transition group-hover:decoration-white/50">
                {note.title}
              </span>
              <time
                dateTime={note.publishedAt?.toISOString()}
                className="shrink-0 text-xs text-white/30"
              >
                {formatDate(note.publishedAt)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
