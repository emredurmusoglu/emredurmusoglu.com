/**
 * Sunucu UTC'de çalışıyor (Vercel), sen İstanbul'dasın. "Bugün" hesabı ve tüm
 * tarih gösterimleri bu yüzden sabit bir zaman diliminden yapılır — yoksa
 * gece yarısı civarı işler yanlış güne düşer.
 */
export const TZ = "Europe/Istanbul";

function offsetFor(date: Date, tz: string): string {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;

  if (!part || part === "GMT") return "+00:00";
  return part.replace("GMT", "");
}

/** Verilen anın, hedef zaman dilimindeki "YYYY-MM-DD" karşılığı */
export function dayKey(date: Date = new Date(), tz: string = TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Hedef zaman diliminde bugünün son anı (UTC instant olarak) */
export function endOfToday(tz: string = TZ): Date {
  const now = new Date();
  return new Date(`${dayKey(now, tz)}T23:59:59.999${offsetFor(now, tz)}`);
}

export function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** `<input type="date">` için değer */
export function toDateInput(date: Date | null): string {
  return date ? dayKey(date) : "";
}

/* ------------------------------------------------------------------ ay bazlı */

/** "YYYY-MM" — Etsy defterinde seçili ayın anahtarı */
export type MonthKey = string;

export const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export const MONTHS_TR_SHORT = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

export function currentMonth(tz: string = TZ): MonthKey {
  return dayKey(new Date(), tz).slice(0, 7);
}

/** Geçersiz girdide bu ayı döner — URL'den gelen değer doğrudan kullanılmasın */
export function safeMonth(input: string | undefined): MonthKey {
  if (!input || !/^\d{4}-(0[1-9]|1[0-2])$/.test(input)) return currentMonth();
  const year = Number(input.slice(0, 4));
  return year >= 2000 && year <= 2100 ? input : currentMonth();
}

export function splitMonth(month: MonthKey): { year: number; month: number } {
  return { year: Number(month.slice(0, 4)), month: Number(month.slice(5, 7)) };
}

export function monthKey(year: number, month: number): MonthKey {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function monthLabel(month: MonthKey): string {
  const { year, month: m } = splitMonth(month);
  return `${MONTHS_TR[m - 1]} ${year}`;
}

/** Ayın ilk ve son günü, "YYYY-MM-DD" olarak (SQL aralık filtresi için) */
export function monthRange(month: MonthKey): { start: string; end: string } {
  const { year, month: m } = splitMonth(month);
  const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return {
    start: `${month}-01`,
    end: `${month}-${String(last).padStart(2, "0")}`,
  };
}

export function formatDayShort(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return `${date} ${MONTHS_TR_SHORT[month - 1]} ${String(year).slice(2)}`;
}

export type DueLabel = { text: string; tone: "overdue" | "today" | "soon" | "later" };

export function describeDue(due: Date | null): DueLabel | null {
  if (!due) return null;

  const today = dayKey();
  const target = dayKey(due);

  const diffDays = Math.round(
    (Date.parse(`${target}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86_400_000,
  );

  if (diffDays < 0) {
    const n = Math.abs(diffDays);
    return { text: n === 1 ? "1 gün gecikti" : `${n} gün gecikti`, tone: "overdue" };
  }
  if (diffDays === 0) return { text: "Bugün", tone: "today" };
  if (diffDays === 1) return { text: "Yarın", tone: "soon" };
  if (diffDays <= 7) return { text: `${diffDays} gün sonra`, tone: "soon" };

  return { text: formatDate(due), tone: "later" };
}
