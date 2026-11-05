"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull, lte } from "drizzle-orm";

import { zonedInstant } from "@/lib/date";
import { db } from "@/lib/db";
import { kickboxLessons } from "@/lib/db/schema";
import { int, optionalText, text } from "@/lib/form";

/*
 * Sayfa bilerek şifresiz. Kimin yazdığını bilemediğimiz için sunucu iki kuralı
 * kendisi koruyor: yapıldı işareti geri alınmıyor, işaretli ders silinmiyor.
 */

export type LessonState = { error?: string };

export async function createLesson(
  _prevState: LessonState,
  form: FormData,
): Promise<LessonState> {
  const kind =
    text(form, "kind", { max: 10 }) === "training" ? "training" : "lesson";
  const day = text(form, "day", { max: 10 });
  const time = text(form, "time", { max: 5 });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { error: "Tarihi seç." };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: "Saati seç." };

  const startsAt = zonedInstant(day, time);
  const year = Number(day.slice(0, 4));
  if (Number.isNaN(startsAt.getTime()) || year < 2020 || year > 2100) {
    return { error: "Tarih geçerli değil." };
  }

  await db.insert(kickboxLessons).values({
    kind,
    startsAt,
    note: optionalText(form, "note", { max: 200 }),
  });

  revalidatePath("/kickboks");
  return {};
}

/** Sadece saati gelmiş, henüz işaretlenmemiş ders işaretlenebiliyor. */
export async function markLessonDone(form: FormData) {
  const id = int(form, "id");
  if (!id) return;

  const now = new Date();
  await db
    .update(kickboxLessons)
    .set({ doneAt: now })
    .where(
      and(
        eq(kickboxLessons.id, id),
        isNull(kickboxLessons.doneAt),
        lte(kickboxLessons.startsAt, now),
      ),
    );

  revalidatePath("/kickboks");
}

export async function deleteLesson(form: FormData) {
  const id = int(form, "id");
  if (!id) return;

  await db
    .delete(kickboxLessons)
    .where(and(eq(kickboxLessons.id, id), isNull(kickboxLessons.doneAt)));

  revalidatePath("/kickboks");
}
