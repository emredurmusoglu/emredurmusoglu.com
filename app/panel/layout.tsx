import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Panel",
  // Panel arama motorlarına asla düşmesin
  robots: { index: false, follow: false, nocache: true },
  // "Ana Ekrana Ekle" panelden yapıldığında Safari bu etiketleri okur:
  // tam ekran açılır, ikonun altında "Panel" yazar.
  appleWebApp: {
    capable: true,
    title: "Panel",
    // Panel açık temada: durum çubuğu yazıları siyah olsun diye "default".
    statusBarStyle: "default",
  },
  other: {
    // Next artık standart adı (`mobile-web-app-capable`) üretiyor. iOS 16.4
    // öncesi Safari sadece bu eski adı tanıdığı için elle ekliyoruz.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  // Site koyu ama panel açık tema — tarayıcı çubuğu da ona uysun.
  themeColor: "#fafafa",
  viewportFit: "cover",
};

export default function PanelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
