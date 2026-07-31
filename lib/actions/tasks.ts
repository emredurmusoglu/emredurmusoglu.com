"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { bool, date, int, optionalText, text } from "@/lib/form";

function refresh() {
  revalidatePath("/panel");
  revalidatePath("/panel/tasks");
  revalidatePath("/panel/projects");
}

export async function createTask(form: FormData) {
  await requireSession();

  const title = text(form, "title", { max: 300 });
  if (!title) return;

  await db.insert(tasks).values({
    title,
    note: optionalText(form, "note", { max: 5000 }),
    projectId: int(form, "projectId"),
    priority: Math.min(Math.max(int(form, "priority") ?? 0, 0), 2),
    dueDate: date(form, "dueDate"),
  });

  refresh();
}

export async function setTaskStatus(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  const next = text(form, "status", { max: 10 });
  if (!id || !["todo", "doing", "done"].includes(next)) return;

  const status = next as "todo" | "doing" | "done";
  await db
    .update(tasks)
    .set({ status, doneAt: status === "done" ? new Date() : null })
    .where(eq(tasks.id, id));

  refresh();
}

/** Listedeki checkbox için: todo/doing <-> done arası geçiş */
export async function toggleTask(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  const done = bool(form, "done");
  await db
    .update(tasks)
    .set({
      status: done ? "done" : "todo",
      doneAt: done ? new Date() : null,
    })
    .where(eq(tasks.id, id));

  refresh();
}

export async function updateTask(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  const title = text(form, "title", { max: 300 });
  if (!id || !title) return;

  await db
    .update(tasks)
    .set({
      title,
      note: optionalText(form, "note", { max: 5000 }),
      projectId: int(form, "projectId"),
      priority: Math.min(Math.max(int(form, "priority") ?? 0, 0), 2),
      dueDate: date(form, "dueDate"),
    })
    .where(eq(tasks.id, id));

  refresh();
}

export async function deleteTask(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  await db.delete(tasks).where(eq(tasks.id, id));
  refresh();
}

/** Tamamlanmış işleri topluca temizler */
export async function clearDoneTasks() {
  await requireSession();
  await db.delete(tasks).where(eq(tasks.status, "done"));
  refresh();
}
