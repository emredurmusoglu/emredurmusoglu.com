import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppleIcon, PlayIcon } from "@/components/StoreIcons";
import { BrowserFrame, DeviceFrame } from "@/components/work/Frames";
import { getPublicProject } from "@/lib/content";
import { getProduct, products } from "@/lib/products";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  const project = product ? await getPublicProject(slug) : null;
  if (!product || !project) return {};

  const cover = product.heroDesktop ?? product.heroPhones?.[1];

  return {
    title: `${project.title} — Emre Durmuşoğlu`,
    description: product.tagline,
    alternates: { canonical: `/urunler/${slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} · ${product.category}`,
      description: product.tagline,
      images: cover ? [{ url: cover.src, width: cover.width, height: cover.height }] : [],
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

type Project = NonNullable<Awaited<ReturnType<typeof getPublicProject>>>;

function StoreLinks({ project, primary = false }: { project: Project; primary?: boolean }) {
  const solid =
    "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-white/85";
  const ghost =
    "inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/75 transition hover:border-white/30 hover:text-white";
  const host = project.url ? new URL(project.url).host.replace(/^www\./, "") : null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.iosUrl ? (
        <a href={project.iosUrl} target="_blank" rel="noreferrer" className={primary ? solid : ghost}>
          <AppleIcon />
          App Store
        </a>
      ) : null}
      {project.androidUrl ? (
        <a href={project.androidUrl} target="_blank" rel="noreferrer" className={ghost}>
          <PlayIcon />
          Google Play
        </a>
      ) : project.androidSoon ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-5 py-2.5 text-sm font-medium text-amber-100/80">
          <PlayIcon />
          Google Play · yakında
        </span>
      ) : null}
      {!project.iosUrl && !project.androidUrl && project.url ? (
        <a href={project.url} target="_blank" rel="noreferrer" className={primary ? solid : ghost}>
          {host} ↗
        </a>
      ) : null}
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const project = product ? await getPublicProject(slug) : null;
  if (!product || !project) notFound();

  const icon = project.iconUrl?.startsWith("/") ? project.iconUrl : null;
  const isApp = product.kind === "app";

  const meta = [
    { label: "Kategori", value: product.category },
    { label: "Platform", value: product.platform },
    { label: "Sorumluluk", value: "Fikir, tasarım, geliştirme ve yayın" },
    { label: "Yayında", value: product.year },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-tr ${product.glow} blur-3xl`}
        />
        <div
          className={`absolute top-[70rem] -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr ${product.glow} opacity-60 blur-3xl`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Link
          href="/#urunler"
          className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white/85"
        >
          ← Ana sayfa
        </Link>

        {/* Başlık */}
        <header className="mt-10 md:mt-14">
          <div className="flex items-center gap-3">
            {icon ? (
              <span className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image src={icon} alt="" fill sizes="48px" className="object-cover" />
              </span>
            ) : null}
            <span className="text-xs uppercase tracking-[0.15em] text-white/40">Kendi projem</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
            {product.tagline}
          </p>
          <div className={`mt-7 h-px w-16 bg-gradient-to-r ${product.accent}`} />
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            {product.summary}
          </p>

          <div className="mt-8">
            <StoreLinks project={project} primary />
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-y border-white/10 py-6 text-sm sm:grid-cols-2 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-white/35">{m.label}</dt>
                <dd className="mt-1 text-white/80">{m.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Vitrin: uygulamada üç telefon, web'de tarayıcı + telefon */}
        {isApp && product.heroPhones ? (
          <div className="relative mt-14 flex items-end justify-center md:mt-20">
            <div
              className={`pointer-events-none absolute inset-x-10 bottom-10 top-1/4 rounded-full bg-gradient-to-tr ${product.glow} blur-3xl`}
            />
            <DeviceFrame
              image={product.heroPhones[0]}
              sizes="(max-width: 768px) 30vw, 230px"
              className="relative z-0 w-[30%] max-w-[230px] -rotate-[5deg] translate-x-[12%] translate-y-[4%] opacity-80"
            />
            <DeviceFrame
              image={product.heroPhones[1]}
              priority
              sizes="(max-width: 768px) 42vw, 300px"
              className="relative z-10 w-[40%] max-w-[300px]"
            />
            <DeviceFrame
              image={product.heroPhones[2]}
              sizes="(max-width: 768px) 30vw, 230px"
              className="relative z-0 w-[30%] max-w-[230px] rotate-[5deg] -translate-x-[12%] translate-y-[4%] opacity-80"
            />
          </div>
        ) : null}

        {!isApp && product.heroDesktop ? (
          <div className="relative mt-12 md:mt-16">
            <BrowserFrame image={product.heroDesktop} priority className="md:w-[88%]" />
            {product.heroMobile ? (
              <DeviceFrame
                image={product.heroMobile}
                sizes="(max-width: 768px) 30vw, 220px"
                className="absolute -bottom-8 right-0 w-[28%] max-w-[220px] md:-bottom-12"
              />
            ) : null}
          </div>
        ) : null}

        <ul className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${isApp ? "mt-16" : "mt-20 md:mt-24"}`}>
          {product.stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <span className="block text-3xl font-semibold tabular-nums md:text-4xl">{s.value}</span>
              <span className="mt-1 block text-xs leading-snug text-white/45 md:text-sm">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* Öne çıkanlar */}
        <section className="mt-20 md:mt-28">
          <SectionTitle>Öne çıkanlar</SectionTitle>
          <div className="space-y-16 md:space-y-24">
            {product.features.map((f, i) => (
              <article
                key={f.title}
                className={`grid items-center gap-8 md:gap-12 ${
                  isApp ? "md:grid-cols-2" : "md:grid-cols-[1fr_1.7fr]"
                }`}
              >
                <div className={i % 2 ? "md:order-2" : ""}>
                  <span className="font-mono text-xs text-white/30">0{i + 1}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-white/60">{f.body}</p>
                </div>
                {isApp ? (
                  <div className="relative flex justify-center">
                    <div
                      className={`pointer-events-none absolute inset-8 rounded-full bg-gradient-to-tr ${product.glow} blur-3xl`}
                    />
                    <DeviceFrame
                      image={f.image}
                      sizes="(max-width: 768px) 60vw, 250px"
                      className="relative w-[60%] max-w-[250px]"
                    />
                  </div>
                ) : (
                  <BrowserFrame image={f.image} sizes="(max-width: 768px) 100vw, 620px" />
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Web ürünlerinde telefon görünümü */}
        {product.mobile?.length ? (
          <section className="mt-20 md:mt-28">
            <SectionTitle>Telefonda</SectionTitle>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {product.mobile.map((m, i) => (
                <DeviceFrame
                  key={m.src}
                  image={m}
                  sizes="(max-width: 768px) 45vw, 220px"
                  className={i % 2 ? "md:mt-10" : ""}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Detaylar */}
        <section className="mt-20 md:mt-28">
          <SectionTitle>Detaylar</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <span className={`block h-px w-8 bg-gradient-to-r ${product.accent}`} />
                <h3 className="mt-4 font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kapanış */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:mt-28 md:p-12">
          <div className="flex items-center gap-4">
            {icon ? (
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image src={icon} alt="" fill sizes="56px" className="object-cover" />
              </span>
            ) : null}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h2>
              <p className="text-sm text-white/45">{isApp ? "Hemen indirin, deneyin." : "Hemen keşfedin."}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            {product.tagline}
          </p>
          <div className="mt-8">
            <StoreLinks project={project} primary />
          </div>
          <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/45">
            Aklınızda buna benzer bir uygulama mı var?{" "}
            <Link
              href="/iletisim"
              className="text-white/75 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/60"
            >
              Birlikte konuşalım →
            </Link>
          </p>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-white/40 md:mt-28">
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}
