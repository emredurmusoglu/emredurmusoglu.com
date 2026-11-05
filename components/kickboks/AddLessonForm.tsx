"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { notifyToast } from "@/components/panel/Toast";
import { createLesson, type LessonState } from "@/lib/actions/kickboks";
import {
  MONTHS_TR,
  monthKey,
  monthRange,
  splitMonth,
  WEEKDAYS_TR,
  weekdayOf,
  type MonthKey,
} from "@/lib/date";

type Kind = "lesson" | "training";

/** Takvimde bir günün işaretleri */
export type DayMark = { lesson: boolean; training: boolean; planned: boolean };

const WEEK_HEAD = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

/** "Diğer…" listesi: 06:00–23:45, çeyrek saatte bir */
const ALL_TIMES = Array.from({ length: (24 - 6) * 4 }, (_, i) => {
  const minutes = 6 * 60 + i * 15;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

function dayTitle(day: string): string {
  const [, month, date] = day.split("-").map(Number);
  return `${date} ${MONTHS_TR[month - 1]} ${WEEKDAYS_TR[weekdayOf(day)]}`;
}

function shiftMonth(month: MonthKey, by: number): MonthKey {
  const { year, month: m } = splitMonth(month);
  const index = year * 12 + (m - 1) + by;
  return monthKey(Math.floor(index / 12), (index % 12) + 1);
}

/**
 * Tarih ve saat için tarayıcının kendi kutuları yok: iOS Safari'de genişlikleri
 * kontrol edilemiyor, boşken de hiçbir şey yazmıyorlar. Onun yerine bir ay
 * takvimi ve en sık kullanılan saatler var; seyrek saatler için iOS'un kendi
 * çarkını açan bir liste duruyor.
 *
 * Takvim aynı zamanda geçmişi gösteriyor: ders yapılan günler kırmızı,
 * antrenman yapılanlar mavi, bekleyen kayıtlar halkalı nokta.
 *
 * Bugün ve en sık saat seçili açılıyor: çoğu zaman tek dokunuş yetiyor.
 */
export function AddLessonForm({
  today,
  marks,
  frequentTimes,
}: {
  /** Sunucudan geliyor: istemcide üretilirse saat dilimi kayması olabilir */
  today: string;
  marks: Record<string, DayMark>;
  /** En sık kullanılan saatler, sıklık sırasıyla */
  frequentTimes: string[];
}) {
  const [kind, setKind] = useState<Kind>("lesson");
  const [day, setDay] = useState(today);
  const [month, setMonth] = useState<MonthKey>(today.slice(0, 7));
  const [time, setTime] = useState(frequentTimes[0]);
  const [state, formAction, isPending] = useActionState<LessonState, FormData>(
    createLesson,
    {},
  );

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      notifyToast(kind === "training" ? "Antrenman eklendi" : "Ders eklendi");
    }
    wasPending.current = isPending;
  }, [isPending, state, kind]);

  const { start, end } = monthRange(month);
  const lead = (weekdayOf(start) + 6) % 7;
  const daysInMonth = Number(end.slice(8, 10));
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
    ),
  ];

  const isOtherTime = !frequentTimes.includes(time);
  const accent = kind === "training" ? "bg-sky-600" : "bg-red-600";
  const { year, month: monthIndex } = splitMonth(month);

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200"
    >
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="time" value={time} />

      <div className="grid grid-cols-2 border-b border-neutral-200" role="tablist">
        {(["lesson", "training"] as const).map((value) => {
          const active = kind === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setKind(value)}
              className={`relative py-3 text-sm transition ${active ? "font-medium text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              {value === "training" ? "Antrenman" : "Ders"}
              {active ? (
                <span
                  className={`absolute inset-x-6 bottom-0 h-0.5 rounded-full ${value === "training" ? "bg-sky-600" : "bg-red-600"}`}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="space-y-5 p-4">
        <div role="group" aria-label="Gün">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, -1))}
              aria-label="Önceki ay"
              className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Chevron direction="left" />
            </button>
            <p className="text-sm font-medium text-neutral-900">
              {MONTHS_TR[monthIndex - 1]} {year}
            </p>
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, 1))}
              aria-label="Sonraki ay"
              className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Chevron direction="right" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center">
            {WEEK_HEAD.map((label) => (
              <span key={label} className="pb-1 text-[11px] text-neutral-400">
                {label}
              </span>
            ))}

            {cells.map((value, index) => {
              if (!value) return <span key={`lead-${index}`} />;

              const mark = marks[value];
              const selected = value === day;
              const isToday = value === today;
              const done = mark?.lesson || mark?.training;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDay(value)}
                  aria-pressed={selected}
                  aria-label={dayTitle(value)}
                  className={[
                    "relative flex h-11 flex-col items-center justify-center rounded-xl font-mono text-[15px] tabular-nums transition",
                    selected
                      ? "bg-neutral-900 text-white"
                      : mark?.lesson
                        ? "bg-red-600 font-medium text-white"
                        : mark?.training
                          ? "bg-sky-600 font-medium text-white"
                          : value < today
                            ? "text-neutral-400 hover:bg-neutral-100"
                            : "text-neutral-800 hover:bg-neutral-100",
                    isToday && !selected
                      ? done
                        ? "ring-2 ring-neutral-900 ring-offset-1"
                        : "ring-1 ring-neutral-900 ring-inset"
                      : "",
                  ].join(" ")}
                >
                  {Number(value.slice(8, 10))}
                  {/*
                    Yapılan gün zaten dolu renkte; nokta sadece seçiliyken (zemin
                    siyah) ya da aynı gün hem ders hem antrenman varken çıkıyor.
                  */}
                  <span className="absolute bottom-1.5 flex gap-0.5">
                    {mark?.lesson && selected ? (
                      <span className="h-1 w-1 rounded-full bg-red-500" />
                    ) : null}
                    {mark?.training && (selected || mark.lesson) ? (
                      <span
                        className={`h-1 w-1 rounded-full ${selected ? "bg-sky-500" : "bg-white"}`}
                      />
                    ) : null}
                    {mark?.planned && !done ? (
                      <span
                        className={`h-1 w-1 rounded-full ring-1 ${selected ? "ring-white" : "ring-neutral-500"}`}
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-xs text-neutral-500">
            {day === today ? `Bugün, ${dayTitle(day)}` : dayTitle(day)}
          </p>
        </div>

        <div role="group" aria-label="Saat">
          <p className="text-xs text-neutral-500">Saat</p>
          {/* Sık saatler + "Diğer…" hep tek satır, eşit genişlikte */}
          <div
            className="mt-2 grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${frequentTimes.length + 1}, minmax(0, 1fr))`,
            }}
          >
            {frequentTimes.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTime(value)}
                aria-pressed={time === value}
                className={`rounded-xl py-2 font-mono text-base leading-[22px] tabular-nums transition ${time === value ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
              >
                {value}
              </button>
            ))}

            <select
              value={isOtherTime ? time : ""}
              onChange={(event) => {
                if (event.target.value) setTime(event.target.value);
              }}
              aria-label="Başka bir saat"
              className={`w-full min-w-0 appearance-none rounded-xl py-2 text-center text-base leading-[22px] outline-none transition [text-align-last:center] ${isOtherTime ? "bg-neutral-900 font-mono text-white tabular-nums" : "bg-neutral-100 text-neutral-700"}`}
            >
              <option value="">Diğer…</option>
              {ALL_TIMES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          name="note"
          maxLength={200}
          placeholder={
            kind === "training" ? "Ne çalıştın? Kol, bacak…" : "Not ekle"
          }
          aria-label="Not"
          className="w-full border-b border-neutral-200 bg-transparent pb-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />

        <button
          type="submit"
          disabled={isPending}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60 ${accent}`}
        >
          {isPending
            ? "Ekleniyor…"
            : kind === "training"
              ? "Antrenmanı ekle"
              : "Dersi ekle"}
        </button>

        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
