import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emre Durmuşoğlu",
  description: "SaaS ve iOS odaklı dijital ürünler geliştiren bağımsız bir üretici.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/ed-512.png" }],
  },
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