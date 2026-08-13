import "server-only";

import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";

import { requireEtsySession } from "@/lib/auth/session";
import { monthRange, type MonthKey } from "@/lib/date";
import { db } from "@/lib/db";
import { etsyCategories, etsyEntries } from "@/lib/db/schema";

/**
 * Etsy defterinin tüm okumaları burada. Panel tarafındaki `lib/dal.ts` ile
 * aynı kural geçerli: her fonksiyon önce oturumu doğruluyor, böylece
 * sayfada guard unutmak mümkün olmuyor.
 */

export type EntryKind = "income" | "expense";

export type EtsyEntryRow = {
  id: number;
  kind: EntryKind;
  amount: number;
  note: string | null;
  occurredOn: string;
  createdBy: string;
  categoryId: number | null;
  categoryName: string | null;
};

export type CategoryOption = { id: number; kind: EntryKind; name: string };

export async function listCategories(): Promise<CategoryOption[]> {
  await requireEtsySession();
  return db
    .select({
      id: etsyCategories.id,
      kind: etsyCategories.kind,
      name: etsyCategories.name,
    })
    .from(etsyCategories)
    .orderBy(asc(etsyCategories.sort), asc(etsyCategories.name));
}

/** Seçili ayın tüm kayıtları — gelir/gider ayrımı sayfada yapılıyor */
export async function listMonthEntries(
  month: MonthKey,
): Promise<EtsyEntryRow[]> {
  await requireEtsySession();
  const { start, end } = monthRange(month);

  const rows = await db
    .select({
      id: etsyEntries.id,
      kind: etsyEntries.kind,
      amount: etsyEntries.amount,
      note: etsyEntries.note,
      occurredOn: etsyEntries.occurredOn,
      createdBy: etsyEntries.createdBy,
      categoryId: etsyEntries.categoryId,
      categoryName: etsyCategories.name,
    })
    .from(etsyEntries)
    .leftJoin(etsyCategories, eq(etsyEntries.categoryId, etsyCategories.id))
    .where(
      and(gte(etsyEntries.occurredOn, start), lte(etsyEntries.occurredOn, end)),
    )
    .orderBy(desc(etsyEntries.occurredOn), desc(etsyEntries.id));

  return rows.map((row) => ({ ...row, amount: Number(row.amount) }));
}

export type MonthTotals = { month: MonthKey; income: number; expense: number };

/** Ay çipleri ve yıl özeti için: seçili yıldaki her ayın gelir/gider toplamı */
export async function listYearTotals(year: number): Promise<MonthTotals[]> {
  await requireEtsySession();

  const rows = await db
    .select({
      month: sql<string>`to_char(${etsyEntries.occurredOn}, 'YYYY-MM')`.as(
        "month",
      ),
      kind: etsyEntries.kind,
      total: sql<string>`sum(${etsyEntries.amount})`,
    })
    .from(etsyEntries)
    .where(
      and(
        gte(etsyEntries.occurredOn, `${year}-01-01`),
        lte(etsyEntries.occurredOn, `${year}-12-31`),
      ),
    )
    .groupBy(sql`1`, etsyEntries.kind);

  const byMonth = new Map<string, MonthTotals>();
  for (const row of rows) {
    const entry = byMonth.get(row.month) ?? {
      month: row.month,
      income: 0,
      expense: 0,
    };
    entry[row.kind === "income" ? "income" : "expense"] = Number(row.total);
    byMonth.set(row.month, entry);
  }

  return [...byMonth.values()];
}

/** Defterde kayıt bulunan yıllar — yıl seçicide gösterilir */
export async function listYears(): Promise<number[]> {
  await requireEtsySession();

  const rows = await db
    .select({
      year: sql<string>`to_char(${etsyEntries.occurredOn}, 'YYYY')`.as("year"),
    })
    .from(etsyEntries)
    .groupBy(sql`1`)
    .orderBy(sql`1 desc`);

  return rows.map((row) => Number(row.year));
}
