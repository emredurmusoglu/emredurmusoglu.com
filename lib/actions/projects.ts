"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { bool, int, optionalText, slugify, text } from "@/lib/form";

const STATUSES = ["idea", "active", "paused", "shipped"] as const;
type Status = (typeof STATUSES)[number];

function refresh() {
  revalidatePath("/panel");
  revalidatePath("/panel/projects");
  // Ana sayfadaki proje kartları da buradan besleniyor
  revalidatePath("/");
}

function readStatus(form: FormData): Status {
  const value = text(form, "status", { max: 12 });
  return (STATUSES as readonly string[]).includes(value)
    ? (value as Status)
    : "idea";
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = slugify(base);

  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const [clash] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        excludeId
          ? and(eq(projects.slug, candidate), ne(projects.id, excludeId))
          : eq(projects.slug, candidate),
      )
      .limit(1);

    if (!clash) return candidate;
  }

  return `${root}-${Date.now().toString(36)}`;
}

export async function createProject(form: FormData) {
  await requireSession();

  const title = text(form, "title", { max: 160 });
  if (!title) return;

  await db.insert(projects).values({
    title,
    slug: await uniqueSlug(title),
    description: optionalText(form, "description", { max: 2000 }),
    status: readStatus(form),
    url: optionalText(form, "url", { max: 500 }),
    iconUrl: optionalText(form, "iconUrl", { max: 255 }),
    accent: optionalText(form, "accent", { max: 120 }),
    isPublic: bool(form, "isPublic"),
    sort: int(form, "sort") ?? 0,
  });

  refresh();
}

export async function updateProject(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  const title = text(form, "title", { max: 160 });
  if (!id || !title) return;

  await db
    .update(projects)
    .set({
      title,
      description: optionalText(form, "description", { max: 2000 }),
      status: readStatus(form),
      url: optionalText(form, "url", { max: 500 }),
      iconUrl: optionalText(form, "iconUrl", { max: 255 }),
      accent: optionalText(form, "accent", { max: 120 }),
      isPublic: bool(form, "isPublic"),
      sort: int(form, "sort") ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  refresh();
}

export async function deleteProject(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  // Şemada onDelete: "set null" — projeye bağlı task ve notlar silinmez,
  // sadece bağları kopar.
  await db.delete(projects).where(eq(projects.id, id));
  refresh();
}
