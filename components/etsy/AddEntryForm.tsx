"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { notifyToast } from "@/components/panel/Toast";
import { createEntry, type EntryState } from "@/lib/actions/etsy";
import type { CategoryOption } from "@/lib/etsy/dal";

const fieldClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900";

/**
 * Tek form, iki kayıt türü. Gelir/gider seçimi kategorileri de filtreliyor —
 * gider kategorisi gelire yazılamasın diye (sunucu tarafında da doğrulanıyor).
 */
export function AddEntryForm({
  categories,
  today,
}: {
  categories: CategoryOption[];
  /** Sunucudan geliyor: istemcide üretilirse saat dilimi kayması olabilir */
  today: string;
}) {
  const [kind, setKind] = useState<"expense" | "income">("expense");
  const [state, formAction, isPending] = useActionState<EntryState, FormData>(
    createEntry,
    {},
  );

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) notifyToast("Eklendi");
    wasPending.current = isPending;
  }, [isPending, state]);

  const options = categories.filter((category) => category.kind === kind);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
    >
      <input type="hidden" name="kind" value={kind} />

      <div className="mb-3 inline-flex rounded-xl bg-neutral-100 p-0.5">
        {(["expense", "income"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            aria-pressed={kind === value}
            className={[
              "rounded-lg px-3.5 py-1.5 text-sm transition",
              kind === value
                ? value === "income"
                  ? "bg-emerald-600 font-medium text-white"
                  : "bg-neutral-900 font-medium text-white"
                : "text-neutral-500 hover:text-neutral-900",
            ].join(" ")}
          >
            {value === "income" ? "Gelir" : "Gider"}
          </button>
        ))}
      </div>

      <div className="grid gap-2 md:grid-cols-[7rem_9rem_1fr_1.4fr_auto]">
        <input
          name="amount"
          inputMode="decimal"
          required
          placeholder="Tutar ₺"
          aria-label="Tutar"
          className={`${fieldClass} tabular-nums`}
        />

        <input
          type="date"
          name="occurredOn"
          defaultValue={today}
          required
          aria-label="Tarih"
          className={fieldClass}
        />

        <select
          name="categoryId"
          defaultValue=""
          aria-label="Kategori"
          className={fieldClass}
        >
          <option value="">Kategorisiz</option>
          {options.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="note"
          maxLength={300}
          placeholder="Açıklama (isteğe bağlı)"
          aria-label="Açıklama"
          className={fieldClass}
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {isPending ? "Ekleniyor…" : "Ekle"}
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
