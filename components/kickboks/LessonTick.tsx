"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { markLessonDone } from "@/lib/actions/kickboks";

/**
 * Yapıldı işareti geri alınmadığı için tek dokunuşla atılmıyor: kutuya
 * basınca satırda "✓ Yapıldı / Vazgeç" çıkıyor, ancak onaylanınca kilitleniyor.
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
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-neutral-300 bg-white transition hover:border-red-500"
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
        className="rounded-lg px-2 py-1.5 text-xs text-neutral-500 transition hover:text-neutral-900"
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
      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? "…" : "✓ Yapıldı"}
    </button>
  );
}
