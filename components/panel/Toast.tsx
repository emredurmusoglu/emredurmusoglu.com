"use client";

import { useEffect, useState } from "react";

/** Kaydetme tamamlandı sinyali. Toast dışında, açık formu kapatmak için de dinleniyor. */
export const TOAST_EVENT = "panel:toast";
const EVENT = TOAST_EVENT;

/** Herhangi bir yerden çağrılabilir — ToastHost dinliyor. */
export function notifyToast(message = "Kaydedildi") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/**
 * Panel layout'unda duruyor. Formlar kaydettikten sonra yeniden mount
 * olabildiği için toast'ı onların içinde tutmuyoruz — burası hiç unmount
 * olmayan tek yer.
 */
export function ToastHost() {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );

  useEffect(() => {
    const onToast = (event: Event) => {
      const message = (event as CustomEvent<string>).detail || "Kaydedildi";
      setToast({ id: Date.now(), message });
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center"
      role="status"
      aria-live="polite"
    >
      <div
        key={toast.id}
        className="panel-toast flex items-center gap-2.5 rounded-2xl bg-neutral-900/95 px-5 py-3.5 text-sm font-medium text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>
        {toast.message}
      </div>
    </div>
  );
}
