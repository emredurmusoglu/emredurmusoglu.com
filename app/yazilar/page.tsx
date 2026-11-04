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
      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white/80"
        >
          ← Emre Durmuşoğlu
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Yazılar
        </h1>
        <div className="mt-5 h-px w-16 bg-ed/70" />

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
                      className="shrink-0 font-mono text-xs text-white/35"
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
                          className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/40"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 h-px w-0 bg-ed/70 transition-all duration-300 group-hover:w-24" />
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
