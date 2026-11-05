import { AddLessonForm } from "@/components/kickboks/AddLessonForm";
import { LessonList } from "@/components/kickboks/LessonList";
import { WeekChart } from "@/components/kickboks/WeekChart";
import { dayKey } from "@/lib/date";
import {
  LESSON_QUOTA,
  listLessons,
  weeklyBars,
  type WeekBar,
} from "@/lib/kickboks/dal";

// "Geçti mi, işaretlenebilir mi" her açılışta şimdiki saate göre hesaplanıyor.
export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default async function KickboksPage() {
  const now = new Date();
  const lessons = await listLessons();
  const weeks = weeklyBars(lessons, now);

  // Mesajlardaki "13. Ders" gibi: yapılan dersler sırayla numaralanıyor.
  // Antrenmanlar numara almıyor, ders hakkından da düşmüyor.
  const ordinals = new Map<number, number>();
  for (const lesson of lessons) {
    if (lesson.doneAt && lesson.kind === "lesson") {
      ordinals.set(lesson.id, ordinals.size + 1);
    }
  }
  const lessonsDone = ordinals.size;

  const upcoming = lessons.filter((lesson) => lesson.startsAt > now);
  const past = lessons.filter((lesson) => lesson.startsAt <= now).reverse();

  // Ortalama içinde bulunduğumuz yarım haftayı saymıyor; son 4 tam hafta.
  // Bu hafta ve ortalama dersle antrenmanı birlikte sayıyor: ne kadar
  // çalıştığının ölçüsü.
  const total = (week: WeekBar) => week.lessons + week.trainings;
  const thisWeek = weeks.at(-1);
  const lastFull = weeks.slice(-5, -1);
  const average =
    lastFull.reduce((sum, week) => sum + total(week), 0) / lastFull.length;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Kickboks
            <span className="h-1 w-8 rounded-full bg-red-600" />
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Ders ya da antrenman ekle, saati geçince yapıldı diye işaretle.
          </p>
        </div>

        <div
          className="shrink-0 text-right"
          aria-label={`${LESSON_QUOTA} ders hakkının ${lessonsDone} tanesi kullanıldı`}
        >
          <p className="text-xs text-neutral-400">Ders hakkı</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {lessonsDone}
            <span className="text-neutral-400">/{LESSON_QUOTA}</span>
          </p>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-red-600"
              style={{
                width: `${Math.min(100, (lessonsDone / LESSON_QUOTA) * 100)}%`,
              }}
            />
          </div>
        </div>
      </header>

      <AddLessonForm today={dayKey(now)} />

      <LessonList
        title="Yaklaşan"
        lessons={upcoming}
        now={now}
        ordinals={ordinals}
        empty="Planlı ders ya da antrenman yok."
      />

      <LessonList
        title="Geçmiş"
        lessons={past}
        now={now}
        ordinals={ordinals}
        empty="Henüz geçmiş kayıt yok."
      />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Bu hafta" value={String(thisWeek ? total(thisWeek) : 0)} />
        <Stat
          label="4 hafta ort."
          value={average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
        />
        <Stat
          label="Kalan ders"
          value={String(Math.max(0, LESSON_QUOTA - lessonsDone))}
        />
      </div>

      <WeekChart weeks={weeks} />
    </div>
  );
}
