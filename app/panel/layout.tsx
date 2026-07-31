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
    statusBarStyle: "black-translucent",
  },
  other: {
    // Next artık standart adı (`mobile-web-app-capable`) üretiyor. iOS 16.4
    // öncesi Safari sadece bu eski adı tanıdığı için elle ekliyoruz.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  // Durum çubuğu saydam olduğu için içerik ekranın tepesine kadar uzanıyor;
  // çentiğin altında kalmasın diye aşağıda safe-area dolgusu veriyoruz.
  viewportFit: "cover",
};

export default function PanelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
