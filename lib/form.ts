/** FormData'dan güvenli okuma için minik yardımcılar (zod'a gerek kalmasın diye). */

export function text(
  form: FormData,
  key: string,
  { max = 300 }: { max?: number } = {},
): string {
  const value = form.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function optionalText(
  form: FormData,
  key: string,
  { max = 20000 }: { max?: number } = {},
): string | null {
  const value = text(form, key, { max });
  return value.length ? value : null;
}

export function int(form: FormData, key: string): number | null {
  const value = form.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function bool(form: FormData, key: string): boolean {
  const value = form.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function date(form: FormData, key: string): Date | null {
  const value = form.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function tagList(form: FormData, key: string): string[] {
  const value = form.get(key);
  if (typeof value !== "string") return [];
  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 10),
    ),
  ];
}

const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  İ: "i",
};

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base || `kayit-${Date.now().toString(36)}`;
}
