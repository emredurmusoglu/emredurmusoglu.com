import "server-only";

import { headers } from "next/headers";
import { desc, sql } from "drizzle-orm";

import { requireEtsyOwner } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { etsyAccessLog } from "@/lib/db/schema";

export type AccessEvent = "login" | "visit";

export type AccessLogRow = {
  id: number;
  username: string;
  event: AccessEvent;
  path: string | null;
  device: string | null;
  ip: string | null;
  createdAt: Date;
};

/** Aynı kullanıcının bu süre içindeki ikinci ziyareti yeni satır açmıyor */
const VISIT_WINDOW = "20 minutes";

const DEVICES: [RegExp, string][] = [
  [/iPad/i, "iPad"],
  [/iPhone/i, "iPhone"],
  [/Android/i, "Android"],
  [/Macintosh|Mac OS X/i, "Mac"],
  [/Windows/i, "Windows"],
  [/Linux/i, "Linux"],
];

/** User-agent'ı okunabilir tek kelimeye indiriyor; tam metni saklamıyoruz. */
function describeDevice(userAgent: string | null): string | null {
  if (!userAgent) return null;
  const match = DEVICES.find(([pattern]) => pattern.test(userAgent));
  if (!match) return "Bilinmiyor";
  const browser = /CriOS/i.test(userAgent)
    ? "Chrome"
    : /Firefox/i.test(userAgent)
      ? "Firefox"
      : /Chrome/i.test(userAgent)
        ? "Chrome"
        : /Safari/i.test(userAgent)
          ? "Safari"
          : null;
  return browser ? `${match[1]} · ${browser}` : match[1];
}

/**
 * Deftere girişi kaydeder.
 *
 * Sayfa render'ının içinden çağrıldığı için hiçbir koşulda patlamamalı:
 * log yazılamazsa defter yine de açılsın.
 */
export async function logEtsyAccess(
  username: string,
  event: AccessEvent,
  path?: string | null,
): Promise<void> {
  try {
    const head = await headers();
    const device = describeDevice(head.get("user-agent"));
    const ip = head.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    if (event === "login") {
      await db.insert(etsyAccessLog).values({
        username,
        event: "login",
        path: path ?? null,
        device,
        ip,
      });
      return;
    }

    // Her sayfa açılışında satır biriktirmesin diye tek sorguluk fren:
    // son ziyaret yeterince eskiyse yazıyor, değilse hiçbir şey yapmıyor.
    await db.execute(sql`
      insert into etsy_access_log (username, event, path, device, ip)
      select ${username}::varchar, 'visit'::etsy_access_event,
             ${path ?? null}::varchar, ${device}::varchar, ${ip}::varchar
      where not exists (
        select 1 from etsy_access_log
        where username = ${username}::varchar
          and event = 'visit'::etsy_access_event
          and created_at > now() - interval '${sql.raw(VISIT_WINDOW)}'
      )
    `);
  } catch {
    // Sessizce geç — kayıt tutmak defteri açmaktan daha önemli değil.
  }
}

/** Log sayfası için son kayıtlar. Sadece defterin sahibi görebiliyor. */
export async function listEtsyAccessLog(limit = 200): Promise<AccessLogRow[]> {
  await requireEtsyOwner();

  return db
    .select({
      id: etsyAccessLog.id,
      username: etsyAccessLog.username,
      event: etsyAccessLog.event,
      path: etsyAccessLog.path,
      device: etsyAccessLog.device,
      ip: etsyAccessLog.ip,
      createdAt: etsyAccessLog.createdAt,
    })
    .from(etsyAccessLog)
    .orderBy(desc(etsyAccessLog.createdAt))
    .limit(limit);
}
