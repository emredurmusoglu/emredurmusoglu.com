import type { Metadata, Viewport } from "next";

import { ToastHost } from "@/components/panel/Toast";

/**
 * Kickboks ders takibi. Bilerek şifresiz: adresi bilen açabiliyor, ama arama
 * motorlarına kapalı (meta robots + robots.txt).
 */
export const metadata: Metadata = {
  title: "Kickboks",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function KickboksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="panel-light safe-top safe-bottom min-h-screen bg-neutral-50 text-neutral-900 [-webkit-tap-highlight-color:transparent]">
      <main className="mx-auto min-w-0 max-w-xl px-4 pt-8 pb-24 md:pt-12">
        {children}
      </main>

      {/* Layout hiç unmount olmadığı için toast burada duruyor */}
      <ToastHost />
    </div>
  );
}
