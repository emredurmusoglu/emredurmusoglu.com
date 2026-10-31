/**
 * Oku'nun metin motoru: yapıştırılan metni kelimelere böler, her kelimenin
 * odak harfini ve ekranda kalma süresini hesaplar.
 *
 * Süreler "kaç kelimelik süre" cinsinden (çarpan). Dakikadaki kelime hızı
 * değişince yeniden hesaplamaya gerek kalmasın diye milisaniyeye ancak
 * okuyucu çevirir.
 */

export type FocusMode = "optimal" | "center";

export type Token = {
  /** Sahnede gösterilen hali: parantezsiz, büyük sayılar gruplanmış */
  text: string;
  /** Metindeki asıl hali — bağlam görünümü bunu gösteriyor */
  source: string;
  /** Kırmızı boyanan harfin `text` içindeki konumu */
  pivot: number;
  /** Bu kelime kaç kelimelik süre ekranda kalacak */
  weight: number;
  /** Hız ne olursa olsun en az bu kadar milisaniye (sayılar için) */
  minMs: number;
  /** Cümlenin ilk kelimesi mi — geri/ileri cümle atlamaları buna bakıyor */
  sentenceStart: boolean;
  /** Paragrafın ilk kelimesi mi — bağlam görünümü paragrafları buna göre bölüyor */
  paraStart: boolean;
  /** Parantez içinde mi — sahne kenarlarında parantez gösteriliyor */
  aside: boolean;
  /** Bölünmüş uzun kelimenin parçası: bağlamda arkasına boşluk konmuyor */
  joinNext?: boolean;
};

export type Parsed = {
  tokens: Token[];
  /** suffix[i] = i'den sona kadar ağırlıkların toplamı; kalan süre O(1) */
  suffix: Float64Array;
};

