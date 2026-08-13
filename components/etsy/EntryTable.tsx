import { deleteEntry } from "@/lib/actions/etsy";
import { userLabel } from "@/lib/auth/users";
import { formatDayShort } from "@/lib/date";
import type { EtsyEntryRow } from "@/lib/etsy/dal";
import { formatMoney } from "@/lib/money";

/**
 * Tek bir ayın gelir ya da gider dökümü.
 * Dar ekranda tablo yatay kaydırılıyor — satırlar sıkışıp okunmaz olmasın.
 */
export function EntryTable({
  title,
  entries,
  tone,
}: {
  title: string;
  entries: EtsyEntryRow[];
  tone: "income" | "expense";
}) {
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const amountColor = tone === "income" ? "text-emerald-700" : "text-neutral-900";

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between px-3">
        <h2 className="text-sm font-medium text-neutral-700">
          {title}
          {entries.length ? (
            <span className="ml-2 text-neutral-400">{entries.length}</span>
          ) : null}
        </h2>
        <span className={`text-sm font-medium tabular-nums ${amountColor}`}>
          {formatMoney(total)}
        </span>
      </div>

      {entries.length ? (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
                <th className="px-4 py-2 font-normal">Tarih</th>
                <th className="px-4 py-2 font-normal">Kategori</th>
                <th className="px-4 py-2 font-normal">Açıklama</th>
                <th className="px-4 py-2 text-right font-normal">Tutar</th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="group border-b border-neutral-50 last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-neutral-500">
                    {formatDayShort(entry.occurredOn)}
                  </td>
                  <td className="px-4 py-2.5">
                    {entry.categoryName ? (
                      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
                        {entry.categoryName}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="max-w-[1px] px-4 py-2.5">
                    <span className="block truncate text-neutral-800">
                      {entry.note || "—"}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {userLabel(entry.createdBy)}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-2.5 text-right font-medium tabular-nums ${amountColor}`}
                  >
                    {formatMoney(entry.amount)}
                  </td>
                  <td className="px-2 py-2.5">
                    <form action={deleteEntry}>
                      <input type="hidden" name="id" value={entry.id} />
                      <button
                        type="submit"
                        aria-label="Sil"
                        className="rounded-md p-1 text-neutral-300 transition hover:text-red-600 md:text-transparent md:group-hover:text-neutral-300"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-400 shadow-sm">
          Bu ayda kayıt yok.
        </p>
      )}
    </section>
  );
}
