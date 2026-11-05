import { MONTHS_TR_SHORT } from "@/lib/date";
import type { WeekBar } from "@/lib/kickboks/dal";

/**
 * Hafta hafta yapılan dersler ve antrenmanlar, üst üste. Altta ders (kırmızı),
 * üstte antrenman (mavi); ikisinin arasında 2px boşluk var, renk tek başına
 * ayırt edici olmasın. Çubuğun üstündeki sayı haftanın toplamı, kırılım
 * üzerine gelince ya da dokununca çıkıyor.
 *
 * Alttaki etikette ayın adı sadece ay değiştiğinde yazılıyor — 12 hafta
 * telefona ancak böyle sığıyor.
 */
export function WeekChart({ weeks }: { weeks: WeekBar[] }) {
  const max = Math.max(1, ...weeks.map((week) => week.lessons + week.trainings));
  const current = weeks.at(-1);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-neutral-900">Haftalık</h2>
        <span className="text-xs text-neutral-500">son {weeks.length} hafta</span>
      </div>

      <div className="mt-4">
        <ol className="flex h-44 items-stretch gap-1">
          {weeks.map((week, index) => {
            const [, month, day] = week.start.split("-").map(Number);
            const prevMonth =
              index > 0 ? Number(weeks[index - 1].start.slice(5, 7)) : null;
            const isCurrent = week.start === current?.start;
            const total = week.lessons + week.trainings;
            const detail = [
              `${day} ${MONTHS_TR_SHORT[month - 1]} haftası`,
              `${week.lessons} ders`,
              `${week.trainings} antrenman`,
              week.missed ? `${week.missed} işaretlenmedi` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li
                key={week.start}
                tabIndex={0}
                aria-label={detail}
                className="group relative flex min-w-0 flex-1 flex-col items-center outline-none"
              >
                {/* pt-5: en uzun çubuğun üstündeki sayıya yer */}
                <div className="flex w-full flex-1 items-end justify-center pt-5">
                  <div
                    className="relative flex w-full max-w-7 flex-col gap-0.5 transition-opacity group-hover:opacity-80 group-focus:opacity-80"
                    style={{ height: `${(total / max) * 100}%` }}
                  >
                    <span
                      className={`absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs tabular-nums ${total ? "text-neutral-700" : "text-neutral-300"}`}
                    >
                      {total}
                    </span>
                    {week.trainings ? (
                      <div
                        className="w-full rounded-t bg-sky-600"
                        style={{ flex: `${week.trainings} 1 0` }}
                      />
                    ) : null}
                    {week.lessons ? (
                      <div
                        className={`w-full bg-red-600 ${week.trainings ? "" : "rounded-t"}`}
                        style={{ flex: `${week.lessons} 1 0` }}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="mt-1.5 w-full border-t border-neutral-200 pt-1 text-center text-[10px] leading-tight tabular-nums text-neutral-400">
                  <span className={isCurrent ? "font-medium text-neutral-900" : ""}>
                    {day}
                  </span>
                  <span className="block h-3">
                    {month !== prevMonth ? MONTHS_TR_SHORT[month - 1] : ""}
                  </span>
                </div>

                <span
                  className={`pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block group-focus:block ${index < weeks.length / 2 ? "left-0" : "right-0"}`}
                >
                  {detail}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-3 flex gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-red-600" />
            Ders
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-sky-600" />
            Antrenman
          </span>
        </div>
      </div>
    </section>
  );
}
