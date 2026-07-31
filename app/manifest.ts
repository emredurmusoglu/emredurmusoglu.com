import type { MetadataRoute } from "next";

/**
 * Paneli iPhone/Android ana ekranına eklenebilir hale getirir.
 *
 * `start_url` bilerek `/panel` — ikona bastığında ana sayfa değil doğrudan
 * panel açılsın diye. `scope` ise `/`, böylece panelden siteye geçtiğinde
 * (örneğin "Sitede gör" linki) uygulamadan çıkıp Safari'ye atmıyor.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emre Durmuşoğlu — Panel",
    short_name: "Panel",
    description: "Kişisel ajanda: notlar, yapılacaklar ve projeler.",
    start_url: "/panel",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Uygulama = panel, panel de açık tema. Açılış ekranı da ona uysun.
    background_color: "#fafafa",
    theme_color: "#fafafa",
    lang: "tr",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
