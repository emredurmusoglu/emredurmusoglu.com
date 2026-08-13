import Link from "next/link";

import { EtsyNavLink } from "@/components/etsy/EtsyNavLink";
import { ToastHost } from "@/components/panel/Toast";
import { etsyLogout } from "@/lib/actions/auth";
import { requireEtsySession } from "@/lib/auth/session";
import { userLabel } from "@/lib/auth/users";

// Defter her zaman taze veri gösterir, cache'lenmez.
export const dynamic = "force-dynamic";

export default async function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Asıl yetki kontrolü burada — proxy sadece yönlendirme yapıyor.
  const session = await requireEtsySession();

  return (
    <div className="panel-light safe-top safe-bottom min-h-screen bg-neutral-50 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur">
        {/*
          Telefonda sekmeler alt satıra iniyor (order-last + w-full), md'den
          itibaren aynı satıra dönüyor. Panel dönüşü sadece sahibinde.
        */}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2.5 md:px-6">
          <Link
            href="/etsy"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
          >
            Etsy
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
          </Link>

          {session.role === "owner" ? (
            <Link
              href="/panel"
              className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-indigo-600 ring-1 ring-neutral-200 transition hover:ring-indigo-300"
            >
              ← Panel
            </Link>
          ) : null}

          <nav className="order-last flex w-full min-w-0 gap-1 overflow-x-auto md:order-none md:ml-2 md:w-auto">
            <EtsyNavLink href="/etsy" label="Cheerish Days Crafts" />
            {session.role === "owner" ? (
              <EtsyNavLink href="/etsy/kategoriler" label="Kategoriler" />
            ) : null}
          </nav>

          <span className="ml-auto shrink-0 rounded-full bg-white px-2.5 py-1 text-xs text-neutral-500 ring-1 ring-neutral-200">
            {userLabel(session.username)}
          </span>

          <form action={etsyLogout} className="shrink-0">
            <button
              type="submit"
              className="text-xs text-neutral-400 transition hover:text-neutral-700"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-5xl px-4 py-6 pb-20 md:px-6 md:py-8">
        {children}
      </main>

      {/* Layout hiç unmount olmadığı için toast burada duruyor */}
      <ToastHost />
    </div>
  );
}
