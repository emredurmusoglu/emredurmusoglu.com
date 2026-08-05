"use client";

import { useState } from "react";

/**
 * Uzun iş başlıkları listede tek satıra sığmıyor. Varsayılan olarak tek
 * satırda kesiliyor, üstüne basınca tamamı alt satırlara açılıyor.
 */
export function TaskTitle({
  title,
  done,
}: {
  title: string;
  done: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      title={open ? "Kapat" : "Tamamını göster"}
      className={[
        "min-w-0 flex-1 rounded text-left text-sm transition",
        open ? "whitespace-pre-wrap break-words" : "truncate",
        done ? "text-neutral-400 line-through" : "text-neutral-800",
      ].join(" ")}
    >
      {title}
    </button>
  );
}
