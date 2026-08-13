import Link from "next/link";

import { MONTHS_TR_SHORT, monthKey, type MonthKey } from "@/lib/date";
import type { MonthTotals } from "@/lib/etsy/dal";

/**
 * Yıl gezinmesi + 12 ay çipi. Kayıt bulunan aylarda küçük bir nokta var,
 * böylece hangi ayda veri olduğu tek bakışta görünüyor.
 */
export function MonthChips({
  selected,
  year,
  totals,
}: {
  selected: MonthKey;
  year: number;
  totals: MonthTotals[];
}) {
  const filled = new Set(
    totals.filter((t) => t.income > 0 || t.expense > 0).map((t) => t.month),
  );

  const yearHref = (target: number) => `/etsy?m=${monthKey(target, 1)}`;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between px-1 pb-2">
        <Link
          href={yearHref(year - 1)}
          aria-label={`${year - 1} yılı`}
          className="rounded-lg px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          ‹
        </Link>
        <span className="text-sm font-medium tabular-nums text-neutral-700">
          {year}
        </span>
        <Link
          href={yearHref(year + 1)}
          aria-label={`${year + 1} yılı`}
          className="rounded-lg px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          ›
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-1 md:grid-cols-12">
        {MONTHS_TR_SHORT.map((label, index) => {
          const key = monthKey(year, index + 1);
          const active = key === selected;

          return (
            <Link
              key={key}
              href={`/etsy?m=${key}`}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs transition",
                active
                  ? "bg-neutral-900 font-medium text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
              ].join(" ")}
            >
              {label}
              <span
                aria-hidden="true"
                className={[
                  "h-1 w-1 rounded-full",
                  filled.has(key)
                    ? active
                      ? "bg-white/70"
                      : "bg-orange-400"
                    : "bg-transparent",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
