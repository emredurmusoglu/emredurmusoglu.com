import { ConfirmSubmit } from "@/components/panel/ConfirmSubmit";
import { LessonTick } from "@/components/kickboks/LessonTick";
import { deleteLesson } from "@/lib/actions/kickboks";
import {
  addDays,
  dayKey,
  MONTHS_TR,
  timeKey,
  WEEKDAYS_TR_SHORT,
  weekdayOf,
  weekStart,
} from "@/lib/date";
import type { KickboxLesson } from "@/lib/db/schema";

function untilLabel(day: string, today: string): string {
  const days = Math.round(
    (Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86_400_000,
  );
  if (days === 0) return "Bugün";
  if (days === 1) return "Yarın";
  return `${days} gün sonra`;
}

/** "3 – 9 Kasım", ay değişiyorsa "27 Ekim – 2 Kasım" */
function weekTitle(start: string): string {
  const end = addDays(start, 6);
  const [, m1, d1] = start.split("-").map(Number);
  const [, m2, d2] = end.split("-").map(Number);
  return m1 === m2
    ? `${d1} – ${d2} ${MONTHS_TR[m2 - 1]}`
    : `${d1} ${MONTHS_TR[m1 - 1]} – ${d2} ${MONTHS_TR[m2 - 1]}`;
}

const cardClass =
  "overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200";
const cardHeadClass =
  "flex items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/70 px-4 py-2.5";

/** Haftanın yapılan ders ve antrenman sayısı, kendi renkleriyle */
function WeekCounts({ lessons }: { lessons: KickboxLesson[] }) {
  const done = lessons.filter((lesson) => lesson.doneAt);
  const lessonCount = done.filter((lesson) => lesson.kind === "lesson").length;
  const trainingCount = done.length - lessonCount;

  return (
    <div className="flex shrink-0 gap-1.5 text-xs">
      {lessonCount ? (
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">
          {lessonCount} ders
        </span>
      ) : null}
      {trainingCount ? (
        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">
          {trainingCount} antrenman
        </span>
      ) : null}
      {!done.length ? <span className="text-neutral-400">yapılan yok</span> : null}
    </div>
  );
}

type ListProps = {
  lessons: KickboxLesson[];
  now: Date;
  /** Yapılan derslerin sıra numarası (ilk ders 1); antrenmanlar numara almıyor */
  ordinals: Map<number, number>;
};

export function UpcomingLessons({ lessons, now, ordinals }: ListProps) {
  if (!lessons.length) return null;

  return (
    <section className={cardClass}>
      <div className={cardHeadClass}>
        <h2 className="text-sm font-medium text-neutral-900">Yaklaşan</h2>
        <span className="text-xs text-neutral-500">{lessons.length} kayıt</span>
      </div>
      <ul className="divide-y divide-neutral-100 px-4">
        {lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            now={now}
            ordinal={ordinals.get(lesson.id)}
          />
        ))}
      </ul>
    </section>
  );
}

/** Geçmiş kayıtlar haftalara bölünüyor, en yeni hafta üstte. */
export function PastLessons({ lessons, now, ordinals }: ListProps) {
  const weeks = new Map<string, KickboxLesson[]>();
  for (const lesson of lessons) {
    const key = weekStart(dayKey(lesson.startsAt));
    weeks.set(key, [...(weeks.get(key) ?? []), lesson]);
  }

  if (!weeks.size) return null;
  const currentWeek = weekStart(dayKey(now));

  return (
    <section className="space-y-3">
      {[...weeks.entries()].map(([start, items]) => (
        <div key={start} className={cardClass}>
          <div className={cardHeadClass}>
            <h2 className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-900">
              <span className="truncate">{weekTitle(start)}</span>
              {start === currentWeek ? (
                <span className="shrink-0 rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-normal text-white">
                  Bu hafta
                </span>
              ) : null}
            </h2>
            <WeekCounts lessons={items} />
          </div>
          <ul className="divide-y divide-neutral-100 px-4">
            {items.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                now={now}
                ordinal={ordinals.get(lesson.id)}
              />
            ))}
          </ul>
        </div>
      ))}
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
  const day = dayKey(lesson.startsAt);
  const isPast = lesson.startsAt <= now;
  const isDone = lesson.doneAt !== null;
  const isTraining = lesson.kind === "training";

  return (
    <li className="group flex min-h-16 items-center gap-3 py-2.5">
      <span
        className={`h-9 w-0.5 shrink-0 rounded-full ${isTraining ? "bg-sky-600" : "bg-red-600"}`}
      />

      <div className="w-8 shrink-0 text-center">
        <p className="font-mono text-lg leading-none font-medium tabular-nums text-neutral-900">
          {Number(day.slice(8, 10))}
        </p>
        <p className="mt-1 text-[11px] leading-none text-neutral-400">
          {WEEKDAYS_TR_SHORT[weekdayOf(day)]}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-900">
          <span className="font-mono tabular-nums">{timeKey(lesson.startsAt)}</span>
          <span className="text-neutral-400">
            {" · "}
            {isTraining ? "Antrenman" : ordinal ? `${ordinal}. ders` : "Ders"}
          </span>
        </p>
        {lesson.note ? (
          <p className="truncate text-xs text-neutral-500">{lesson.note}</p>
        ) : null}
      </div>

      {isDone ? (
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${isTraining ? "bg-sky-600" : "bg-red-600"}`}
          aria-label="Yapıldı"
          title="Yapıldı"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
      ) : (
        <>
          {isPast ? (
            <LessonTick id={lesson.id} />
          ) : (
            <span className="shrink-0 text-xs text-neutral-500">
              {untilLabel(day, dayKey(now))}
            </span>
          )}

          <form
            action={deleteLesson}
            className="shrink-0 group-has-[[data-asking]]:hidden"
          >
            <input type="hidden" name="id" value={lesson.id} />
            <ConfirmSubmit
              message={
                isTraining ? "Bu antrenman silinsin mi?" : "Bu ders silinsin mi?"
              }
              className="-mr-1.5 grid h-7 w-7 place-items-center rounded-full text-neutral-300 transition hover:bg-neutral-100 hover:text-neutral-600"
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
