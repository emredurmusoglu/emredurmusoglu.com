import Link from "next/link";

import { SourceLayer } from "@/components/source/SourceLayer";
import contactSource from "@/lib/source/contact.json";

/** Başlıktaki iletişim düğmesi — arkasında kendi kodu duruyor. */
export function ContactButton() {
  return (
    <div className="relative isolate">
      <SourceLayer snippet={contactSource} variant="halo" />
      <Link
        href="/iletisim"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/15"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
          <path d="m22 8-10 6L2 8" />
        </svg>
        <span className="hidden sm:inline">İletişime geç</span>
      </Link>
    </div>
  );
}
