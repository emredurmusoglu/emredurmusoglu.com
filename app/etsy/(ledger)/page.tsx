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

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "income" | "expense" | "net";
}) {
  const color =
    tone === "income"
      ? "text-emerald-700"
      : tone === "expense"
        ? "text-rose-700"
        : value < 0
          ? "text-rose-700"
          : "text-neutral-900";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {monthLabel(month)}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {entries.length} kayıt · gelir gider defteri
          </p>
        </div>
        <p className="text-xs text-neutral-400">
          {year} net{" "}
          <span className="font-medium tabular-nums text-neutral-600">
            {formatMoney(yearIncome - yearExpense)}
          </span>
        </p>
      </header>

      <MonthChips selected={month} year={year} totals={yearTotals} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Gelir" value={incomeTotal} tone="income" />
        <StatCard label="Gider" value={expenseTotal} tone="expense" />
        <div className="col-span-2 md:col-span-1">
          <StatCard label="Net" value={incomeTotal - expenseTotal} tone="net" />
        </div>
      </div>

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
