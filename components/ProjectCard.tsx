"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AppleIcon, PlayIcon } from "@/components/StoreIcons";

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
  androidSoon: boolean;
  comingSoon: boolean;
};

function PlatformChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/50">
      {label}
    </span>
  );
}

const STORE_BUTTON =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition";

function StoreButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${STORE_BUTTON} border-white/15 bg-white/10 text-white/90 hover:border-white/30 hover:bg-white/20`}
    >
      {icon}
      {label}
    </a>
  );
}

/** Android sürümü henüz yokken: mağazaya değil, uyarıya götüren düğme. */
function SoonButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${STORE_BUTTON} border-white/10 bg-white/[0.04] text-white/45 hover:border-amber-300/30 hover:bg-amber-300/10 hover:text-amber-100/90`}
    >
      {icon}
      {label}
    </button>
  );
}

export function ProjectCard({
  project,
  detailHref,
}: {
  project: PublicProject;
  /** Ürünün detay sayfası varsa kart oraya gider, mağaza bağlantısı yanında kalır. */
  detailHref?: string;
}) {
  const [picking, setPicking] = useState(false);
  const [androidNotice, setAndroidNotice] = useState(false);

  // next/image sadece yerel dosyalarda kullanılıyor; uzak bir URL girilirse
  // next.config'de domain tanımı gerekmesin diye kart ikonsuz gösterilir.
  const icon = project.iconUrl?.startsWith("/") ? project.iconUrl : null;

  // Android tarafı ya gerçekten yayında ya da "yakında" — ikisinde de kart
  // tıklanınca önce platform seçimi açılıyor.
  const androidSoon = Boolean(project.androidSoon && !project.androidUrl);
  const hasBothStores = Boolean(project.iosUrl && (project.androidUrl || androidSoon));
  const singleHref = project.iosUrl ?? project.androidUrl ?? project.url ?? null;

  const platforms = [
    project.iosUrl ? "iOS" : null,
    project.androidUrl ? "Android" : androidSoon ? "Android — yakında" : null,
    project.url && !project.iosUrl && !project.androidUrl ? "Web" : null,
  ].filter(Boolean) as string[];

  // Detay sayfası olan kartlarda mağazaya giden ikincil bağlantı. Kartın
  // tamamını kaplayan detay bağlantısının üstünde durması için z-10.
  const storeLink =
    "relative z-10 text-sm text-white/40 transition hover:text-white/85";
  const storeAction = hasBothStores ? (
    <button type="button" onClick={() => setPicking(true)} className={storeLink}>
      Uygulamaya Git ↗
    </button>
  ) : singleHref ? (
    <a href={singleHref} target="_blank" rel="noreferrer" className={storeLink}>
      {project.iosUrl || project.androidUrl ? "Uygulamaya Git ↗" : "Siteye Git ↗"}
    </a>
  ) : null;

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
          <div className="relative z-10">
            <div className="flex gap-2">
              <StoreButton href={project.iosUrl!} icon={<AppleIcon />} label="App Store" />
              {project.androidUrl ? (
                <StoreButton
                  href={project.androidUrl}
                  icon={<PlayIcon />}
                  label="Google Play"
                />
              ) : (
                <SoonButton
                  icon={<PlayIcon />}
                  label="Google Play"
                  onClick={() => setAndroidNotice(true)}
                />
              )}
            </div>

            {androidNotice ? (
              <p
                role="status"
                className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs leading-relaxed text-amber-100/85"
              >
                Android sürümü henüz yayında değil, yakında Google
                Play&apos;de. Şimdilik iOS&apos;tan indirebilirsin.
              </p>
            ) : null}
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
            ) : detailHref ? (
              <div className="flex items-center gap-4">
                {storeAction}
                <span className="text-sm font-medium text-white/70 transition group-hover:text-white">
                  İncele →
                </span>
              </div>
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

  if (detailHref) {
    return (
      <div className={`${shell} ${interactive} relative`}>
        {inner}
        <Link
          href={detailHref}
          aria-label={`${project.title} — incele`}
          className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
        />
      </div>
    );
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
