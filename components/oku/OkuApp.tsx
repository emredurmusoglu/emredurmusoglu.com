"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ChevronLeft,
  Clipboard,
  Pen,
  Play,
  Sliders,
  Trash,
} from "@/components/oku/icons";
import { Reader } from "@/components/oku/Reader";
import { SettingsSheet } from "@/components/oku/SettingsSheet";
import { goBack, navigate, useRoute } from "@/lib/oku/route";
import {
  addDoc,
  type Doc,
  type Progress,
  removeDoc,
  type Settings,
  touchDoc,
  useLibrary,
  useProgress,
  useSettings,
} from "@/lib/oku/store";
import { SAMPLE_TEXT, SAMPLE_TITLE } from "@/lib/oku/sample";
import {
  countWords,
  deriveTitle,
  formatDuration,
  pivotIndex,
} from "@/lib/oku/text";

const numberFormat = new Intl.NumberFormat("tr-TR");

/** Molalar ortalamaya dağıtıldığı için süre doğrudan kelime / hız. */
function estimate(words: number, wpm: number) {
  return formatDuration((words / wpm) * 60000);
}

export function OkuApp() {
  const route = useRoute();
  const docs = useLibrary();
  const progress = useProgress();
  const settings = useSettings();
  const [notice, setNotice] = useState<string | null>(null);

  // Yayında, bir kez açıldıktan sonra uçak modunda da açılsın.
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker
      .register("/oku-sw.js", { scope: "/oku" })
      .catch(() => {});
  }, []);

  const open = useCallback((doc: Doc, replace = false) => {
    touchDoc(doc.id);
    navigate({ read: doc.id }, replace);
  }, []);

  const create = useCallback(
    (text: string, title?: string, replace = false) => {
      const clean = text.trim();
      const doc = addDoc({
        text: clean,
        title: title?.trim() || deriveTitle(clean),
        words: countWords(clean),
      });
      open(doc, replace);
    },
    [open],
  );

  const pasteAndRead = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (countWords(text) < 2) {
        setNotice("Panoda okunacak bir metin yok. Önce bir metin kopyala.");
        return;
      }
      create(text);
    } catch {
      // İzin verilmedi ya da tarayıcı desteklemiyor: elle yapıştırma ekranı.
      navigate("new");
    }
  }, [create]);

  if (route.name === "read") {
    const doc = docs.find((item) => item.id === route.id);
    if (doc) {
      return (
        <Reader
          key={doc.id}
          doc={doc}
          settings={settings}
          initialIndex={progress[doc.id]?.i ?? 0}
          onClose={goBack}
        />
      );
    }
  }

  if (route.name === "new") {
    return (
      <Editor
        settings={settings}
        onCreate={(text, title) => create(text, title, true)}
      />
    );
  }

  return (
    <Library
      docs={docs}
      progress={progress}
      settings={settings}
      notice={notice}
      onDismissNotice={() => setNotice(null)}
      onPaste={pasteAndRead}
      onOpen={open}
      onSample={() => create(SAMPLE_TEXT, SAMPLE_TITLE)}
    />
  );
}

function Logo() {
  return (
    <span className="text-[22px] font-semibold tracking-tight" aria-label="Oku">
      o<span className="text-oku-red">k</span>u
    </span>
  );
}

