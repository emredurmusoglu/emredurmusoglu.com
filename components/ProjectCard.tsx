"use client";

import Image from "next/image";
import { useState } from "react";

const DEFAULT_ACCENT = "from-sky-400/70 via-indigo-400/50 to-fuchsia-400/70";

export type PublicProject = {
  slug: string;
  title: string;
  description: string | null;
  accent: string | null;
  iconUrl: string | null;
  url: string | null;
  iosUrl: string | null;
  androidUrl: string | null;
  comingSoon: boolean;
};

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 3 2.3 1.2 0 1.6-.7 3.1-.7s1.9.7 3.1.7 2.1-1.1 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.6s-2.4-1-2.4-3.8ZM14.2 5.9c.6-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.5Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.6 2.3ZM16.1 15.6l-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.8 2ZM15.9 15.8 12.9 12.7 3.6 22c.3.4.9.4 1.5.1l10.8-6.3M15.9 8.2 5.1 2C4.5 1.6 3.9 1.7 3.6 2l9.3 9.3 3-3.1Z" />
    </svg>
  );
}

function PlatformChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/50">
      {label}
    </span>
  );
}

function StoreButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/20"
    >
      {icon}
      {label}
    </a>
  );
}

export function ProjectCard({ project }: { project: PublicProject }) {
  const [picking, setPicking] = useState(false);

  // next/image sadece yerel dosyalarda kullanılıyor; uzak bir URL girilirse
  // next.config'de domain tanımı gerekmesin diye kart ikonsuz gösterilir.
  const icon = project.iconUrl?.startsWith("/") ? project.iconUrl : null;

  const hasBothStores = Boolean(project.iosUrl && project.androidUrl);
  const singleHref = project.iosUrl ?? project.androidUrl ?? project.url ?? null;

  const platforms = [
    project.iosUrl ? "iOS" : null,
    project.androidUrl ? "Android" : null,
    project.url && !project.iosUrl && !project.androidUrl ? "Web" : null,
  ].filter(Boolean) as string[];

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon ? (
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image src={icon} alt="" fill sizes="40px" className="object-cover" />
            </span>
          ) : null}
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        </div>

        {project.comingSoon ? (
          <span className="shrink-0 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200/90">
            Yakında
          </span>
        ) : null}
      </div>

      {project.description ? (
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {project.description}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        {platforms.length ? (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <PlatformChip key={p} label={p} />
            ))}
          </div>
        ) : null}

        {/* Her iki mağazada da varsa önce hangisi diye soruyoruz */}
        {hasBothStores && picking ? (
          <div className="flex gap-2">
            <StoreButton href={project.iosUrl!} icon={<AppleIcon />} label="App Store" />
            <StoreButton
              href={project.androidUrl!}
              icon={<PlayIcon />}
              label="Google Play"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div
              className={`h-px bg-gradient-to-r transition-all duration-300 ${
                project.accent ?? DEFAULT_ACCENT
              } ${project.comingSoon ? "w-16" : "w-0 group-hover:w-20"}`}
            />
            {project.comingSoon ? (
              <span className="text-sm text-white/30">Hazırlanıyor</span>
            ) : (
              <span className="text-sm text-white/50 transition group-hover:text-white/85">
                Uygulamaya Git →
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const shell =
    "group flex min-h-[200px] w-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur transition";
  const interactive =
    "hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]";

  if (project.comingSoon || !singleHref) {
    return <div className={shell}>{inner}</div>;
  }

  if (hasBothStores) {
    // Karta basınca mağaza seçimi açılıyor. Tıklama alanını kartı saran bir
    // <button> yerine üstteki saydam katmanla veriyoruz — aksi halde mağaza
    // bağlantıları <button> içinde kalırdı ki bu geçersiz HTML.
    return (
      <div className={`${shell} ${interactive} relative`}>
        {inner}
        {!picking ? (
          <button
            type="button"
            onClick={() => setPicking(true)}
            aria-label={`${project.title} — mağaza seç`}
            className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          />
        ) : null}
      </div>
    );
  }

  return (
    <a
      href={singleHref}
      target="_blank"
      rel="noreferrer"
      className={`${shell} ${interactive}`}
    >
      {inner}
    </a>
  );
}
