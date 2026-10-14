"use server";

import { revalidatePath } from "next/cache";
import { eq, isNull } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { bool, int } from "@/lib/form";

function refresh() {
  // Rozet layout'ta olduğu için tüm panel tazelensin.
  revalidatePath("/panel", "layout");
}

export async function setMessageRead(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  await db
    .update(contactMessages)
    .set({ readAt: bool(form, "read") ? new Date() : null })
    .where(eq(contactMessages.id, id));

  refresh();
}

export async function markAllMessagesRead() {
  await requireSession();

  await db
    .update(contactMessages)
    .set({ readAt: new Date() })
    .where(isNull(contactMessages.readAt));

  refresh();
}

export async function deleteMessage(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  refresh();
}
