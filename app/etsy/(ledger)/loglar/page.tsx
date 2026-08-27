import Link from "next/link";

import { userLabel } from "@/lib/auth/users";
import { formatDateTime } from "@/lib/date";
import { listEtsyAccessLog } from "@/lib/etsy/access-log";

/**
 * Deftere kim ne zaman bakmış.
 *
 * Cookie 30 gün yaşadığı için "giriş" satırı seyrek düşüyor; asıl bilgi
 * "açtı" satırları. Aynı kişinin arka arkaya gezinmesi tek satır sayılıyor
 * (20 dakikalık pencere), yoksa liste tek oturumda onlarca satır oluyordu.
 */
export const dynamic = "force-dynamic";

const chipClass = (active: boolean) =>
  [
    "shrink-0 rounded-full px-3 py-1.5 text-xs transition",
    active
      ? "bg-neutral-900 font-medium text-white"
      : "border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-800",
  ].join(" ");

const gridCols = "grid-cols-[1fr_auto] md:grid-cols-[11rem_7rem_1fr_9rem]";
const rowClass = `grid ${gridCols} items-center gap-x-3 gap-y-1 px-4 py-3 md:gap-y-0 md:py-2.5`;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ kim?: string }>;
}) {
  const { kim } = await searchParams;
  const showMine = kim === "hepsi";

  const all = await listEtsyAccessLog();
  const rows = showMine ? all : all.filter((row) => row.username !== "emre");

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h1 className="text-lg font-semibold tracking-tight">Loglar</h1>
        <p className="text-xs text-neutral-400">Son {all.length} kayıt</p>
      </header>

      <div className="flex flex-wrap items-center gap-2 px-1">
        <Link href="/etsy/loglar" className={chipClass(!showMine)}>
          Diğer kullanıcılar
        </Link>
        <Link href="/etsy/loglar?kim=hepsi" className={chipClass(showMine)}>
          Ben de dahil
        </Link>
      </div>

      {rows.length ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div
            className={`hidden ${gridCols} items-center gap-x-3 border-b border-neutral-100 px-4 py-2 text-xs text-neutral-400 md:grid`}
            aria-hidden="true"
          >
            <span>Zaman</span>
            <span>Kim</span>
            <span>Cihaz</span>
            <span>Ne yaptı</span>
          </div>

          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className={`border-b border-neutral-50 last:border-0 ${rowClass}`}
              >
                {/* Telefonda iki sıra, md'den itibaren dört sütun */}
                <span className="order-1 text-sm tabular-nums text-neutral-800 md:text-neutral-600">
                  {formatDateTime(row.createdAt)}
                </span>

                <span className="order-2 justify-self-end text-sm font-medium text-neutral-900 md:justify-self-start md:font-normal">
                  {userLabel(row.username)}
                </span>

                <span className="order-3 min-w-0 truncate text-xs text-neutral-400 md:text-sm md:text-neutral-500">
                  {row.device ?? "—"}
                  {row.ip ? (
                    <span className="ml-2 hidden text-neutral-300 lg:inline">
                      {row.ip}
                    </span>
                  ) : null}
                </span>

                <span className="order-4 justify-self-end text-xs md:text-sm">
                  {row.event === "login" ? (
                    <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-700">
                      Parolayla giriş
                    </span>
                  ) : (
                    <span className="text-neutral-500">
                      Defteri açtı
                      {row.path && row.path !== "/etsy" ? (
                        <span className="ml-1 text-neutral-300">
                          {row.path}
                        </span>
                      ) : null}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-400 shadow-sm">
          Henüz kayıt yok.
        </p>
      )}

      <p className="px-1 text-xs text-neutral-400">
        Aynı kişinin 20 dakika içindeki gezinmesi tek satır sayılıyor.
      </p>
    </div>
  );
}
