/**
 * Etsy defteri şimdilik tek para birimiyle (₺) çalışıyor.
 * Çoklu kur gerekirse burası ve `etsy_entries.amount` birlikte değişir.
 */
export const CURRENCY = "TRY";

const full = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return full.format(value);
}

/** Kuruşu olmayan, dar alanlara sığan gösterim */
export function formatMoneyShort(value: number): string {
  return Number.isInteger(value) ? compact.format(value) : full.format(value);
}

/**
 * Form girdisini sayıya çevirir. Hem "1234.56" hem "1.234,56" kabul edilir —
 * klavyeden hangisi geldiyse doğru okusun diye.
 */
export function parseAmount(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;

  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const value = Number.parseFloat(normalized.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;

  return Math.round(value * 100) / 100;
}
