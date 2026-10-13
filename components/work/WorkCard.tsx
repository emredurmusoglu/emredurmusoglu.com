import Image from "next/image";
import Link from "next/link";

import type { Work } from "@/lib/work";

/**
 * Ana sayfadaki "Diğer işler" kartı. Ürün kartlarından daha geniş: işin
 * kendisini ekran görüntüsüyle gösterip vaka çalışmasına götürüyor.
 */
export function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-400/15 via-blue-500/15 to-indigo-500/10 blur-3xl" />

      <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_1.25fr] md:gap-10 md:p-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3D8F] ring-1 ring-white/10">
              <Image src={work.logo} alt="" width={22} height={24} className="h-6 w-auto" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">{work.title}</h3>
              <p className="text-xs text-white/40">
                {work.company} · {work.year}
              </p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-white/75">{work.tagline}</p>

          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {work.stats.map((s) => (
              <li key={s.label}>
                <span className="block text-2xl font-semibold tabular-nums text-white">
                  {s.value}
                </span>
                <span className="block text-xs leading-snug text-white/45">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
            <Link
              href={`/isler/${work.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white/85"
            >
              Projeyi incele
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={work.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-white/30 hover:text-white"
            >
              {work.liveLabel}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Site önde, panel arkada: iki yüzü olan bir iş olduğunu tek bakışta anlatsın */}
        <Link
          href={`/isler/${work.slug}`}
          aria-label={`${work.title} proje detayı`}
          className="relative block min-h-[220px] sm:min-h-[300px] md:min-h-0"
        >
          <div className="absolute right-0 top-0 w-[82%] overflow-hidden rounded-xl border border-white/10 opacity-70 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-500 group-hover:-translate-y-1 group-hover:opacity-90">
            <Image
              src={work.coverSecondary.src}
              alt={work.coverSecondary.alt}
              width={work.coverSecondary.width}
              height={work.coverSecondary.height}
              sizes="(max-width: 768px) 80vw, 460px"
              className="block h-auto w-full"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-[82%] overflow-hidden rounded-xl border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition duration-500 group-hover:translate-y-1">
            <Image
              src={work.cover.src}
              alt={work.cover.alt}
              width={work.cover.width}
              height={work.cover.height}
              sizes="(max-width: 768px) 80vw, 460px"
              className="block h-auto w-full"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}
