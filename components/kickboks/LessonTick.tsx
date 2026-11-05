"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { markLessonDone } from "@/lib/actions/kickboks";

/**
 * Yapıldı işareti geri alınmadığı için tek dokunuşla atılmıyor: kutuya
 * yuvarlağa basınca satırda "Yapıldı / Vazgeç" çıkıyor, ancak onaylanınca kilitleniyor.
 * `data-asking` açıkken satırdaki sil düğmesi gizleniyor (LessonList).
 */
export function LessonTick({ id }: { id: number }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        aria-label="Yapıldı diye işaretle"
        className="h-7 w-7 shrink-0 rounded-full border-2 border-neutral-300 transition hover:border-neutral-900"
      />
    );
  }

  return (
    <form
      action={markLessonDone}
      data-asking
      className="flex shrink-0 items-center gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <ConfirmButton />
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="rounded-full px-2.5 py-1.5 text-xs text-neutral-500 transition hover:text-neutral-900"
      >
        Vazgeç
      </button>
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60"
    >
      {pending ? "…" : "Yapıldı"}
    </button>
  );
}
