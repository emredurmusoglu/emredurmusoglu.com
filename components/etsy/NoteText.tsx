"use client";

import { useState } from "react";

/**
 * Açıklama tek satırda kısaltılıyor; dokununca aşağı doğru açılıyor.
 * Telefonda satırın yüksekliği sabit kalsın, ama metin de kaybolmasın diye.
 */
export function NoteText({ note }: { note: string | null }) {
  const [open, setOpen] = useState(false);

  if (!note) return <span className="text-neutral-300">—</span>;

  return (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      aria-expanded={open}
      className={[
        "w-full text-left text-neutral-800 transition",
        open ? "whitespace-pre-wrap break-words" : "truncate",
      ].join(" ")}
    >
      {note}
    </button>
  );
}
