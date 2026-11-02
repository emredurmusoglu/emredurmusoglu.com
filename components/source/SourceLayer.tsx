"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** scripts/source-snippets.ts'in lib/source/<id>.json'a yazdığı biçim. */
export type Snippet = {
  file: string;
  /** Her satırın dosyadaki gerçek numarası (yorumlar atıldığı için atlamalı) */
  numbers: number[];
  /** Satırlar → [metin, renk sınıfı] parçaları */
  lines: string[][][];
  focus: Record<string, number>;
};

/** Tıklanan satırın parlamasına zaman tanımak için iç bağlantılar bu kadar bekler. */
const RUN_DELAY = 320;

/** Dokunmatik ekranda dokunulan yerde fenerin açık kaldığı süre. */
const TAP_LIGHT = 800;

/** Telefonda kaydırma bittikten sonra sayfa kodunun parlak kaldığı süre. */
const SCROLL_GLOW = 400;

/**
 * Üst öğenin arkasına, o öğeyi çizen gerçek kodu soluk biçimde serer.
 * Fare üstündeyken imlecin çevresi el feneri gibi aydınlanır; tıklanınca
 * o anda çalışan satır parlar. Kod build sırasında scripts/source-snippets.ts
 * ile dosyalardan okunur.
 *
 * "page" türü bütün sayfanın arkasına, sayfanın kendi kodunu serer: çok
 * soluktur, tıklamaya karışmaz; fener fareyle ya da dokunarak açılır.
 */
export function SourceLayer({
  snippet,
  focus = "default",
  variant = "card",
  repeat = 1,
}: {
  snippet: Snippet;
  focus?: string;
  variant?: "card" | "halo" | "bare" | "page";
  /** Kod, öğe kodundan uzunsa boşluk kalmasın diye bu kadar kez alt alta yazılır. */
  repeat?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const focusLine = snippet.focus[focus] ?? 0;
  const isPage = variant === "page";

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(hover: none)").matches;
    let runTimer: number | undefined;
    let tapTimer: number | undefined;
    let glowTimer: number | undefined;

    const aim = (e: MouseEvent) => {
      const r = layer.getBoundingClientRect();
      layer.style.setProperty("--src-x", `${e.clientX - r.left}px`);
      layer.style.setProperty("--src-y", `${e.clientY - r.top}px`);
    };
    // Fener pointerenter'a güvenmeden her harekette de yanıyor: sayfa
    // geçişinde imleç zaten içerideyken bazı tarayıcılar (Safari) enter
    // olayını hiç göndermiyor, fener de hiç açılmıyordu.
    const track = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim(e);
      layer.dataset.hover = "";
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim(e);
      layer.dataset.hover = "";
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") delete layer.dataset.hover;
    };
    // Dokunmatikte hover yok: dokunulan yerde fener kısa bir süre yanıyor.
    // pointerdown değil click: kaydırmaya başlamak feneri yakmasın.
    const tap = (e: MouseEvent) => {
      if (!touch) return;
      aim(e);
      layer.dataset.hover = "";
      clearTimeout(tapTimer);
      tapTimer = window.setTimeout(() => delete layer.dataset.hover, TAP_LIGHT);
    };

    // Yakalama aşamasında dinliyoruz ki Next'in <Link>'inden önce çalışsın;
    // preventDefault görünce Link kendi gezinmesini yapmıyor.
    const click = (e: MouseEvent) => {
      delete layer.dataset.run;
      void layer.offsetWidth; // animasyonu baştan başlat
      layer.dataset.run = "";
      clearTimeout(runTimer);
      runTimer = window.setTimeout(() => delete layer.dataset.run, 800);

      const link = (e.target as Element).closest("a");
      if (
        !link ||
        reduceMotion ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        link.target ||
        link.hasAttribute("download")
      ) {
        return;
      }
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), RUN_DELAY);
    };

    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", track);
    host.addEventListener("pointerleave", leave);
    if (isPage) host.addEventListener("click", tap);
    else host.addEventListener("click", click, true);

    // Telefonda fener ancak dokununca yanıyor; kaydırırken de sayfanın
    // arkasında kod olduğu belli olsun diye kod kaydırma boyunca hafifçe
    // belirginleşip durduktan kısa süre sonra sönüyor.
    const scrolled = () => {
      layer.dataset.glow = "";
      clearTimeout(glowTimer);
      glowTimer = window.setTimeout(() => delete layer.dataset.glow, SCROLL_GLOW);
    };
    const glowOnScroll = isPage && touch && !reduceMotion;
    if (glowOnScroll) window.addEventListener("scroll", scrolled, { passive: true });

    // Dokunmatik ekranda kartlar ekrana ilk girdiğinde kod bir kez belirip
    // sönüyor; sayfa katmanında buna gerek yok.
    let observer: IntersectionObserver | undefined;
    if (!isPage && !reduceMotion && touch) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          layer.dataset.peek = "";
          observer?.disconnect();
        },
        { threshold: 0.6 },
      );
      observer.observe(host);
    }

    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", track);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("click", tap);
      host.removeEventListener("click", click, true);
      window.removeEventListener("scroll", scrolled);
      observer?.disconnect();
      clearTimeout(runTimer);
      clearTimeout(tapTimer);
      clearTimeout(glowTimer);
    };
  }, [router, isPage]);

  const code = (
    <pre className="src-code">
      {Array.from({ length: repeat }, (_, r) => (
        <span key={r}>
          {isPage ? (
            <span className="src-line">
              <span className="src-ln" />
              <span className="src-c">{`// ${snippet.file}`}</span>
            </span>
          ) : null}
          {snippet.lines.map((line, i) => (
            <span
              key={i}
              className="src-line"
              data-focus={!isPage && i === focusLine ? "" : undefined}
            >
              <span className="src-ln">{snippet.numbers[i]}</span>
              {line.map(([text, cls], j) =>
                cls ? (
                  <span key={j} className={`src-${cls}`}>
                    {text}
                  </span>
                ) : (
                  text
                ),
              )}
            </span>
          ))}
        </span>
      ))}
    </pre>
  );

  // İki kopya: her zaman duran soluk hali ve fenerin altında parlayan hali.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="src-layer"
      data-variant={variant}
      style={{ "--src-focus": focusLine } as React.CSSProperties}
    >
      <div className="src-ambient">{code}</div>
      <div className="src-spot">{code}</div>
    </div>
  );
}
