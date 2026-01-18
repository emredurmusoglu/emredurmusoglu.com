import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emre Durmuşoğlu",
  description: "SaaS ve iOS odaklı ürünler geliştiriyorum. Davetiva ve AlarMix.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
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