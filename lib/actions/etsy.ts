"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { requireEtsyOwner, requireEtsySession } from "@/lib/auth/session";
import { dayKey } from "@/lib/date";
import { db } from "@/lib/db";
import { etsyCategories, etsyEntries } from "@/lib/db/schema";
import { int, optionalText, text } from "@/lib/form";
import { parseAmount } from "@/lib/money";

function refresh() {
  revalidatePath("/etsy");
  revalidatePath("/etsy/kategoriler");
}

function readKind(form: FormData): "income" | "expense" | null {
  const kind = text(form, "kind", { max: 10 });
  return kind === "income" || kind === "expense" ? kind : null;
}

export type EntryState = { error?: string };

export async function createEntry(
  _prevState: EntryState,
  form: FormData,
): Promise<EntryState> {
  const session = await requireEtsySession();

  const kind = readKind(form);
  if (!kind) return { error: "Gelir mi gider mi seçilmedi." };

  const amount = parseAmount(text(form, "amount", { max: 20 }));
  if (amount === null) return { error: "Geçerli bir tutar gir." };

  const day = text(form, "occurredOn", { max: 10 });
  const occurredOn = /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : dayKey();

  // Kategori başka bir türe aitse (ör. gelir formunda gider kategorisi)
  // sessizce boş bırakılıyor — tablo tutarsız kalmasın.
  const categoryId = int(form, "categoryId");
  let validCategoryId: number | null = null;
  if (categoryId !== null) {
    const [row] = await db
      .select({ id: etsyCategories.id })
      .from(etsyCategories)
      .where(
        and(eq(etsyCategories.id, categoryId), eq(etsyCategories.kind, kind)),
      );
    validCategoryId = row?.id ?? null;
  }

  await db.insert(etsyEntries).values({
    kind,
    amount: amount.toFixed(2),
    note: optionalText(form, "note", { max: 300 }),
    occurredOn,
    categoryId: validCategoryId,
    createdBy: session.username,
  });

  refresh();
  return {};
}

export async function deleteEntry(form: FormData) {
  await requireEtsySession();

  const id = int(form, "id");
  if (!id) return;

  await db.delete(etsyEntries).where(eq(etsyEntries.id, id));
  refresh();
}

export async function createCategory(form: FormData) {
  await requireEtsyOwner();

  const kind = readKind(form);
  const name = text(form, "name", { max: 80 });
  if (!kind || !name) return;

  await db
    .insert(etsyCategories)
    .values({ kind, name })
    .onConflictDoNothing({
      target: [etsyCategories.kind, etsyCategories.name],
    });

  refresh();
}

export async function renameCategory(form: FormData) {
  await requireEtsyOwner();

  const id = int(form, "id");
  const name = text(form, "name", { max: 80 });
  if (!id || !name) return;

  await db
    .update(etsyCategories)
    .set({ name })
    .where(eq(etsyCategories.id, id));

  refresh();
}

/** Kategori silinince kayıtları silmiyoruz; sadece kategorisiz kalıyorlar. */
export async function deleteCategory(form: FormData) {
  await requireEtsyOwner();

  const id = int(form, "id");
  if (!id) return;

  await db.delete(etsyCategories).where(eq(etsyCategories.id, id));
  refresh();
}
