import "server-only";

import { and, asc, desc, eq, isNull, lte, ne, or, sql } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { endOfToday } from "@/lib/date";
import { db } from "@/lib/db";
import { notes, projects, tasks } from "@/lib/db/schema";

/**
 * Panel tarafındaki TÜM okuma/yazma buradan geçer ve her fonksiyon önce
 * `requireSession()` çağırır. Sayfa ya da action'da guard'ı unutmak
 * mümkün olmasın diye tek kapı bırakıldı.
 */

/* ------------------------------------------------------------------ projeler */

export async function listProjects() {
  await requireSession();
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sort), desc(projects.createdAt));
}

export async function getProject(id: number) {
  await requireSession();
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  return row ?? null;
}

/** Task/not formlarındaki proje seçici için hafif liste */
export async function listProjectOptions() {
  await requireSession();
  return db
    .select({ id: projects.id, title: projects.title, status: projects.status })
    .from(projects)
    .orderBy(asc(projects.sort), asc(projects.title));
}

/* -------------------------------------------------------------------- task'lar */

export type TaskFilter = {
  status?: "todo" | "doing" | "done";
  projectId?: number | null;
};

export async function listTasks(filter: TaskFilter = {}) {
  await requireSession();

  const conditions = [];
  if (filter.status) conditions.push(eq(tasks.status, filter.status));
  if (filter.projectId === null) conditions.push(isNull(tasks.projectId));
  else if (typeof filter.projectId === "number")
    conditions.push(eq(tasks.projectId, filter.projectId));

  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      note: tasks.note,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      doneAt: tasks.doneAt,
      sort: tasks.sort,
      createdAt: tasks.createdAt,
      projectId: tasks.projectId,
      projectTitle: projects.title,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      desc(tasks.priority),
      asc(tasks.dueDate),
      asc(tasks.sort),
      desc(tasks.createdAt),
    );
}

export type TaskRow = Awaited<ReturnType<typeof listTasks>>[number];

/** Vadesi bugün ya da geçmiş, henüz bitmemiş işler */
export async function listDueTasks() {
  await requireSession();

  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      note: tasks.note,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      projectId: tasks.projectId,
      projectTitle: projects.title,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(ne(tasks.status, "done"), lte(tasks.dueDate, endOfToday())))
    .orderBy(asc(tasks.dueDate), desc(tasks.priority));
}

export async function getTaskCounts() {
  await requireSession();
  const rows = await db
    .select({ status: tasks.status, count: sql<number>`count(*)::int` })
    .from(tasks)
    .groupBy(tasks.status);

  const counts = { todo: 0, doing: 0, done: 0 };
  for (const row of rows) counts[row.status] = row.count;
  return counts;
}

/* --------------------------------------------------------------------- notlar */

export async function listNotes() {
  await requireSession();
  return db
    .select({
      id: notes.id,
      slug: notes.slug,
      title: notes.title,
      excerpt: notes.excerpt,
      tags: notes.tags,
      isPublic: notes.isPublic,
      publishedAt: notes.publishedAt,
      updatedAt: notes.updatedAt,
      projectId: notes.projectId,
      projectTitle: projects.title,
    })
    .from(notes)
    .leftJoin(projects, eq(notes.projectId, projects.id))
    .orderBy(desc(notes.updatedAt));
}

export type NoteListRow = Awaited<ReturnType<typeof listNotes>>[number];

export async function getNote(id: number) {
  await requireSession();
  const [row] = await db.select().from(notes).where(eq(notes.id, id));
  return row ?? null;
}

export async function searchNotes(query: string) {
  await requireSession();
  const pattern = `%${query}%`;
  return db
    .select({
      id: notes.id,
      title: notes.title,
      excerpt: notes.excerpt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(
      or(
        sql`${notes.title} ilike ${pattern}`,
        sql`${notes.content} ilike ${pattern}`,
      ),
    )
    .orderBy(desc(notes.updatedAt))
    .limit(20);
}
