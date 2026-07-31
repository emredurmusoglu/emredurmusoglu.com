import type { MetadataRoute } from "next";

import { getPublicNotes } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/yazilar",
  "/vaktinde/privacy",
  "/vaktinde/support",
  "/vaktinde/terms",
  "/alarmix/privacy",
  "/alarmix/support",
  "/online/privacy",
  "/online/support",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getPublicNotes();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })),
    ...notes.map((note) => ({
      url: `${SITE_URL}/yazilar/${note.slug}`,
      lastModified: note.publishedAt ?? new Date(),
    })),
  ];
}
