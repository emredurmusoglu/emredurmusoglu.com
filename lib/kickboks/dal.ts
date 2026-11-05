import "server-only";

import { asc } from "drizzle-orm";

import { addDays, dayKey, weekStart } from "@/lib/date";
import { db } from "@/lib/db";
import { kickboxLessons, type KickboxLesson } from "@/lib/db/schema";

/** Alınan paketteki toplam ders hakkı. Yeni paket alınınca burası güncelleniyor. */
export const LESSON_QUOTA = 36;

/** Grafikte görünen hafta sayısı (içinde bulunduğumuz hafta dahil) */
export const CHART_WEEKS = 12;

export type WeekBar = {
  /** Haftanın pazartesisi, "YYYY-MM-DD" */
  start: string;
  /** Yapılan dersler */
  lessons: number;
  /** Yapılan antrenmanlar (ders hakkından düşmeyenler) */
  trainings: number;
  /** Tarihi geçmiş ama yapıldı diye işaretlenmemiş kayıtlar */
  missed: number;
};

export async function listLessons(): Promise<KickboxLesson[]> {
  return db.select().from(kickboxLessons).orderBy(asc(kickboxLessons.startsAt));
}

/**
 * Dersler hangi gün yapıldıysa o haftaya sayılıyor (işaretlendiği güne değil):
 * pazartesi akşamı dersi salı sabahı işaretlemek grafiği kaydırmasın.
 */
export function weeklyBars(lessons: KickboxLesson[], now: Date): WeekBar[] {
  const current = weekStart(dayKey(now));
  const bars = new Map<string, WeekBar>();
  for (let i = CHART_WEEKS - 1; i >= 0; i--) {
    const start = addDays(current, -7 * i);
    bars.set(start, { start, lessons: 0, trainings: 0, missed: 0 });
  }

  for (const lesson of lessons) {
    const bar = bars.get(weekStart(dayKey(lesson.startsAt)));
    if (!bar) continue;
    if (lesson.doneAt) {
      if (lesson.kind === "training") bar.trainings += 1;
      else bar.lessons += 1;
    } else if (lesson.startsAt <= now) bar.missed += 1;
  }

  return [...bars.values()];
}
