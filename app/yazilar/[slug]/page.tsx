import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicNote, getPublicNotes } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { deriveExcerpt, readingTime, renderMarkdown } from "@/lib/markdown";

export const revalidate = 3600;

export async function generateStaticParams() {
  const notes = await getPublicNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getPublicNote(slug);
  if (!note) return { title: "Yazı bulunamadı" };

  const description = note.excerpt ?? deriveExcerpt(note.content);

  return {
    title: `${note.title} — Emre Durmuşoğlu`,
    description,
    alternates: { canonical: `/yazilar/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description,
      publishedTime: note.publishedAt?.toISOString(),
      modifiedTime: note.updatedAt.toISOString(),
      tags: note.tags,
    },
  };
}

export default async function YaziPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getPublicNote(slug);
  if (!note) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <article className="relative mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/yazilar"
          className="text-sm text-white/40 transition hover:text-white/80"
        >
          ← Yazılar
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
            {note.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-white/35">
            <time dateTime={note.publishedAt?.toISOString()}>
              {formatDate(note.publishedAt)}
            </time>
            <span>·</span>
            <span>{readingTime(note.content)} dk okuma</span>
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.06] px-2.5 py-1 text-white/40"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 h-px w-16 bg-ed/70" />
        </header>

        <div
          className="prose-note mt-10"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
        />

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/40">
          <Link href="/" className="transition hover:text-white/80">
            ← Emre Durmuşoğlu
          </Link>
        </footer>
      </article>
    </main>
  );
}
