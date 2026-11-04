import { useSyncExternalStore } from "react";

import { SAMPLE_ID, SAMPLE_TEXT } from "@/lib/oku/sample";
import type { FocusMode } from "@/lib/oku/text";

/**
 * Oku'nun bütün verisi cihazda, localStorage'da duruyor: sunucuya hiçbir şey
 * gitmiyor, giriş gerekmiyor, uçak modunda da çalışıyor. Ana ekrandan açılan
 * iOS uygulamasının kendi deposu olduğu için Safari'deki kopyasıyla
 * karışmıyor.
 */

export type Doc = {
  id: string;
  title: string;
  text: string;
  words: number;
  createdAt: number;
  openedAt: number;
};

/**
 * Okuyucudaki yer: kaçıncı parçada (`i`) ve metin kaç parça (`n`). Uzun
 * kelimeler bölündüğü için parça sayısı kelime sayısından fazla olabiliyor;
 * kütüphanedeki yüzde bu ikisinden hesaplanıyor.
 */
export type Progress = { i: number; n: number };

export type FontSize = "s" | "m" | "l";

export type Settings = {
  wpm: number;
  fontSize: FontSize;
  focus: FocusMode;
  punctuationPause: boolean;
};

export const WPM_MIN = 100;
export const WPM_MAX = 1000;
export const WPM_STEP = 25;

export const DEFAULT_SETTINGS: Settings = {
  wpm: 300,
  fontSize: "m",
  focus: "optimal",
  punctuationPause: true,
};

function createStore<T>(key: string, fallback: T, normalize?: (value: T) => T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function get(): T {
    if (cache === undefined) {
      try {
        const raw = localStorage.getItem(key);
        cache = raw ? (JSON.parse(raw) as T) : fallback;
        if (normalize) cache = normalize(cache);
      } catch {
        cache = fallback;
      }
    }
    return cache;
  }

  function set(update: T | ((current: T) => T)) {
    cache =
      typeof update === "function"
        ? (update as (current: T) => T)(get())
        : update;
    try {
      localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      // Gizli sekme ya da dolu depo: bu oturumda bellekte yaşamaya devam eder.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useValue(): T {
    // Sunucuda ve ilk hydration'da `fallback`; tarayıcıda hemen gerçek değer.
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, useValue };
}

const library = createStore<Doc[]>(
  "oku:v1:library",
  [],
  // Örnek eskiden kütüphaneye ekleniyordu; o kopyalar listeden düşsün.
  (docs) => docs.filter((doc) => doc.text !== SAMPLE_TEXT),
);
const progress = createStore<Record<string, Progress>>("oku:v1:progress", {});
const settings = createStore<Settings>(
  "oku:v1:settings",
  DEFAULT_SETTINGS,
  // Sonradan eklenen ayarlar eski kayıtlarda eksik kalmasın.
  (value) => ({ ...DEFAULT_SETTINGS, ...value }),
);

export const useLibrary = library.useValue;
export const useProgress = progress.useValue;
export const useSettings = settings.useValue;

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function addDoc(doc: Pick<Doc, "title" | "text" | "words">): Doc {
  const now = Date.now();
  const created: Doc = { ...doc, id: newId(), createdAt: now, openedAt: now };
  library.set((docs) => [created, ...docs]);
  return created;
}

export function touchDoc(id: string) {
  library.set((docs) =>
    docs.map((doc) => (doc.id === id ? { ...doc, openedAt: Date.now() } : doc)),
  );
}

export function removeDoc(id: string) {
  library.set((docs) => docs.filter((doc) => doc.id !== id));
  progress.set((current) => {
    const rest = { ...current };
    delete rest[id];
    return rest;
  });
}

export function saveProgress(id: string, i: number, n: number) {
  if (id === SAMPLE_ID) return;
  const saved = progress.get()[id];
  if (saved?.i === i && saved.n === n) return;
  progress.set((current) => ({ ...current, [id]: { i, n } }));
}

export function updateSettings(patch: Partial<Settings>) {
  settings.set((current) => ({ ...current, ...patch }));
}
