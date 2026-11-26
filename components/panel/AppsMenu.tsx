"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Panel başlığındaki "Uygulamalar" açılır menüsü. Oku, QR, tk-bc gibi siteye
 * taşınmış ayrı uygulamalar burada toplanır; yenisi gelince APPS'e bir satır
 * eklemek yeter. Etsy sık açıldığı için başlıkta ayrı rozet olarak duruyor.
 *
 * Bağlantılar düz <a>: QR route handler, tk-bc public/ altında statik sayfa;
 * Next'in istemci geçişi bunlarda işe yaramıyor, hepsi aynı davransın.
 */
const APPS: {
  href: string;
  label: React.ReactNode;
  hint: string;
  dot: string;
}[] = [
  {
    href: "/oku",
    label: (
      <>
        O<span className="text-red-500">k</span>u
      </>
    ),
    hint: "Hızlı okuma",
    dot: "bg-red-500",
  },
  { href: "/qr-generator", label: "QR", hint: "QR kod üretici", dot: "bg-violet-500" },
  { href: "/tk-bc", label: "Kaserol Servis", hint: "tk-bc", dot: "bg-amber-500" },
];

export function AppsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 transition ${
          open ? "ring-indigo-300" : "ring-neutral-200 hover:ring-neutral-400"
        }`}
      >
        Uygulamalar
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M3 4.5 6 7.5 9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-52 rounded-2xl bg-white p-1.5 shadow-lg shadow-neutral-900/5 ring-1 ring-neutral-200"
        >
          {APPS.map((app) => (
            <a
              key={app.href}
              href={app.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-50"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${app.dot}`} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-neutral-800">
                  {app.label}
                </span>
                <span className="block text-xs text-neutral-400">{app.hint}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
