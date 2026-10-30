import type { Metadata, Viewport } from "next";

/**
 * Oku — hızlı okuma uygulaması. Panel ve Etsy defteri gibi ana ekrana ayrı
 * bir uygulama olarak ekleniyor: kendi adı, ikonu ve manifest'i var.
 *
 * Giriş istemiyor; metinler cihazda (localStorage) duruyor, sunucuya gitmiyor.
 */
export const metadata: Metadata = {
  title: "Oku",
  description: "Metni yapıştır, kelimeler kırmızı odak harfiyle tek tek aksın.",
  manifest: "/oku.webmanifest",
  icons: {
    icon: [
      { url: "/icons/oku-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/oku-apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "Oku",
    // Uygulama koyu: içerik durum çubuğunun altına uzansın, yazılar beyaz.
    statusBarStyle: "black-translucent",
  },
  other: {
    // iOS 16.4 öncesi Safari yalnızca bu eski adı tanıyor.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  colorScheme: "dark",
  viewportFit: "cover",
  // Klavye açılınca iOS'un otomatik yakınlaştırması, okuyucuda çift
  // dokunmayla yakınlaşma olmasın.
  maximumScale: 1,
};

export default function OkuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="oku-app min-h-dvh bg-oku-bg text-oku-text antialiased [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif] [-webkit-tap-highlight-color:transparent]">
      {children}
    </div>
  );
}
