import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrowserFrame, PhoneFrame } from "@/components/work/Frames";
import { getWork, works } from "@/lib/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};

  return {
    title: `${work.title} — Emre Durmuşoğlu`,
    description: work.tagline,
    alternates: { canonical: `/isler/${work.slug}` },
    openGraph: {
      type: "article",
      title: `${work.title} · Proje detayı`,
      description: work.tagline,
      images: [{ url: work.cover.src, width: work.cover.width, height: work.cover.height }],
    },
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-baseline gap-3 md:mb-10">
      <h2 className="text-xs uppercase tracking-[0.15em] text-white/40">{children}</h2>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const meta = [
    { label: "Firma", value: work.company },
    { label: "Sorumluluk", value: work.responsibility },
    { label: "Kapsam", value: work.scope },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-amber-400/15 blur-3xl" />
        <div className="absolute top-[60rem] -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-amber-400/10 via-blue-500/10 to-indigo-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Link
          href="/#isler"
          className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white/85"
        >
          ← Ana sayfa
        </Link>

        {/* Başlık */}
        <header className="mt-10 md:mt-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3D8F] ring-1 ring-white/10">
              <Image src={work.logo} alt="" width={24} height={26} className="h-6 w-auto" />
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-white/40">
              Proje detayı
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">{work.title}</h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
            {work.tagline}
          </p>
          <div className={`mt-7 h-px w-16 bg-gradient-to-r ${work.accent}`} />
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            {work.summary}
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-y border-white/10 py-6 text-sm sm:grid-cols-2 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-white/35">{m.label}</dt>
                <dd className="mt-1 text-white/80">{m.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-white/35">Yayında</dt>
              <dd className="mt-1">
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/60"
                >
                  {work.liveLabel} ↗
                </a>
                <span className="ml-2 text-white/35">· {work.year}</span>
              </dd>
            </div>
          </dl>
        </header>

        <BrowserFrame image={work.cover} priority className="mt-12 md:mt-16" />

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {work.stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <span className="block text-3xl font-semibold tabular-nums md:text-4xl">{s.value}</span>
              <span className="mt-1 block text-xs leading-snug text-white/45 md:text-sm">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* Öne çıkanlar: görsel ve kısa açıklama, sırayla yer değiştirerek */}
        <section className="mt-20 md:mt-28">
          <SectionTitle>Öne çıkanlar</SectionTitle>
          <div className="space-y-16 md:space-y-24">
            {work.features.map((f, i) => (
              <article
                key={f.title}
                className="grid items-center gap-6 md:grid-cols-[1fr_1.7fr] md:gap-12"
              >
                <div className={i % 2 ? "md:order-2" : ""}>
                  <span className="font-mono text-xs text-white/30">0{i + 1}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-white/60">{f.body}</p>
                </div>
                <BrowserFrame image={f.image} sizes="(max-width: 768px) 100vw, 620px" />
              </article>
            ))}
          </div>
        </section>

        {/* Mobil */}
        <section className="mt-20 md:mt-28">
          <SectionTitle>Telefonda</SectionTitle>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {work.mobile.map((m, i) => (
              <PhoneFrame key={m.src} image={m} className={i % 2 ? "md:mt-10" : ""} />
            ))}
          </div>
        </section>

        {/* İşe kazandırdıkları */}
        <section className="mt-20 md:mt-28">
          <SectionTitle>Firmaya kazandırdıkları</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {work.benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <span className={`block h-px w-8 bg-gradient-to-r ${work.accent}`} />
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kapanış */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:mt-28 md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            İşiniz için benzer bir sistem mi düşünüyorsunuz?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            Rezervasyon, talep toplama, planlama ya da ekibinizin her gün kullanacağı bir panel.
            Birlikte netleştirip yayına alalım.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:emredurmusoglu1@gmail.com?subject=${encodeURIComponent("Proje görüşmesi")}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-white/85"
            >
              İletişime geç
            </a>
            <a
              href={work.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/75 transition hover:border-white/30 hover:text-white"
            >
              {work.liveLabel} ↗
            </a>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-white/40 md:mt-28">
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}
