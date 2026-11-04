import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";
import { SourceLayer } from "@/components/source/SourceLayer";
import pageSource from "@/lib/source/contactPage.json";

export const metadata: Metadata = {
  title: "İletişim — Emre Durmuşoğlu",
  description: "Bir projeniz, iş birliği teklifiniz ya da sorunuz varsa yazın.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <SourceLayer snippet={pageSource} variant="page" repeat={3} />

      <div className="relative mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white/80"
        >
          ← Emre Durmuşoğlu
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          İletişim
        </h1>
        <div className="mt-5 h-px w-16 bg-ed/70" />

        <div className="src-quiet">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
