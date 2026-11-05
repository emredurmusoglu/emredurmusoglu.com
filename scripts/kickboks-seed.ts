/**
 * Sayfa açılmadan önce WhatsApp'tan takip edilen ilk 14 ders.
 *
 *   npx tsx scripts/kickboks-seed.ts
 *
 * Hepsi yapıldı diye işaretli giriyor (işaret anı = dersin saati). Tekrar
 * çalıştırılabilir: aynı saatte ders varsa ikincisi eklenmiyor.
 */
import { config } from "dotenv";

config({ path: ".env.local" });

const LESSONS: [day: string, time: string][] = [
  ["2026-09-21", "17:00"],
  ["2026-09-22", "12:00"],
  ["2026-09-28", "17:00"],
  ["2026-09-29", "12:00"],
  ["2026-10-05", "17:00"],
  ["2026-10-07", "17:00"],
  ["2026-10-08", "17:00"],
  ["2026-10-12", "17:00"],
  ["2026-10-14", "17:00"],
  ["2026-10-19", "17:00"],
  ["2026-10-21", "17:00"],
  ["2026-10-26", "17:00"],
  ["2026-10-31", "13:30"],
  ["2026-11-04", "17:00"],
];

async function main() {
  const { db } = await import("../lib/db");
  const { kickboxLessons } = await import("../lib/db/schema");
  const { zonedInstant } = await import("../lib/date");

  const existing = new Set(
    (await db.select({ startsAt: kickboxLessons.startsAt }).from(kickboxLessons)).map(
      (row) => row.startsAt.getTime(),
    ),
  );

  const rows = LESSONS.map(([day, time]) => zonedInstant(day, time))
    .filter((startsAt) => !existing.has(startsAt.getTime()))
    .map((startsAt) => ({ startsAt, doneAt: startsAt }));

  if (rows.length) await db.insert(kickboxLessons).values(rows);
  console.log(`${rows.length} ders eklendi, ${LESSONS.length - rows.length} zaten vardı.`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
