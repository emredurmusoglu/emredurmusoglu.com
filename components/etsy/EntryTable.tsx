import { NoteText } from "@/components/etsy/NoteText";
import { deleteEntry } from "@/lib/actions/etsy";
import { userLabel } from "@/lib/auth/users";
import { formatDayShort } from "@/lib/date";
import type { EtsyEntryRow } from "@/lib/etsy/dal";
import { formatMoney } from "@/lib/money";

/**
 * Tek bir ayın gelir ya da gider dökümü.
 *
 * Tek bir işaretleme iki düzen veriyor: telefonda satır iki sıraya bölünüyor
 * (üstte açıklama + tutar, altta tarih/kategori/kişi), md'den itibaren
 * `md:contents` sayesinde aynı hücreler gerçek bir tablo ızgarasına oturuyor.
 * Böylece dar ekranda yatay kaydırma gerekmiyor.
 */
const gridCols =
  "grid-cols-[1fr_auto] md:grid-cols-[6rem_10rem_1fr_7.5rem_2rem]";
const rowClass = `grid ${gridCols} items-center gap-x-3 gap-y-1 px-4 py-3 md:gap-y-0 md:py-2.5`;

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
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Başlık satırı sadece tablo düzeninde anlamlı */}
          <div
            className={`hidden ${gridCols} items-center gap-x-3 border-b border-neutral-100 px-4 py-2 text-xs text-neutral-400 md:grid`}
            aria-hidden="true"
          >
            <span>Tarih</span>
            <span>Kategori</span>
            <span>Açıklama</span>
            <span className="text-right">Tutar</span>
            <span />
          </div>

          <ul>
            {entries.map((entry) => (
              <li
                key={entry.id}
                className={`group border-b border-neutral-50 last:border-0 ${rowClass}`}
              >
                {/* Telefonda tek meta satırı, md'de iki ayrı sütun */}
                <div className="order-3 flex min-w-0 items-center gap-2 text-xs text-neutral-400 md:order-none md:contents">
                  <span className="shrink-0 whitespace-nowrap tabular-nums md:text-sm md:text-neutral-500">
                    {formatDayShort(entry.occurredOn)}
                  </span>
                  <span className="min-w-0 truncate">
                    {entry.categoryName ? (
                      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
                        {entry.categoryName}
                      </span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </span>
                  <span className="shrink-0 truncate md:hidden">
                    {userLabel(entry.createdBy)}
                  </span>
                </div>

                <div className="order-1 min-w-0 text-sm md:order-none">
                  <NoteText note={entry.note} />
                  <span className="hidden text-xs text-neutral-400 md:block">
                    {userLabel(entry.createdBy)}
                  </span>
                </div>

                <span
                  className={`order-2 self-start whitespace-nowrap text-right text-sm font-medium tabular-nums md:order-none md:self-center ${amountColor}`}
                >
                  {formatMoney(entry.amount)}
                </span>

                <form action={deleteEntry} className="order-4 md:order-none">
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
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-400 shadow-sm">
          Bu ayda kayıt yok.
        </p>
      )}
    </section>
  );
}
