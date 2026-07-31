import "server-only";

import { and, asc, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { notes, projects } from "@/lib/db/schema";

/**
 * Sitenin herkese açık tarafı buradan okur.
 *
 * Cache'leme sayfa seviyesinde: public route'ların hepsinde
 * `export const revalidate = 3600` var, yani Next sayfayı statik üretip
 * saklıyor — ziyaretçi başına DB'ye gidilmiyor. Panelden bir şey
 * yayınlandığında ilgili action `revalidatePath` ile o sayfaları anında
 * tazeliyor (bkz. lib/actions/notes.ts, lib/actions/projects.ts).
 */

export async function getPublicProjects() {
  return db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      accent: projects.accent,
      iconUrl: projects.iconUrl,
      url: projects.url,
    })
    .from(projects)
    .where(eq(projects.isPublic, true))
    .orderBy(asc(projects.sort), asc(projects.title));
}

export async function getPublicNotes() {
  return db
    .select({
      slug: notes.slug,
      title: notes.title,
      excerpt: notes.excerpt,
      tags: notes.tags,
      publishedAt: notes.publishedAt,
    })
    .from(notes)
    .where(and(eq(notes.isPublic, true), isNotNull(notes.publishedAt)))
    .orderBy(desc(notes.publishedAt));
}

export async function getPublicNote(slug: string) {
  const [row] = await db
    .select({
      slug: notes.slug,
      title: notes.title,
      excerpt: notes.excerpt,
      content: notes.content,
      tags: notes.tags,
      publishedAt: notes.publishedAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(
      and(
        eq(notes.slug, slug),
        eq(notes.isPublic, true),
        isNotNull(notes.publishedAt),
      ),
    );

  return row ?? null;
}
