import { ConfirmSubmit } from "@/components/panel/ConfirmSubmit";
import { LessonTick } from "@/components/kickboks/LessonTick";
import { deleteLesson } from "@/lib/actions/kickboks";
import { dayKey, formatLessonTime } from "@/lib/date";
import type { KickboxLesson } from "@/lib/db/schema";

function untilLabel(startsAt: Date, now: Date): string {
  const days = Math.round(
    (Date.parse(`${dayKey(startsAt)}T00:00:00Z`) -
      Date.parse(`${dayKey(now)}T00:00:00Z`)) /
      86_400_000,
  );
  if (days === 0) return "Bugün";
  if (days === 1) return "Yarın";
  return `${days} gün sonra`;
}

export function LessonList({
  title,
  lessons,
  now,
  ordinals,
  empty,
}: {
  title: string;
  lessons: KickboxLesson[];
  now: Date;
  /** Yapılan derslerin sıra numarası (ilk ders 1); antrenmanlar numara almıyor */
  ordinals: Map<number, number>;
  empty: string;
}) {
  return (
    <section>
      <h2 className="mb-2 px-3 text-sm font-medium text-neutral-700">
        {title}
        {lessons.length ? (
          <span className="ml-2 text-neutral-400">{lessons.length}</span>
        ) : null}
      </h2>

      {lessons.length ? (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              now={now}
              ordinal={ordinals.get(lesson.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-400">
          {empty}
        </p>
      )}
    </section>
  );
}

function LessonRow({
  lesson,
  now,
  ordinal,
}: {
  lesson: KickboxLesson;
  now: Date;
  ordinal?: number;
}) {
  const isPast = lesson.startsAt <= now;
  const isDone = lesson.doneAt !== null;

  return (
    <li className="group flex min-h-14 items-center gap-3 px-4 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tabular-nums text-neutral-900">
          {formatLessonTime(lesson.startsAt)}
          {lesson.kind === "training" ? (
            <span className="ml-2 font-normal text-sky-700">Antrenman</span>
          ) : ordinal ? (
            <span className="ml-2 font-normal text-neutral-400">
              {ordinal}. ders
            </span>
          ) : null}
        </p>
        {lesson.note ? (
          <p className="truncate text-xs text-neutral-500">{lesson.note}</p>
        ) : null}
      </div>

      {isDone ? (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
          Yapıldı
        </span>
      ) : (
        <>
          {isPast ? (
            <LessonTick id={lesson.id} />
          ) : (
            <span className="shrink-0 text-xs text-neutral-400">
              {untilLabel(lesson.startsAt, now)}
            </span>
          )}

          <form
            action={deleteLesson}
            className="shrink-0 group-has-[[data-asking]]:hidden"
          >
            <input type="hidden" name="id" value={lesson.id} />
            <ConfirmSubmit
              message={
                lesson.kind === "training"
                  ? "Bu antrenman silinsin mi?"
                  : "Bu ders silinsin mi?"
              }
              className="grid h-7 w-7 place-items-center rounded-lg text-neutral-300 transition hover:bg-neutral-100 hover:text-neutral-600"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-label="Sil"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </ConfirmSubmit>
          </form>
        </>
      )}
    </li>
  );
}
