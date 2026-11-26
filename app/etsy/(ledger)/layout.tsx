import { headers } from "next/headers";
import Link from "next/link";

import { EtsyNavLink } from "@/components/etsy/EtsyNavLink";
import { ToastHost } from "@/components/panel/Toast";
import { etsyLogout } from "@/lib/actions/auth";
import { PATH_HEADER } from "@/lib/auth/session.shared";
import { requireEtsySession } from "@/lib/auth/session";
import { userLabel } from "@/lib/auth/users";
import { logEtsyAccess } from "@/lib/etsy/access-log";

// Defter her zaman taze veri gösterir, cache'lenmez.
export const dynamic = "force-dynamic";

export default async function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Asıl yetki kontrolü burada — proxy sadece yönlendirme yapıyor.
  const session = await requireEtsySession();

  // Kim ne zaman bakmış: defter her açıldığında kaydediliyor (20 dakikada
  // bir satırdan fazlası yazılmıyor). Loglar sekmesinin kendisi sayılmıyor,
  // yoksa listeye bakmak listeyi büyütüyor.
  const path = (await headers()).get(PATH_HEADER);
  if (!path?.startsWith("/etsy/loglar")) {
    await logEtsyAccess(session.username, "visit", path);
  }

  return (
    <div className="panel-light safe-bottom min-h-screen bg-neutral-50 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      {/*
        iOS'ta başlığın ilk satırı silik görünüyordu, iki nedeni var:
        1. Ana ekran uygulamasında (viewport-fit=cover) sayfa saat ve pilin
           arkasından başlıyor. safe-top dış kutudayken yapışkan başlık
           kaydırınca top-0'a, saat ve pilin altına kayıyordu; iOS o şeridi
           soluklaştırıyor. safe-top başlığın kendisinde olunca zemini o
           şeridi örtüyor, satırlar hep altında kalıyor. Safari'de boşluk
           sıfır, orada bir şey değişmiyor.
        2. Zemin yarı saydam + backdrop-blur'du; arkadan geçen koyu yazı
           bulanık leke gibi görünüyordu (simülatörde görüldü). Zemin düz.
      */}
      <header className="safe-top sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50">
        {/*
          Telefonda sekmeler alt satıra iniyor (order-last + w-full), md'den
          itibaren aynı satıra dönüyor. Panel dönüşü sadece sahibinde.
        */}
        {/*
          Telefonda üstte pt-6 (24px), paneldekiyle aynı: iOS ana ekran
          uygulamasında saat ve pilin hemen altındaki ince bandı da
          soluklaştırıyor. 10px boşlukla ilk satır o bandın içinde kalıp
          silik görünüyordu; panelde 24px'le sorun yok.
        */}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-2 px-4 pb-2.5 pt-6 md:px-6 md:pt-2.5">
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
              <>
                <EtsyNavLink href="/etsy/kategoriler" label="Kategoriler" />
                <EtsyNavLink href="/etsy/loglar" label="Loglar" />
              </>
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