const LETTER = /[\p{L}\p{N}]/u;
const SENTENCE_END = /[.!?…]["'”’»)\]]*$/u;
const CLAUSE_END = /[,;:—–]["'”’»)\]]*$/u;

/**
 * Paragrafları ayır. PDF'ten ya da e-postadan kopyalanan metinlerde satırlar
 * cümlenin ortasında kırılmış oluyor; tek satır sonu ancak önceki satır
 * noktalamayla bittiyse paragraf sayılıyor, yoksa boşluk.
 */
export function splitParagraphs(text: string): string[] {
  const blocks = text.replace(/\r\n?/g, "\n").split(/\n\s*\n/);
  const paragraphs: string[] = [];
  for (const block of blocks) {
    let current = "";
    for (const raw of block.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      if (current && (SENTENCE_END.test(current) || /^[-•*–]\s/.test(line))) {
        paragraphs.push(current);
        current = line;
      } else {
        current = current ? `${current} ${line}` : line;
      }
    }
    if (current) paragraphs.push(current);
  }
  return paragraphs;
}

/**
 * Göz bir kelimeye tam ortasından değil, biraz solundan bakar (Optimal
 * Recognition Point). Kısa kelimede 2. harf, uzunlarda ~%35'lik nokta.
 * "Tam orta" seçeneği isteyenler için duruyor.
 */
export function pivotIndex(word: string, mode: FocusMode): number {
  let first = -1;
  let last = -1;
  for (let i = 0; i < word.length; i++) {
    if (LETTER.test(word[i])) {
      if (first < 0) first = i;
      last = i;
    }
  }
  if (first < 0) return Math.floor((word.length - 1) / 2);
  const length = last - first + 1;
  if (mode === "center") return first + Math.floor((length - 1) / 2);
  const offset =
    length <= 1 ? 0 : length <= 5 ? 1 : length <= 9 ? 2 : length <= 13 ? 3 : 4;
  return first + offset;
}

/** Bundan uzun kelimeler ekrana sığsın diye heceden bölünüyor. */
const SPLIT_ABOVE = 15;
const CHUNK = 11;
const VOWEL = /[aeıioöuüâîûAEIİOÖUÜÂÎÛ]/;

/**
 * Türkçe hece kuralı: iki ünlü arasındaki tek ünsüz sonraki heceye geçer,
 * yani "ünsüz + ünlü"nün önü güvenli bir kesme noktası. Hedef uzunluğa en
 * yakın böyle bir nokta aranıyor; bulunamazsa düz kesiliyor.
 */
function splitLongWord(word: string): string[] {
  if (letterCount(word) <= SPLIT_ABOVE || /\d/.test(word)) return [word];
  const parts = Math.ceil(word.length / CHUNK);
  const target = Math.ceil(word.length / parts);
  let cut = target;
  for (let delta = 0; delta <= 3; delta++) {
    const found = [target - delta, target + delta].find(
      (i) =>
        i >= 4 &&
        word.length - i >= 4 &&
        LETTER.test(word[i - 1]) &&
        LETTER.test(word[i]) &&
        !VOWEL.test(word[i]) &&
        VOWEL.test(word[i + 1] ?? ""),
    );
    if (found !== undefined) {
      cut = found;
      break;
    }
  }
  return [word.slice(0, cut), ...splitLongWord(word.slice(cut))];
}

function letterCount(word: string, pattern = LETTER): number {
  let count = 0;
  for (const char of word) if (pattern.test(char)) count++;
  return count;
}

const ONLY_LETTER = /\p{L}/u;
const OPENERS = /^(["'“‘«]*)([([]+)/u;
const CLOSERS = /[)\]]+(?=["'”’»]*[.,;:!?…—–]*["'”’»]*$)/u;
const CURRENCY_SIGN = /[₺$€£]/u;
const CURRENCY_WORD = /^(tl|try|lira|usd|dolar|eur|euro|avro|sterlin|gbp)\b/iu;

/**
 * Göz büyük bir sayıyı rakam rakam okur. Binlik ayırıcıyla gruplanınca
 * "1534799" yerine "1.534.799" bir bakışta kavranıyor. Yıllar (4 hane),
 * 0 ile başlayan telefon/numaralar ve 11+ haneli kimlik/IBAN parçaları
 * olduğu gibi kalıyor; para birimi varsa 4 hane de gruplanıyor.
 */
function groupDigits(word: string, money: boolean): string {
  return word.replace(/(^|[^\d.,])(\d+)(?![.,]?\d)/gu, (match, before, run) => {
    if (run[0] === "0" || run.length > 10) return match;
    if (run.length < (money ? 4 : 5)) return match;
    return before + run.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });
}

/**
 * Rakamlı kelimenin ek süresi (kelime cinsinden). Kısa sayılar ("3 kişi")
 * neredeyse normal; hane arttıkça, birden çok sayı ("2009-2010") ya da
 * tarih ("12.05.2009") varsa artıyor.
 */
function numberCost(word: string): { extra: number; minMs: number } {
  const digits = letterCount(word, /\d/);
  if (!digits) return { extra: 0, minMs: 0 };
  if (digits <= 2) return { extra: 0.3, minMs: 0 };
  const numbers = word.match(/\d+(?:[.,]\d+)*/g)?.length ?? 1;
  const isDate = /\d{1,2}[./]\d{1,2}[./]\d{2,4}/.test(word);
  const extra =
    0.4 +
    0.35 * (Math.min(digits, 12) - 2) +
    0.35 * (numbers - 1) +
    (isDate ? 0.4 : 0);
  return {
    extra: Math.min(extra, 3.2),
    minMs: 200 + 50 * Math.min(digits, 12) + 60 * (numbers - 1),
  };
}

export function tokenize(
  text: string,
  { focus, punctuationPause }: { focus: FocusMode; punctuationPause: boolean },
): Parsed {
  const tokens: Token[] = [];
  // `base` ritim (uzunluk + noktalama), ortalaması 1'e çekiliyor;
  // `extra` içerik zorluğu (sayılar), hızı koruyup üstüne ekleniyor.
  const base: number[] = [];
  const extra: number[] = [];
  const paragraphs = splitParagraphs(text);

  paragraphs.forEach((paragraph, p) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let depth = 0;
    words.forEach((whole, w) => {
      // Parantez işaretleri kelimeden alınıp sahnenin kenarına taşınıyor;
      // "(örneğin" kelimesi ekranda kaymıyor, aradaki söz de belli oluyor.
      let display = whole;
      const opened = OPENERS.exec(display);
      const opens = opened ? opened[2].length : 0;
      if (opens) {
        display = opened![1] + display.slice(opened![0].length);
        depth += opens;
      }
      const aside = depth > 0;
      const closed = depth > 0 ? CLOSERS.exec(display) : null;
      if (closed) {
        display =
          display.slice(0, closed.index) +
          display.slice(closed.index + closed[0].length);
        depth = Math.max(0, depth - closed[0].length);
      }
      if (!display || !LETTER.test(display)) display = whole;

      const money =
        CURRENCY_SIGN.test(whole) || CURRENCY_WORD.test(words[w + 1] ?? "");
      display = groupDigits(display, money).replace(/(\d)-(?=\d)/g, "$1–");
      const cost = numberCost(whole);

      const sourceParts = splitLongWord(whole);
      const displayParts =
        sourceParts.length > 1
          ? splitLongWord(display).map((part, i, all) =>
              i < all.length - 1 ? `${part}-` : part,
            )
          : [display];
      const pieces =
        displayParts.length === sourceParts.length ? sourceParts : [whole];

      pieces.forEach((source, part) => {
        const shown = pieces.length > 1 ? displayParts[part] : display;
        const length = letterCount(shown, cost.extra ? ONLY_LETTER : LETTER);
        // Uzun kelimeler daha uzun kalır; Türkçe ekli kelimeler için önemli.
        let weight = length > 7 ? Math.min(1 + (length - 7) * 0.08, 1.9) : 1;

        const isLast = part === pieces.length - 1;
        const isLastInParagraph = w === words.length - 1 && isLast;
        if (punctuationPause && isLast) {
          if (isLastInParagraph && p < paragraphs.length - 1) weight += 1.6;
          else if (SENTENCE_END.test(whole)) weight += 1.1;
          else if (CLAUSE_END.test(whole) || closed) weight += 0.5;
          else if (OPENERS.test(words[w + 1] ?? "")) weight += 0.35;
        }

        let bonus = part === 0 ? cost.extra : 0;
        // Büyük bir sayıdan sonra göz bir an toparlanıyor.
        const previous = tokens[tokens.length - 1];
        if (previous && previous.minMs >= 360 && part === 0) bonus += 0.2;

        tokens.push({
          text: shown,
          source,
          pivot: pivotIndex(shown, focus),
          weight: 0,
          minMs: part === 0 ? cost.minMs : 0,
          paraStart: w === 0 && part === 0,
          sentenceStart:
            part === 0 &&
            (w === 0 || !previous || SENTENCE_END.test(previous.source)),
          aside,
          joinNext: !isLast || undefined,
        });
        base.push(weight);
        extra.push(bonus);
      });
    });
  });

  // Molalar kelimeler arasında süreyi yeniden dağıtıyor ama toplamı uzatmıyor:
  // ortalama ağırlık 1 olsun ki "300 kelime/dk" gerçekten dakikada 300 kelime.
  // Sayıların ek süresi bunun dışında: onlar gerçekten daha uzun sürüyor.
  const mean =
    base.reduce((sum, weight) => sum + weight, 0) / (base.length || 1);
  tokens.forEach((token, i) => {
    token.weight = base[i] / mean + extra[i];
  });

  const suffix = new Float64Array(tokens.length + 1);
  for (let i = tokens.length - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] + tokens[i].weight;
  }

  return { tokens, suffix };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** "3 dk", "1 sa 5 dk", "40 sn" */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds} sn`;
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} sa ${rest} dk` : `${hours} sa`;
}

/**
 * Başlık verilmediyse metnin ilk satırından türet: ilk cümle ya da
 * ilk birkaç kelime, 60 karakteri geçmeden.
 */
export function deriveTitle(text: string): string {
  const firstLine = text.trim().split("\n")[0]?.trim() ?? "";
  const firstSentence = firstLine.split(/(?<=[.!?…])\s/)[0] ?? firstLine;
  if (firstSentence.length <= 60) return firstSentence || "Adsız metin";
  const cut = firstSentence.slice(0, 60);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 30 ? cut.slice(0, lastSpace) : cut).replace(/[,;:\s]+$/, "")}…`;
}
