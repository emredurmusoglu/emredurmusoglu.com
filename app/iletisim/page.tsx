import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim — Emre Durmuşoğlu",
  description: "Proje, iş birliği ya da soru için mesaj gönderin.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/25 via-indigo-500/20 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white/80"
        >
          ← Emre Durmuşoğlu
        </Link>

        <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
          İletişim
        </h1>
        <div className="mt-5 h-px w-16 bg-gradient-to-r from-sky-400/60 via-indigo-400/40 to-fuchsia-400/60" />

        <ContactForm />
      </div>
    </main>
  );
}
