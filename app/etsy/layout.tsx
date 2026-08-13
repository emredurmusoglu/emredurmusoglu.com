import type { Metadata, Viewport } from "next";

/**
 * Etsy defterinin "Ana Ekrana Ekle" kimliği — paneldekinin aynısı, ama
 * kendi adı ve kendi manifest'iyle.
 *
 * iOS bu etiketlere bakar: ikonun altında "Cheerish Days" yazar ve tam
 * ekran açılır. Ekleme hangi sayfadan yapıldıysa oradan başlar, o yüzden
 * kullanıcıların /etsy açıkken eklemesi gerekiyor. Android ise manifest'i
 * okur; `start_url` orada /etsy olduğu için panele hiç uğramaz.
 */
export const metadata: Metadata = {
  title: "Cheerish Days Crafts",
  manifest: "/etsy.webmanifest",
  // Defter arama motorlarına asla düşmesin
  robots: { index: false, follow: false, nocache: true },
  appleWebApp: {
    capable: true,
    title: "Cheerish Days",
    // Defter açık temada: durum çubuğu yazıları siyah olsun diye "default".
    statusBarStyle: "default",
  },
  other: {
    // Next artık standart adı (`mobile-web-app-capable`) üretiyor. iOS 16.4
    // öncesi Safari sadece bu eski adı tanıdığı için elle ekliyoruz.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  viewportFit: "cover",
};

export default function EtsyRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
