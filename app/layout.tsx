import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import { SITE_URL } from "@/lib/site";

// Sitenin yazı ve kod fontları; latin-ext Türkçe karakterler (ş, ğ, ı, İ) için.
// Panel, Etsy ve Oku kendi sistem fontlarını kullanmaya devam ediyor.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Emre Durmuşoğlu",
  description: "Web uygulamaları, yönetim panelleri, iOS ve Android uygulamaları geliştiren bağımsız yazılım geliştirici.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    // ed-512.png şeffaf zeminli; iOS şeffaflığı siyaha çevirdiği için
    // ana ekran ikonu olarak düz zemine bastırılmış sürümü kullanıyoruz.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}