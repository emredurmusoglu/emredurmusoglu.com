import { AddEntryForm } from "@/components/etsy/AddEntryForm";
import { EntryTable } from "@/components/etsy/EntryTable";
import { ExpenseChart } from "@/components/etsy/ExpenseChart";
import { MonthChips } from "@/components/etsy/MonthChips";
import {
  currentMonth,
  dayKey,
  monthLabel,
  safeMonth,
  splitMonth,
} from "@/lib/date";
import { listCategories, listMonthEntries, listYearTotals } from "@/lib/etsy/dal";
import { formatMoney } from "@/lib/money";

function toneClass(tone: "income" | "expense" | "net", value: number) {
  if (tone === "income") return "text-emerald-700";
  if (tone === "expense") return "text-rose-700";
  return value < 0 ? "text-rose-700" : "text-neutral-900";
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "income" | "expense" | "net";
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-neutral-400">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${toneClass(tone, value)}`}
      >
        {formatMoney(value)}
      </p>
    </div>
  );
}

/**
 * Yıllık kutular bilerek aylıklardan farklı görünüyor: aynı üç rakam
 * iki kez yazılıyor, hangisinin ay hangisinin yıl olduğu karışmasın.
 */
function YearStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "income" | "expense" | "net";
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${toneClass(tone, value)}`}
      >
        {formatMoney(value)}
      </p>
    </div>
  );
}

export default async function EtsyLedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const month = safeMonth(m);
  const { year } = splitMonth(month);

  const [entries, categories, yearTotals] = await Promise.all([
    listMonthEntries(month),
    listCategories(),
    listYearTotals(year),
  ]);

  const income = entries.filter((entry) => entry.kind === "income");
  const expense = entries.filter((entry) => entry.kind === "expense");

  const incomeTotal = income.reduce((sum, entry) => sum + entry.amount, 0);
  const expenseTotal = expense.reduce((sum, entry) => sum + entry.amount, 0);

  const yearIncome = yearTotals.reduce((sum, row) => sum + row.income, 0);
  const yearExpense = yearTotals.reduce((sum, row) => sum + row.expense, 0);
  const yearNet = yearIncome - yearExpense;
  const filledMonths = yearTotals.filter(
    (row) => row.income > 0 || row.expense > 0,
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {monthLabel(month)}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {entries.length} kayıt · gelir gider defteri
        </p>
      </header>

      <MonthChips selected={month} year={year} totals={yearTotals} />

      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Bu ay · {monthLabel(month)}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Gelir" value={incomeTotal} tone="income" />
          <StatCard label="Gider" value={expenseTotal} tone="expense" />
          <div className="col-span-2 md:col-span-1">
            <StatCard
              label="Net"
              value={incomeTotal - expenseTotal}
              tone="net"
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="flex flex-wrap items-baseline gap-x-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          {year} toplamı
          <span className="font-normal normal-case tracking-normal text-neutral-400">
            {filledMonths} ayın toplamı
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <YearStatCard label="Yıllık gelir" value={yearIncome} tone="income" />
          <YearStatCard label="Yıllık gider" value={yearExpense} tone="expense" />
          <div className="col-span-2 md:col-span-1">
            <YearStatCard label="Yıllık net" value={yearNet} tone="net" />
          </div>
        </div>
      </section>

      {/*
        Geçmiş bir aya bakarken formun tarihi o ayın ilk gününe düşüyor:
        yoksa girilen kayıt bugüne yazılıp ekrandan kayboluyor.
      */}
      <AddEntryForm
        categories={categories}
        today={month === currentMonth() ? dayKey() : `${month}-01`}
      />

      <EntryTable title="Gelirler" entries={income} tone="income" />
      <EntryTable title="Giderler" entries={expense} tone="expense" />

      <ExpenseChart entries={expense} />
    </div>
  );
}
