import Image from "next/image";

import { ContactButton } from "@/components/ContactButton";
import { NotesSection } from "@/components/NotesSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionCount, SectionLabel } from "@/components/SectionLabel";
import { TypedName } from "@/components/TypedName";
import { WorkCard } from "@/components/work/WorkCard";
import { SourceLayer } from "@/components/source/SourceLayer";
import { getPublicNotes, getPublicProjects } from "@/lib/content";
import { getProduct } from "@/lib/products";
import homeSource from "@/lib/source/home.json";
import { works } from "@/lib/work";

export const revalidate = 3600;

const CAPABILITIES = [
  "Web uygulamaları",
  "Yönetim panelleri",
  "iOS uygulamaları",
  "Android uygulamaları",
  "Backend & veritabanı",
  "Yayın & bakım",
];

export default async function Home() {
  const [projects, notes] = await Promise.all([
    getPublicProjects(),
    getPublicNotes(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Sayfanın kendi kodu, bütün sayfanın arkasında */}
      <SourceLayer snippet={homeSource} variant="page" repeat={2} />

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Header — avatar solda, iletişim sağda */}
        <header className="mb-12 flex items-center justify-between md:mb-16">
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

          <ContactButton />
        </header>

        {/* Hero */}
        <section className="max-w-3xl">
          <TypedName />

          <p className="mb-6 text-xl leading-relaxed text-white/85 md:text-2xl">
            Merhaba, ben Emre. Bağımsız bir yazılım geliştiricisiyim.
            Karmaşık işleri, ilk bakışta anlaşılan sade yazılımlara
            dönüştürüyorum.
          </p>

          <div className="space-y-4 text-base leading-relaxed text-white/60 md:text-lg">
            <p>
              Web uygulamaları, yönetim panelleri, iOS ve Android uygulamaları
              geliştiriyorum. Fikrin netleşmesinden tasarıma, koddan mağaza
              yayınına ve sonrasındaki bakıma kadar her adımı tek elden
              yürütüyorum.
            </p>
            <p>
              Aşağıda kendi projelerimi ve geliştirdiğim diğer işleri
              inceleyebilirsiniz.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {CAPABILITIES.map((c) => (
              <li
                key={c}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/55 backdrop-blur"
              >
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Ürünler */}
        {projects.length ? (
          <section id="projeler" className="mt-16 scroll-mt-8 md:mt-24">
            <div className="mb-6 flex items-baseline gap-3">
              <SectionLabel>Kendi projelerim</SectionLabel>
              <span className="h-px flex-1 bg-white/10" />
              <SectionCount count={projects.length} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  color={getProduct(project.slug)?.color}
                  detailHref={getProduct(project.slug) ? `/projeler/${project.slug}` : undefined}
                  isApp={getProduct(project.slug)?.kind === "app"}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Diğer işler */}
        {works.length ? (
          <section id="isler" className="mt-16 scroll-mt-8 md:mt-24">
            <div className="mb-6 flex items-baseline gap-3">
              <SectionLabel>Diğer işler</SectionLabel>
              <span className="h-px flex-1 bg-white/10" />
              <SectionCount count={works.length} />
            </div>

            <div className="space-y-5">
              {works.map((work) => (
                <WorkCard key={work.slug} work={work} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Yazılar */}
        {notes.length ? <NotesSection notes={notes} /> : null}

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-white/40 md:mt-28">
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}
