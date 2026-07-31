import "server-only";

import { Marked } from "marked";

/**
 * Markdown yalnızca panelden, yani senin tarafından yazılıyor. O yüzden ham
 * HTML'e izin var (video gömme vb. işine yarar). İçerik başka birine
 * açılırsa burada bir sanitize katmanı şart olur.
 */
const marked = new Marked({ gfm: true, breaks: true });

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}

/** Blog listesinde gösterilecek özet — excerpt boşsa içerikten türetilir */
export function deriveExcerpt(source: string, max = 180): string {
  const plain = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** Yaklaşık okuma süresi (dakika) */
export function readingTime(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
