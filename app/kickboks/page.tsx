import { AddLessonForm, type DayMark } from "@/components/kickboks/AddLessonForm";
import { PastLessons, UpcomingLessons } from "@/components/kickboks/LessonList";
import { QuotaCard } from "@/components/kickboks/QuotaCard";
import { WeekChart } from "@/components/kickboks/WeekChart";
import { dayKey, timeKey } from "@/lib/date";
import { LESSON_QUOTA, listLessons, weeklyBars } from "@/lib/kickboks/dal";

// "Geçti mi, işaretlenebilir mi" her açılışta şimdiki saate göre hesaplanıyor.
export const dynamic = "force-dynamic";

/** Formda hazır duran saatler: en sık kullanılan üçü, kayıt yoksa ders saatleri */
function frequentTimes(times: string[]): string[] {
  const counts = new Map<string, number>();
  for (const time of times) counts.set(time, (counts.get(time) ?? 0) + 1);
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([time]) => time);
  return top.length ? top : ["17:00", "12:00"];
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-xl font-medium tabular-nums">{value}</p>
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

  const upcoming = lessons.filter((lesson) => lesson.startsAt > now);
  const past = lessons.filter((lesson) => lesson.startsAt <= now).reverse();

  // Ortalama içinde bulunduğumuz yarım haftayı saymıyor; son 4 tam hafta.
  // Dersle antrenman birlikte: haftada ne kadar çalışıldığının ölçüsü.
  const lastFull = weeks.slice(-5, -1);
  const average =
    lastFull.reduce((sum, week) => sum + week.lessons + week.trainings, 0) /
    lastFull.length;

  // Takvimdeki işaretler: yapılan dersler/antrenmanlar ve bekleyen kayıtlar
  const marks: Record<string, DayMark> = {};
  for (const lesson of lessons) {
    const day = dayKey(lesson.startsAt);
    const mark = (marks[day] ??= { lesson: false, training: false, planned: false });
    if (!lesson.doneAt) mark.planned = true;
    else if (lesson.kind === "training") mark.training = true;
    else mark.lesson = true;
  }

  const thisWeek = weeks.at(-1);

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Kickboks</h1>
        <QuotaCard
          quota={LESSON_QUOTA}
          used={ordinals.size}
          planned={upcoming.filter((lesson) => lesson.kind === "lesson").length}
        />
      </header>

      <AddLessonForm
        today={dayKey(now)}
        marks={marks}
        frequentTimes={frequentTimes(
          lessons.map((lesson) => timeKey(lesson.startsAt)),
        )}
      />

      <UpcomingLessons lessons={upcoming} now={now} ordinals={ordinals} />
      <PastLessons lessons={past} now={now} ordinals={ordinals} />

      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Bu hafta"
          value={String(thisWeek ? thisWeek.lessons + thisWeek.trainings : 0)}
        />
        <Stat
          label="4 hafta ort."
          value={average.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
        />
        <Stat
          label="Kalan ders"
          value={String(Math.max(0, LESSON_QUOTA - ordinals.size))}
        />
      </div>

      <WeekChart weeks={weeks} />
    </div>
  );
}
