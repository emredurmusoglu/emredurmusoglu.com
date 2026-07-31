import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Emre Durmuşoğlu",
  description: "SaaS ve iOS odaklı dijital ürünler geliştiren bağımsız bir üretici.",
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
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}