function Library({
  docs,
  progress,
  settings,
  notice,
  onDismissNotice,
  onPaste,
  onOpen,
  onSample,
}: {
  docs: Doc[];
  progress: Record<string, Progress>;
  settings: Settings;
  notice: string | null;
  onDismissNotice: () => void;
  onPaste: () => void;
  onOpen: (doc: Doc) => void;
  onSample: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sorted = [...docs].sort((a, b) => b.openedAt - a.openedAt);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(onDismissNotice, 3500);
    return () => clearTimeout(timer);
  }, [notice, onDismissNotice]);

  return (
    <div className="oku-fade-in mx-auto min-h-dvh max-w-xl px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
      <header className="flex h-12 items-center justify-between">
        <Logo />
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Ayarlar"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-oku-muted transition active:bg-oku-raised active:text-oku-text"
        >
          <Sliders />
        </button>
      </header>

      {sorted.length === 0 ? (
        <section className="pt-[12vh] pb-10">
          <WordDemo />
          <h1 className="mt-12 text-[28px] leading-tight font-semibold tracking-tight">
            Gözün yerinde dursun,
            <br />
            <span className="text-oku-muted">kelimeler gelsin.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-oku-muted">
            Metni yapıştır; kelimeler tek tek ekranın ortasında akar, her
            birinin odak harfi kırmızı. Göz satırda gezinmediği için daha hızlı
            ve daha dikkatli okursun.
          </p>
        </section>
      ) : (
        <div className="h-6" />
      )}

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <button
          type="button"
          onClick={onPaste}
          className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-oku-text text-[16px] font-semibold text-oku-bg transition active:scale-[0.98]"
        >
          <Clipboard className="h-5 w-5" />
          Panodan yapıştır ve oku
        </button>
        <button
          type="button"
          onClick={() => navigate("new")}
          aria-label="Metni elle gir"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-oku-raised text-oku-text transition active:scale-95"
        >
          <Pen />
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="oku-fade-in mt-3 rounded-xl bg-oku-red/10 px-4 py-3 text-sm text-oku-red"
        >
          {notice}
        </p>
      )}

      {sorted.length === 0 ? (
        <button
          type="button"
          onClick={onSample}
          className="mt-4 w-full rounded-2xl py-3 text-sm text-oku-muted transition active:text-oku-text"
        >
          Önce örnek bir metinle dene →
        </button>
      ) : (
        <section className="mt-9">
          <h2 className="mb-3 text-xs font-medium tracking-[0.12em] text-oku-faint uppercase">
            Metinlerin
          </h2>
          <ul className="space-y-2.5">
            {sorted.map((doc) => (
              <DocRow
                key={doc.id}
                doc={doc}
                progress={progress[doc.id]}
                wpm={settings.wpm}
                onOpen={() => onOpen(doc)}
              />
            ))}
          </ul>
          <p className="mt-6 text-center text-xs leading-relaxed text-oku-faint">
            Metinler yalnızca bu cihazda saklanır.
          </p>
        </section>
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

const DEMO_WORDS = ["Gözün", "yerinde", "dursun,", "kelimeler", "gelsin."].map(
  (word) => {
    const pivot = pivotIndex(word, "optimal");
    return [word.slice(0, pivot), word[pivot], word.slice(pivot + 1)];
  },
);

/** Boş ekranda uygulamanın ne yaptığını üç saniyede anlatan küçük gösteri. */
function WordDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setI((current) => (current + 1) % DEMO_WORDS.length),
      420,
    );
    return () => clearInterval(timer);
  }, []);
  const [left, pivot, right] = DEMO_WORDS[i];
  return (
    <div
      className="relative h-24 rounded-3xl border border-oku-line bg-oku-surface text-[34px]"
      aria-hidden="true"
    >
      <div className="absolute top-0 left-[36%] h-3 w-px bg-oku-faint" />
      <div className="absolute bottom-0 left-[36%] h-3 w-px bg-oku-faint" />
      {/* %72 genişliğin ortası %36: kırmızı harf okuyucudaki gibi odak çizgisinde */}
      <div className="absolute inset-y-0 left-0 grid w-[72%] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center leading-none font-medium whitespace-pre">
        <span className="flex justify-end">{left}</span>
        <span className="text-oku-red">{pivot}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

function DocRow({
  doc,
  progress,
  wpm,
  onOpen,
}: {
  doc: Doc;
  progress: Progress | undefined;
  wpm: number;
  onOpen: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const started = !!progress && progress.i > 0;
  const done = !!progress && progress.n > 0 && progress.i >= progress.n - 1;
  const ratio = progress?.n ? Math.min(1, (progress.i + 1) / progress.n) : 0;
  const remainingWords = Math.round(doc.words * (1 - ratio));

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <li className="relative overflow-hidden rounded-2xl bg-oku-surface">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full px-4 pt-3.5 pb-4 pr-14 text-left transition active:bg-oku-raised"
      >
        <p className="line-clamp-2 text-[15px] leading-snug font-medium [overflow-wrap:anywhere]">
          {doc.title}
        </p>
        <p className="mt-1.5 text-xs tabular-nums text-oku-muted">
          {numberFormat.format(doc.words)} kelime ·{" "}
          {done ? (
            <span className="text-emerald-400">Bitti</span>
          ) : started ? (
            `%${Math.round(ratio * 100)} · ${estimate(remainingWords, wpm)} kaldı`
          ) : (
            `~${estimate(doc.words, wpm)}`
          )}
        </p>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-oku-line">
          <div
            className={`h-full origin-left rounded-full ${done ? "bg-emerald-400/70" : "bg-oku-red"}`}
            style={{ transform: `scaleX(${started || done ? ratio : 0})` }}
          />
        </div>
      </button>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`${doc.title} metnini sil`}
        className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full text-oku-faint transition active:bg-oku-raised active:text-oku-red"
      >
        <Trash className="h-[18px] w-[18px]" />
      </button>

      {confirming && (
        <div className="oku-fade-in absolute inset-0 flex items-center justify-between gap-3 bg-oku-raised px-4">
          <p className="text-sm">Bu metin silinsin mi?</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-full px-4 py-2 text-sm text-oku-muted active:text-oku-text"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => removeDoc(doc.id)}
              className="rounded-full bg-oku-red px-4 py-2 text-sm font-semibold text-white active:opacity-80"
            >
              Sil
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function Editor({
  settings,
  onCreate,
}: {
  settings: Settings;
  onCreate: (text: string, title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const words = countWords(text);

  async function paste() {
    setError(null);
    try {
      const clip = await navigator.clipboard.readText();
      if (!clip.trim()) {
        setError("Pano boş görünüyor.");
        return;
      }
      setText((current) => (current.trim() ? `${current}\n\n${clip}` : clip));
    } catch {
      setError("Panoya erişilemedi. Metin alanına uzun basıp “Yapıştır”ı seç.");
      textRef.current?.focus();
    }
  }

  return (
    <div className="oku-fade-in fixed inset-0 flex flex-col bg-oku-bg pt-[env(safe-area-inset-top)]">
      <header className="flex h-14 shrink-0 items-center justify-between px-2">
        <button
          type="button"
          onClick={goBack}
          className="flex h-11 items-center gap-0.5 rounded-full pr-3 pl-1 text-[15px] text-oku-muted transition active:text-oku-text"
        >
          <ChevronLeft className="h-6 w-6" /> Vazgeç
        </button>
        <h1 className="text-[15px] font-semibold">Yeni metin</h1>
        <button
          type="button"
          onClick={paste}
          className="flex h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-oku-red transition active:opacity-60"
        >
          <Clipboard className="h-[18px] w-[18px]" /> Yapıştır
        </button>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col px-5">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Başlık (isteğe bağlı)"
          maxLength={120}
          className="w-full border-b border-oku-line bg-transparent py-3 text-[17px] font-semibold outline-none placeholder:font-normal placeholder:text-oku-faint"
        />
        <textarea
          ref={textRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Okumak istediğin metni buraya yapıştır…"
          className="min-h-0 w-full flex-1 resize-none bg-transparent py-4 text-[16px] leading-relaxed text-oku-text outline-none placeholder:text-oku-faint"
        />
        {error && <p className="pb-2 text-sm text-oku-red">{error}</p>}
      </div>

      <footer className="shrink-0 border-t border-oku-line bg-oku-bg px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <p className="text-xs tabular-nums text-oku-muted">
            {words ? (
              <>
                {numberFormat.format(words)} kelime
                <br />~{estimate(words, settings.wpm)} · {settings.wpm} k/dk
              </>
            ) : (
              "Henüz metin yok"
            )}
          </p>
          <button
            type="button"
            disabled={words < 2}
            onClick={() => onCreate(text, title)}
            className="flex h-12 items-center gap-2 rounded-2xl bg-oku-text px-6 text-[15px] font-semibold text-oku-bg transition active:scale-[0.97] disabled:opacity-30"
          >
            <Play className="h-4 w-4" /> Okumaya başla
          </button>
        </div>
      </footer>
    </div>
  );
}
