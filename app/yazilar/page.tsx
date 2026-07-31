import type { Metadata } from "next";
import Link from "next/link";

import { getPublicNotes } from "@/lib/content";
import { formatDate } from "@/lib/date";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Yazılar — Emre Durmuşoğlu",
  description:
    "Ürün geliştirme, iOS ve SaaS üzerine notlar ve yazılar.",
  alternates: { canonical: "/yazilar" },
};

export default async function YazilarPage() {
  const notes = await getPublicNotes();

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/25 via-indigo-500/20 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white/80"
        >
          ← Emre Durmuşoğlu
        </Link>

        <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
          Yazılar
        </h1>
        <div className="mt-5 h-px w-16 bg-gradient-to-r from-sky-400/60 via-indigo-400/40 to-fuchsia-400/60" />

        {notes.length ? (
          <ul className="mt-12 space-y-3">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/yazilar/${note.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white/95">
                      {note.title}
                    </h2>
                    <time
                      dateTime={note.publishedAt?.toISOString()}
                      className="shrink-0 text-xs text-white/35"
                    >
                      {formatDate(note.publishedAt)}
                    </time>
                  </div>

                  {note.excerpt ? (
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {note.excerpt}
                    </p>
                  ) : null}

                  {note.tags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/40"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 h-px w-0 bg-gradient-to-r from-sky-400/70 via-indigo-400/50 to-fuchsia-400/70 transition-all duration-300 group-hover:w-24" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-white/40">Henüz yayımlanmış bir yazı yok.</p>
        )}
      </div>
    </main>
  );
}
