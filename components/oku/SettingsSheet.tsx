"use client";

import { useEffect } from "react";

import {
  type FontSize,
  type Settings,
  updateSettings,
  WPM_MAX,
  WPM_MIN,
  WPM_STEP,
} from "@/lib/oku/store";
import type { FocusMode } from "@/lib/oku/text";

const PRESETS = [250, 350, 500, 700];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex rounded-xl bg-oku-raised p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            value === option.value
              ? "bg-oku-line text-oku-text shadow-sm"
              : "text-oku-muted active:text-oku-text"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Alttan açılan ayar paneli; hem kütüphaneden hem okuyucudan açılıyor. */
export function SettingsSheet({
  settings,
  onClose,
}: {
  settings: Settings;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Ayarlar"
    >
      <button
        type="button"
        aria-label="Kapat"
        onClick={onClose}
        className="oku-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="oku-sheet-in relative w-full max-w-md rounded-t-3xl border border-oku-line bg-oku-surface px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:pb-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-oku-line sm:hidden" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Ayarlar</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-oku-red active:opacity-60"
          >
            Bitti
          </button>
        </div>

        <section className="mb-6">
          <div className="mb-3 flex items-baseline justify-between">
            <label htmlFor="oku-wpm" className="text-sm text-oku-muted">
              Hız
            </label>
            <span className="tabular-nums text-sm">
              <span className="text-xl font-semibold">{settings.wpm}</span>{" "}
              <span className="text-oku-muted">kelime/dk</span>
            </span>
          </div>
          <input
            id="oku-wpm"
            type="range"
            min={WPM_MIN}
            max={WPM_MAX}
            step={WPM_STEP}
            value={settings.wpm}
            onChange={(event) =>
              updateSettings({ wpm: Number(event.target.value) })
            }
            className="oku-range w-full"
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {PRESETS.map((wpm) => (
              <button
                key={wpm}
                type="button"
                onClick={() => updateSettings({ wpm })}
                className={`rounded-lg py-1.5 text-sm tabular-nums transition ${
                  settings.wpm === wpm
                    ? "bg-oku-red/15 text-oku-red"
                    : "bg-oku-raised text-oku-muted active:text-oku-text"
                }`}
              >
                {wpm}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <p className="mb-3 text-sm text-oku-muted">Yazı boyutu</p>
          <Segmented<FontSize>
            label="Yazı boyutu"
            value={settings.fontSize}
            onChange={(fontSize) => updateSettings({ fontSize })}
            options={[
              { value: "s", label: "Küçük" },
              { value: "m", label: "Orta" },
              { value: "l", label: "Büyük" },
            ]}
          />
        </section>

        <section className="mb-6">
          <p className="mb-3 text-sm text-oku-muted">Kırmızı harf</p>
          <Segmented<FocusMode>
            label="Kırmızı harf"
            value={settings.focus}
            onChange={(focus) => updateSettings({ focus })}
            options={[
              { value: "optimal", label: "Odak noktası" },
              { value: "center", label: "Tam orta" },
            ]}
          />
          {/* İki satırlık yer sabit: seçim değişince panel zıplamasın */}
          <p className="mt-2 min-h-[2lh] text-xs leading-relaxed text-oku-faint">
            {settings.focus === "optimal"
              ? "Göz bir kelimeyi ortasının biraz solundan tanır. Önerilen ayar bu."
              : "Kırmızı harf her kelimenin tam ortasında."}
          </p>
        </section>

        <section className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm">Noktalamada nefes al</p>
            <p className="mt-0.5 text-xs text-oku-faint">
              Virgülde, cümle ve paragraf sonunda kısa duraklama
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.punctuationPause}
            aria-label="Noktalamada nefes al"
            onClick={() =>
              updateSettings({ punctuationPause: !settings.punctuationPause })
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              settings.punctuationPause ? "bg-oku-red" : "bg-oku-line"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                settings.punctuationPause ? "translate-x-5" : ""
              }`}
            />
          </button>
        </section>
      </div>
    </div>
  );
}
