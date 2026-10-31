"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  Minus,
  Pause,
  Play,
  Plus,
  Restart,
  SentenceBack,
  SentenceForward,
  StepBack,
  StepForward,
} from "@/components/oku/icons";
import { SettingsSheet } from "@/components/oku/SettingsSheet";
import {
  type Doc,
  type FontSize,
  saveProgress,
  type Settings,
  updateSettings,
  WPM_MAX,
  WPM_MIN,
  WPM_STEP,
} from "@/lib/oku/store";
import { formatDuration, tokenize } from "@/lib/oku/text";

const FONT: Record<FontSize, string> = {
  s: "clamp(2rem, 8vw, 3.25rem)",
  m: "clamp(2.5rem, 10.5vw, 4.25rem)",
  l: "clamp(3rem, 13vw, 5.5rem)",
};

/**
 * Kırmızı harfin yatayda durduğu yer. "Odak noktası" modunda kelimenin
 * çoğu harfin sağında kaldığı için odak biraz solda (Spritz'teki gibi);
 * böylece uzun kelimeler küçülmeden sığıyor. "Tam orta"da ekranın ortası.
 */
const FOCAL = { optimal: 0.36, center: 0.5 } as const;

/** Başlarken / devam ederken ilk birkaç kelime yavaş: göz odağa otursun. */
const RAMP_WORDS = 5;
/** Duraklatınca altta görünen bağlam: imlecin iki yanında bu kadar kelime. */
const CONTEXT_RADIUS = 160;
/** Okurken ilerleme her bu kadar kelimede bir kaydediliyor. */
const SAVE_EVERY = 20;

const numberFormat = new Intl.NumberFormat("tr-TR");

