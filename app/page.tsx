import Image from "next/image";
import Link from "next/link";

import { ProjectCard } from "@/components/ProjectCard";
import { getPublicNotes, getPublicProjects } from "@/lib/content";
import { formatDate } from "@/lib/date";

export const revalidate = 3600;

export default async function Home() {
  const [projects, notes] = await Promise.all([
    getPublicProjects(),
    getPublicNotes(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Background — aurora blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/35 via-indigo-500/25 to-fuchsia-500/25 blur-3xl" />
        <div className="absolute top-48 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/15 to-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Header — avatar solda, iletişim sağda */}
        <header className="mb-12 flex items-center justify-between md:mb-16">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 blur-xl" />
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/15 md:h-[88px] md:w-[88px]">
              <Image
                src="/ed-512.png"
                alt="ED logo"
                fill
                priority
                sizes="(max-width: 768px) 72px, 88px"
                className="object-cover"
              />
            </div>
          </div>

          <a
            href="mailto:emredurmusoglu1@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/15"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
              <path d="m22 8-10 6L2 8" />
            </svg>
            <span className="hidden sm:inline">İletişime geç</span>
          </a>
        </header>

        {/* Hero */}
        <section className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Emre Durmuşoğlu
            </span>
          </h1>

          <div className="mb-7 h-px w-16 bg-gradient-to-r from-sky-400/60 via-indigo-400/40 to-fuchsia-400/60" />

          <p className="mb-6 text-xl leading-relaxed text-white/85 md:text-2xl">
            Merhaba, ben Emre. Fikirden yayına giden yolu kısaltmaya çalışan
            bağımsız bir üreticiyim.
          </p>

          <div className="space-y-4 text-base leading-relaxed text-white/60 md:text-lg">
            <p>
              Vibe coding yaklaşımını bir merak konusu olarak değil, üretim biçimim olarak benimsiyorum. Eskiden bir ekibin aylarca üzerinde çalıştığı projeleri bugün tek başıma, haftalar içinde geliştirip kullanılabilir hâle getirebiliyorum.
            </p>
            <p>
              Fikri bulmaktan tasarıma, koddan mağaza yayınına ve kullanıcı
              desteğine kadar her adımı kendim yürütüyorum. Aşağıdakiler bu
              çabanın şu ana kadarki somut çıktıları.
            </p>
          </div>
        </section>

        {/* Ürünler */}
        {projects.length ? (
          <section className="mt-16 md:mt-24">
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="text-xs uppercase tracking-[0.15em] text-white/40">
                Ürünler
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs tabular-nums text-white/25">
                {projects.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Yazılar */}
        {notes.length ? (
          <section className="mt-16 md:mt-24">
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="text-xs uppercase tracking-[0.15em] text-white/40">
                Yazılar
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <Link
                href="/yazilar"
                className="text-xs text-white/40 transition hover:text-white/80"
              >
                Tümü →
              </Link>
            </div>

            <ul className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/yazilar/${note.slug}`}
                    className="group flex items-baseline justify-between gap-4 text-white/70 transition hover:text-white"
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
        ) : null}

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-white/40 md:mt-28">
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}
