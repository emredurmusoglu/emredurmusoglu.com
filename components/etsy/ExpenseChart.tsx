import type { EtsyEntryRow } from "@/lib/etsy/dal";
import { formatMoney } from "@/lib/money";

/**
 * Gider kalemlerinin ay içindeki dağılımı — büyükten küçüğe yatay çubuklar.
 *
 * Tek ölçü (tutar) gösterildiği ve her satır kendi adıyla etiketlendiği için
 * tek renk kullanılıyor: kategori başına ayrı renk burada bilgi taşımaz,
 * sadece gürültü olurdu. Sayısal döküm zaten üstteki tabloda duruyor.
 */
const MAX_ROWS = 8;

export function ExpenseChart({ entries }: { entries: EtsyEntryRow[] }) {
  const byCategory = new Map<string, number>();
  for (const entry of entries) {
    const name = entry.categoryName ?? "Kategorisiz";
    byCategory.set(name, (byCategory.get(name) ?? 0) + entry.amount);
  }

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  // Uzun kuyruk tek satırda toplanıyor — 15 satırlık çubuk grafiği kimse okumuyor.
  const rows =
    sorted.length > MAX_ROWS
      ? [
          ...sorted.slice(0, MAX_ROWS - 1),
          [
            `Diğer (${sorted.length - MAX_ROWS + 1})`,
            sorted
              .slice(MAX_ROWS - 1)
              .reduce((sum, [, value]) => sum + value, 0),
          ] as const,
        ]
      : sorted;

  const max = rows.length ? Math.max(...rows.map(([, value]) => value)) : 0;

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between px-3">
        <h2 className="text-sm font-medium text-neutral-700">
          Gider dağılımı
        </h2>
        <span className="text-xs text-neutral-400">kategoriye göre</span>
      </div>

      {rows.length ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <ul className="space-y-3">
            {rows.map(([name, value]) => {
              const share = total > 0 ? (value / total) * 100 : 0;

              return (
                <li key={name}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm text-neutral-700">
                      {name}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-neutral-500">
                      {formatMoney(value)}
                      <span className="ml-2 text-xs text-neutral-400">
                        %{share.toFixed(0)}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-400 shadow-sm">
          Grafiğe dönecek gider yok.
        </p>
      )}
    </section>
  );
}