export function Reader({
  doc,
  settings,
  initialIndex,
  onClose,
}: {
  doc: Doc;
  settings: Settings;
  initialIndex: number;
  onClose: () => void;
}) {
  const { focus, punctuationPause } = settings;
  const { tokens, suffix } = useMemo(
    () => tokenize(doc.text, { focus, punctuationPause }),
    [doc.text, focus, punctuationPause],
  );
  const total = tokens.length;
  const last = Math.max(0, total - 1);
  const focal = FOCAL[focus];

  // Bitmiş bir metni yeniden açınca baştan başlasın.
  const [index, setIndex] = useState(() =>
    initialIndex >= last ? 0 : Math.max(0, initialIndex),
  );
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [started, setStarted] = useState(false);

  // Okurken kelime React'e uğramadan doğrudan DOM'a yazılıyor; saniyede
  // 15 kelimede bile yeniden render yok. `index` state'i duraklayınca eşitleniyor.
  const indexRef = useRef(index);
  const wpmRef = useRef(settings.wpm);
  const rowRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const pivotRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const remainingRef = useRef<HTMLSpanElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wpmRef.current = settings.wpm;
  }, [settings.wpm]);

  const paint = useCallback(
    (i: number) => {
      const token = tokens[i];
      const row = rowRef.current;
      const left = leftRef.current;
      const pivot = pivotRef.current;
      const right = rightRef.current;
      if (!token || !row || !left || !pivot || !right) return;

      left.textContent = token.text.slice(0, token.pivot);
      pivot.textContent = token.text[token.pivot] ?? "";
      right.textContent = token.text.slice(token.pivot + 1);

      // Kırmızı harfin ortası piksel piksel odak çizgisine oturtuluyor;
      // kelime yine de taşacaksa odak noktasının etrafında küçültülüyor.
      const width = row.clientWidth;
      const half = pivot.offsetWidth / 2;
      const center = pivot.offsetLeft + half;
      const target = width * focal;
      // Parantez görünüyorsa kelime onlara değmesin.
      const gap = token.aside
        ? ((asideRef.current?.firstElementChild as HTMLElement | null)
            ?.offsetWidth ?? 0) + 8
        : 4;
      const scale = Math.min(
        1,
        (target - half - gap) / (left.offsetWidth || 1),
        (width - target - half - gap) / (right.offsetWidth || 1),
      );
      row.style.transformOrigin = `${center}px 50%`;
      row.style.transform = `translateX(${target - center}px)${scale < 1 ? ` scale(${scale})` : ""}`;
      if (asideRef.current) {
        asideRef.current.style.opacity = token.aside ? "1" : "0";
      }

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${(i + 1) / total})`;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `%${Math.round(((i + 1) / total) * 100)}`;
      }
      if (remainingRef.current) {
        remainingRef.current.textContent = `${formatDuration(
          (suffix[i] * 60000) / wpmRef.current,
        )} kaldı`;
      }
    },
    [tokens, suffix, total, focal],
  );

  // Duraklamışken ekran state'ten çiziliyor (ayar değişince de).
  useLayoutEffect(() => {
    if (!playing) paint(index);
  }, [playing, index, paint, settings.wpm, settings.fontSize]);

  useEffect(() => {
    const onResize = () => paint(indexRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  // Okuma döngüsü. setTimeout + mutlak zaman: gecikmeler birikmiyor,
  // hız ortalamada tam ayarlanan değerde kalıyor.
  useEffect(() => {
    if (!playing) return;
    let timer = 0;
    let nextAt = performance.now();
    let warmup = 0;

    const schedule = () => {
      const now = performance.now();
      // Arka plandan dönünce kaçırılan kelimeleri art arda patlatma.
      if (nextAt < now - 250) nextAt = now;
      const ramp = warmup < RAMP_WORDS ? 1 + (RAMP_WORDS - warmup) * 0.15 : 1;
      const token = tokens[indexRef.current];
      nextAt +=
        Math.max(token.weight * (60000 / wpmRef.current), token.minMs) * ramp;
      timer = window.setTimeout(advance, nextAt - performance.now());
    };

    const advance = () => {
      const next = indexRef.current + 1;
      if (next >= tokens.length) {
        indexRef.current = tokens.length - 1;
        setPlaying(false);
        setFinished(true);
        setIndex(tokens.length - 1);
        saveProgress(doc.id, tokens.length - 1, tokens.length);
        return;
      }
      indexRef.current = next;
      warmup++;
      paint(next);
      if (next % SAVE_EVERY === 0) saveProgress(doc.id, next, tokens.length);
      schedule();
    };

    paint(indexRef.current);
    schedule();
    return () => window.clearTimeout(timer);
  }, [playing, tokens, paint, doc.id]);

  const play = useCallback(() => {
    if (!total) return;
    if (finished || indexRef.current >= last) {
      indexRef.current = 0;
      setIndex(0);
    }
    setFinished(false);
    setStarted(true);
    setPlaying(true);
  }, [total, finished, last]);

  const pause = useCallback(() => {
    setPlaying(false);
    setIndex(indexRef.current);
    saveProgress(doc.id, indexRef.current, total);
  }, [doc.id, total]);

  const seek = useCallback(
    (target: number) => {
      const i = Math.min(last, Math.max(0, target));
      indexRef.current = i;
      setFinished(false);
      setIndex(i);
      // Okurken atlanırsa döngü yeni yerden devam ediyor.
      if (playing) paint(i);
    },
    [last, playing, paint],
  );

  const sentenceBack = useCallback(() => {
    let i = indexRef.current;
    let start = i;
    while (start > 0 && !tokens[start].sentenceStart) start--;
    // Zaten cümle başındaysan bir öncekine geç.
    if (i - start < 2 && start > 0) {
      i = start - 1;
      start = i;
      while (start > 0 && !tokens[start].sentenceStart) start--;
    }
    seek(start);
  }, [tokens, seek]);

  const sentenceForward = useCallback(() => {
    let i = indexRef.current + 1;
    while (i < tokens.length && !tokens[i].sentenceStart) i++;
    seek(i);
  }, [tokens, seek]);

  const changeWpm = useCallback(
    (delta: number) => {
      updateSettings({
        wpm: Math.min(WPM_MAX, Math.max(WPM_MIN, settings.wpm + delta)),
      });
    },
    [settings.wpm],
  );

  const close = useCallback(() => {
    saveProgress(doc.id, indexRef.current, total);
    onClose();
  }, [doc.id, total, onClose]);

  // Klavye: masaüstünde ve klavyeli iPad'de.
  useEffect(() => {
    if (sheetOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          if (playing) pause();
          else play();
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (event.shiftKey) sentenceBack();
          else seek(indexRef.current - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (event.shiftKey) sentenceForward();
          else seek(indexRef.current + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          changeWpm(WPM_STEP);
          break;
        case "ArrowDown":
          event.preventDefault();
          changeWpm(-WPM_STEP);
          break;
        case "Escape":
          if (playing) pause();
          else close();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    sheetOpen,
    playing,
    play,
    pause,
    seek,
    sentenceBack,
    sentenceForward,
    changeWpm,
    close,
  ]);

  // Uygulamadan çıkınca (bildirim, ana ekran) dur ve yeri kaydet.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && playing) pause();
      saveProgress(doc.id, indexRef.current, total);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [playing, pause, doc.id, total]);

  // Okurken ekran kararmasın.
  useEffect(() => {
    if (!playing || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    navigator.wakeLock
      .request("screen")
      .then((sentinel) => {
        if (cancelled) sentinel.release().catch(() => {});
        else lock = sentinel;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      lock?.release().catch(() => {});
    };
  }, [playing]);

  // Duraklayınca bağlamdaki kelime görünür alanın ortasına gelsin.
  useLayoutEffect(() => {
    if (playing) return;
    const container = contextRef.current;
    const current = container?.querySelector<HTMLElement>("[data-current]");
    if (!container || !current) return;
    container.scrollTop =
      current.offsetTop - container.clientHeight / 2 + current.offsetHeight / 2;
  }, [playing, index]);

  const context = useMemo(() => {
    if (playing) return null;
    const start = Math.max(0, index - CONTEXT_RADIUS);
    const end = Math.min(total, index + CONTEXT_RADIUS);
    const paragraphs: { from: number; words: number[] }[] = [];
    for (let i = start; i < end; i++) {
      if (i === start || tokens[i].paraStart)
        paragraphs.push({ from: i, words: [] });
      paragraphs[paragraphs.length - 1].words.push(i);
    }
    return paragraphs;
  }, [playing, index, total, tokens]);

  function seekFromPointer(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    seek(Math.round(ratio * last));
  }

  const chrome = `transition-opacity duration-300 ${
    playing ? "pointer-events-none opacity-0" : "opacity-100"
  }`;

  return (
    <div className="oku-fade-in fixed inset-0 flex flex-col bg-oku-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] select-none">
      {/* Üst çubuk */}
      <header
        className={`flex h-14 shrink-0 items-center gap-2 px-2 ${chrome}`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Kütüphaneye dön"
          className="flex h-11 w-11 items-center justify-center rounded-full text-oku-muted transition active:bg-oku-raised active:text-oku-text"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-medium text-oku-muted">
          {doc.title}
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Ayarlar"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold text-oku-muted transition active:bg-oku-raised active:text-oku-text"
        >
          Aa
        </button>
      </header>

      {/* Sahne: kelime + odak kılavuzları */}
      <div
        className="relative flex shrink-0 basis-[34%] items-center px-5"
        style={{ fontSize: FONT[settings.fontSize] }}
        onClick={() => (playing ? pause() : play())}
      >
        <div className="relative flex h-[2.5em] w-full items-center">
          <div className="absolute inset-x-[4%] top-0 h-px bg-oku-line" />
          <div
            className="absolute top-0 h-[0.3em] w-px -translate-x-1/2 bg-oku-faint"
            style={{ left: `${focal * 100}%` }}
          />
          <div className="absolute inset-x-[4%] bottom-0 h-px bg-oku-line" />
          <div
            className="absolute bottom-0 h-[0.3em] w-px -translate-x-1/2 bg-oku-faint"
            style={{ left: `${focal * 100}%` }}
          />

          {/* Parantez içindeki söz okunurken kenarlarda parantez duruyor */}
          <div
            ref={asideRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 inset-y-[0.2em] flex items-center justify-between font-light text-oku-faint opacity-0 transition-opacity duration-150"
          >
            <span>(</span>
            <span>)</span>
          </div>

          <div
            ref={rowRef}
            className="relative grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-baseline leading-none font-medium tracking-[-0.01em] whitespace-pre text-oku-text"
          >
            <div className="flex justify-end">
              <span ref={leftRef} />
            </div>
            <span ref={pivotRef} className="text-oku-red" />
            <div className="flex justify-start">
              <span ref={rightRef} />
            </div>
          </div>
        </div>

        {!started && !finished && (
          <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-sm text-oku-faint">
            Başlamak için dokun
          </p>
        )}
      </div>

      {/* Bağlam: duraklayınca metnin kendisi, dokunduğun kelimeye atlar */}
      <div className={`relative min-h-0 flex-1 ${chrome}`}>
        {finished ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
            <div>
              <p className="text-xl font-semibold tracking-tight">Bitti</p>
              <p className="mt-1 text-sm text-oku-muted">
                {numberFormat.format(total)} kelime okudun
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={play}
                className="flex items-center gap-2 rounded-full bg-oku-raised px-5 py-2.5 text-sm font-medium transition active:scale-95"
              >
                <Restart className="h-4 w-4" /> Baştan oku
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-oku-text px-5 py-2.5 text-sm font-semibold text-oku-bg transition active:scale-95"
              >
                Kütüphane
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={contextRef}
            className="oku-context-mask h-full overflow-y-auto px-6 py-8 text-[17px] leading-[1.7] text-oku-faint"
            onClick={(event) => {
              const target = (event.target as HTMLElement).closest<HTMLElement>(
                "[data-i]",
              );
              if (target) seek(Number(target.dataset.i));
            }}
          >
            <div className="mx-auto max-w-xl">
              {context?.map((paragraph) => (
                <p key={paragraph.from} className="mb-4">
                  {paragraph.words.map((i) => (
                    <span key={i}>
                      <span
                        data-i={i}
                        data-current={i === index ? "" : undefined}
                        className={
                          i === index
                            ? "rounded bg-oku-red/15 px-0.5 text-oku-red"
                            : i < index
                              ? "cursor-pointer text-oku-muted/70"
                              : "cursor-pointer text-oku-muted"
                        }
                      >
                        {tokens[i].source}
                      </span>
                      {tokens[i].joinNext ? "" : " "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alt: ilerleme, kontroller, hız */}
      <footer className="shrink-0 px-5 pt-2 pb-3">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Metindeki yer"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          className={`group relative -mx-1 cursor-pointer touch-none py-3 transition-opacity duration-300 ${
            playing ? "opacity-40" : ""
          }`}
          onPointerDown={(event) => {
            if (playing) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            seekFromPointer(event.clientX);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              seekFromPointer(event.clientX);
            }
          }}
        >
          <div className="mx-1 h-1 overflow-hidden rounded-full bg-oku-line">
            <div
              ref={fillRef}
              className="h-full origin-left rounded-full bg-oku-red"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>

        <div
          className={`mb-3 flex justify-between text-xs tabular-nums text-oku-faint ${chrome}`}
        >
          <span ref={percentRef} />
          <span ref={remainingRef} />
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          <ControlButton
            label="Önceki cümle"
            onClick={sentenceBack}
            hidden={playing}
          >
            <SentenceBack />
          </ControlButton>
          <ControlButton
            label="Önceki kelime"
            onClick={() => seek(indexRef.current - 1)}
            hidden={playing}
          >
            <StepBack />
          </ControlButton>
          <button
            type="button"
            onClick={playing ? pause : play}
            aria-label={playing ? "Duraklat" : "Oku"}
            className={`mx-2 flex h-16 w-16 items-center justify-center rounded-full bg-oku-text text-oku-bg shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-[transform,opacity] duration-300 active:scale-95 ${
              playing ? "opacity-0" : ""
            }`}
          >
            {playing ? <Pause /> : <Play className="ml-0.5 h-7 w-7" />}
          </button>
          <ControlButton
            label="Sonraki kelime"
            onClick={() => seek(indexRef.current + 1)}
            hidden={playing}
          >
            <StepForward />
          </ControlButton>
          <ControlButton
            label="Sonraki cümle"
            onClick={sentenceForward}
            hidden={playing}
          >
            <SentenceForward />
          </ControlButton>
        </div>

        <div
          className={`mt-3 flex items-center justify-center gap-2 ${chrome}`}
        >
          <button
            type="button"
            onClick={() => changeWpm(-WPM_STEP)}
            aria-label="Yavaşlat"
            disabled={settings.wpm <= WPM_MIN}
            className="flex h-10 w-10 items-center justify-center rounded-full text-oku-muted transition active:bg-oku-raised disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-w-32 rounded-full px-3 py-1.5 text-center text-sm tabular-nums transition active:bg-oku-raised"
          >
            <span className="font-semibold text-oku-text">{settings.wpm}</span>{" "}
            <span className="text-oku-muted">kelime/dk</span>
          </button>
          <button
            type="button"
            onClick={() => changeWpm(WPM_STEP)}
            aria-label="Hızlandır"
            disabled={settings.wpm >= WPM_MAX}
            className="flex h-10 w-10 items-center justify-center rounded-full text-oku-muted transition active:bg-oku-raised disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p
          className={`oku-hint-fine mt-2 text-center text-[11px] text-oku-faint ${chrome}`}
        >
          Boşluk: oku/durdur · ← → kelime · ⇧ ← → cümle · ↑ ↓ hız
        </p>
      </footer>

      {/* Okurken ekranın her yeri "durdur" düğmesi */}
      {playing && (
        <button
          type="button"
          aria-label="Duraklat"
          onClick={pause}
          className="absolute inset-0 z-10 cursor-none"
        />
      )}

      {sheetOpen && (
        <SettingsSheet
          settings={settings}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  hidden,
  children,
}: {
  label: string;
  onClick: () => void;
  hidden: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full text-oku-muted transition-[opacity,background-color,color] duration-300 active:bg-oku-raised active:text-oku-text ${
        hidden ? "pointer-events-none opacity-0" : ""
      }`}
    >
      {children}
    </button>
  );
}
