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

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-24">
        {/* Top-right contact icon (desktop) */}
        <div className="absolute right-6 top-20 md:right-10 md:top-24">
          <a
            href="mailto:emredurmusoglu1@gmail.com"
            aria-label="İletişime geç"
            className="hidden md:inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2.5 text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/15"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
              <path d="m22 8-10 6L2 8" />
            </svg>
          </a>
        </div>
        {/* LOGO — avatar with glow */}
        <div className="mb-10 flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 blur-xl" />
            <div className="relative h-[76px] w-[76px] md:h-[96px] md:w-[96px] overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
              <Image
                src="/ed-512.png"
                alt="ED logo"
                fill
                priority
                sizes="(max-width: 768px) 76px, 96px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* LEFT — ABOUT */}
          <section>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Emre Durmuşoğlu
              </span>
            </h1>

            <div className="mb-6 h-px w-16 bg-gradient-to-r from-sky-400/60 via-indigo-400/40 to-fuchsia-400/60" />

            <p className="text-xl md:text-2xl text-white/80 mb-7 max-w-xl leading-relaxed">
              Merhaba, ben Emre. Kullanıcı deneyimi odaklı SaaS ve iOS ürünleri geliştiriyorum.
            </p>

            {/* Bunu büyüttük */}
            <p className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed">
              Üzerinde çalıştığım projelerden ilki <span className="text-white/80 font-medium">Davetiva</span> — dijital
              davetiye oluşturma ve RSVP yönetimini tek linkte toplayan bir platform. Diğeri ise{" "}
              <span className="text-white/80 font-medium">AlarMix</span> — görevlerle alarmı gerçekten susturmayı
              amaçlayan, alışılmış alarm uygulamalarından farklı bir iOS deneyimi.
            </p>

            {notes.length ? (
              <div className="mt-10">
                <h2 className="text-xs uppercase tracking-wider text-white/35">
                  Son yazılar
                </h2>
                <ul className="mt-4 space-y-2.5">
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
                <Link
                  href="/yazilar"
                  className="mt-4 inline-block text-sm text-white/40 transition hover:text-white/80"
                >
                  Tüm yazılar →
                </Link>
              </div>
            ) : null}
          </section>

          {/* RIGHT — PROJECTS */}
          <section className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45">
          <span>© {new Date().getFullYear()} Emre Durmuşoğlu</span>
          <a
            href="mailto:emredurmusoglu1@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:border-white/30 hover:bg-white/15 md:hidden"
          >
            İletişime Geç
          </a>
        </footer>
      </div>
    </main>
  );
}
