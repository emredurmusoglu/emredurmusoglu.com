"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { notifyToast } from "@/components/panel/Toast";
import { createLesson, type LessonState } from "@/lib/actions/kickboks";

const fieldClass =
  "w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900";

export function AddLessonForm({
  today,
}: {
  /** Sunucudan geliyor: istemcide üretilirse saat dilimi kayması olabilir */
  today: string;
}) {
  const [kind, setKind] = useState<"lesson" | "training">("lesson");
  const [state, formAction, isPending] = useActionState<LessonState, FormData>(
    createLesson,
    {},
  );

  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      notifyToast(kind === "training" ? "Antrenman eklendi" : "Ders eklendi");
      // Tarih kalsın (aynı haftaya art arda ders girilebiliyor), not boşalsın.
      const note = formRef.current?.elements.namedItem("note");
      if (note instanceof HTMLInputElement) note.value = "";
    }
    wasPending.current = isPending;
  }, [isPending, state, kind]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
    >
      <input type="hidden" name="kind" value={kind} />

      {/* Antrenman ders hakkından düşmüyor, sadece grafikte sayılıyor. */}
      <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-0.5">
        {(["lesson", "training"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            aria-pressed={kind === value}
            className={[
              "rounded-lg px-3.5 py-1.5 text-sm transition",
              kind === value
                ? value === "training"
                  ? "bg-sky-600 font-medium text-white"
                  : "bg-red-600 font-medium text-white"
                : "text-neutral-500 hover:text-neutral-900",
            ].join(" ")}
          >
            {value === "training" ? "Antrenman" : "Ders"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_7rem] gap-2 sm:grid-cols-[10rem_7rem_1fr_auto]">
        <input
          type="date"
          name="day"
          defaultValue={today}
          required
          aria-label="Tarih"
          className={fieldClass}
        />

        <input
          type="time"
          name="time"
          step={300}
          required
          aria-label="Saat"
          className={`${fieldClass} tabular-nums`}
        />

        <input
          name="note"
          maxLength={200}
          placeholder={
            kind === "training"
              ? "Ne çalıştın? (kol, bacak…)"
              : "Not (isteğe bağlı)"
          }
          aria-label="Not"
          className={`${fieldClass} col-span-2 sm:col-span-1`}
        />

        <button
          type="submit"
          disabled={isPending}
          className="col-span-2 rounded-xl bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:col-span-1"
        >
          {isPending
            ? "Ekleniyor…"
            : kind === "training"
              ? "Antrenmanı ekle"
              : "Dersi ekle"}
        </button>
      </div>

      {state.error ? (
        <p role="alert" className="mt-2 px-1 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
