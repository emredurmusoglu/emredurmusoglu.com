"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";

import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { bool, int, optionalText, slugify, tagList, text } from "@/lib/form";

function refreshPanel() {
  revalidatePath("/panel");
  revalidatePath("/panel/notes");
}

/** Yayınlanan bir not değiştiğinde public tarafı da tazele */
function refreshPublic(slug: string) {
  revalidatePath("/yazilar");
  revalidatePath(`/yazilar/${slug}`);
  // Ana sayfadaki "son yazılar" listesi
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

/** Slug çakışırsa -2, -3 diye artırır */
async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = slugify(base);

  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const [clash] = await db
      .select({ id: notes.id })
      .from(notes)
      .where(
        excludeId
          ? and(eq(notes.slug, candidate), ne(notes.id, excludeId))
          : eq(notes.slug, candidate),
      )
      .limit(1);

    if (!clash) return candidate;
  }

  return `${root}-${Date.now().toString(36)}`;
}

export async function createNote(form: FormData) {
  await requireSession();

  const title = text(form, "title", { max: 300 }) || "Başlıksız not";
  const slug = await uniqueSlug(title);

  const [created] = await db
    .insert(notes)
    .values({
      title,
      slug,
      content: optionalText(form, "content", { max: 100000 }) ?? "",
      projectId: int(form, "projectId"),
      tags: tagList(form, "tags"),
    })
    .returning({ id: notes.id });

  refreshPanel();
  redirect(`/panel/notes/${created.id}`);
}

export async function updateNote(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  const [current] = await db
    .select({ slug: notes.slug, title: notes.title, isPublic: notes.isPublic })
    .from(notes)
    .where(eq(notes.id, id));
  if (!current) return;

  const title = text(form, "title", { max: 300 }) || current.title;

  // Başlık değiştiyse slug'ı da güncelle — ancak not zaten yayındaysa
  // dışarıdaki linkler kırılmasın diye slug sabit kalır.
  const slug =
    !current.isPublic && title !== current.title
      ? await uniqueSlug(title, id)
      : current.slug;

  await db
    .update(notes)
    .set({
      title,
      slug,
      excerpt: optionalText(form, "excerpt", { max: 500 }),
      content: optionalText(form, "content", { max: 100000 }) ?? "",
      projectId: int(form, "projectId"),
      tags: tagList(form, "tags"),
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id));

  refreshPanel();
  revalidatePath(`/panel/notes/${id}`);
  if (current.isPublic) refreshPublic(slug);
}

export async function setNotePublished(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  const isPublic = bool(form, "isPublic");

  const [current] = await db
    .select({ publishedAt: notes.publishedAt, slug: notes.slug })
    .from(notes)
    .where(eq(notes.id, id));
  if (!current) return;

  await db
    .update(notes)
    .set({
      isPublic,
      // İlk yayında tarihi damgala; sonra geri alıp tekrar yayınlarsan
      // orijinal yayın tarihi korunur.
      publishedAt: isPublic ? (current.publishedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id));

  refreshPanel();
  revalidatePath(`/panel/notes/${id}`);
  refreshPublic(current.slug);
}

export async function deleteNote(form: FormData) {
  await requireSession();

  const id = int(form, "id");
  if (!id) return;

  const [current] = await db
    .select({ isPublic: notes.isPublic, slug: notes.slug })
    .from(notes)
    .where(eq(notes.id, id));

  await db.delete(notes).where(eq(notes.id, id));

  refreshPanel();
  if (current?.isPublic) refreshPublic(current.slug);
  redirect("/panel/notes");
}
