import type { Metadata } from "next";

import { ToastHost } from "@/components/panel/Toast";

/**
 * Kickboks ders takibi. Bilerek şifresiz: adresi bilen açabiliyor, ama arama
 * motorlarına kapalı (meta robots + robots.txt).
 */
export const metadata: Metadata = {
  title: "Kickboks",
  robots: { index: false, follow: false },
};

export default function KickboksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="panel-light safe-top safe-bottom min-h-screen bg-neutral-50 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <main className="mx-auto min-w-0 max-w-2xl px-4 py-6 pb-20 md:py-10">
        {children}
      </main>

      {/* Layout hiç unmount olmadığı için toast burada duruyor */}
      <ToastHost />
    </div>
  );
}
