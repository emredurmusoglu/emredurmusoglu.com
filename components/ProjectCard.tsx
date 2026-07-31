import Image from "next/image";

const DEFAULT_ACCENT = "from-sky-400/70 via-indigo-400/50 to-fuchsia-400/70";

export type PublicProject = {
  slug: string;
  title: string;
  description: string | null;
  accent: string | null;
  iconUrl: string | null;
  url: string | null;
};

export function ProjectCard({ project }: { project: PublicProject }) {
  // next/image sadece yerel dosyalarda kullanılıyor; uzak bir URL girilirse
  // next.config'de domain tanımı gerekmesin diye kart ikonsuz gösterilir.
  const icon = project.iconUrl?.startsWith("/") ? project.iconUrl : null;

  const card = (
    <div className="flex min-h-[168px] flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-white/20 hover:bg-white/8 hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)] md:min-h-[190px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          {icon ? (
            <Image
              src={icon}
              alt=""
              width={22}
              height={22}
              className="rounded-md opacity-90"
            />
          ) : null}
        </div>
        {project.url ? (
          <span className="text-sm text-white/45 transition group-hover:text-white/70">
            → Uygulamaya Git
          </span>
        ) : null}
      </div>

      {project.description ? (
        <p className="mt-4 leading-relaxed text-white/70">
          {project.description}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <div
          className={`h-px w-0 bg-gradient-to-r transition-all duration-300 group-hover:w-24 ${
            project.accent ?? DEFAULT_ACCENT
          }`}
        />
      </div>
    </div>
  );

  if (!project.url) {
    return <div className="group block">{card}</div>;
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      {card}
    </a>
  );
}
