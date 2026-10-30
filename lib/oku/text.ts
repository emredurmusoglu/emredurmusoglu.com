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
  text: string;
  /** Kırmızı boyanan harfin `text` içindeki konumu */
  pivot: number;
  /** Bu kelime kaç kelimelik süre ekranda kalacak */
  weight: number;
  /** Cümlenin ilk kelimesi mi — geri/ileri cümle atlamaları buna bakıyor */
  sentenceStart: boolean;
  /** Paragrafın ilk kelimesi mi — bağlam görünümü paragrafları buna göre bölüyor */
  paraStart: boolean;
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
  if (letterCount(word) <= SPLIT_ABOVE) return [word];
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
  return [`${word.slice(0, cut)}-`, ...splitLongWord(word.slice(cut))];
}

function letterCount(word: string): number {
  let count = 0;
  for (const char of word) if (LETTER.test(char)) count++;
  return count;
}

export function tokenize(
  text: string,
  { focus, punctuationPause }: { focus: FocusMode; punctuationPause: boolean },
): Parsed {
  const tokens: Token[] = [];
  const paragraphs = splitParagraphs(text);

  paragraphs.forEach((paragraph, p) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    words.forEach((whole, w) => {
      splitLongWord(whole).forEach((word, part, pieces) => {
        const length = letterCount(word);
        // Uzun kelimeler daha uzun kalır; Türkçe ekli kelimeler için önemli.
        let weight = length > 7 ? Math.min(1 + (length - 7) * 0.08, 1.9) : 1;
        if (/\d/.test(word)) weight += 0.3;

        const isLastInParagraph =
          w === words.length - 1 && part === pieces.length - 1;
        if (punctuationPause) {
          if (isLastInParagraph && p < paragraphs.length - 1) weight += 1.6;
          else if (SENTENCE_END.test(word)) weight += 1.1;
          else if (CLAUSE_END.test(word)) weight += 0.5;
        }

        const previous = tokens[tokens.length - 1];
        tokens.push({
          text: word,
          pivot: pivotIndex(word, focus),
          weight,
          paraStart: w === 0 && part === 0,
          sentenceStart:
            part === 0 &&
            (w === 0 || !previous || SENTENCE_END.test(previous.text)),
          joinNext: part < pieces.length - 1 || undefined,
        });
      });
    });
  });

  // Molalar kelimeler arasında süreyi yeniden dağıtıyor ama toplamı uzatmıyor:
  // ortalama ağırlık 1 olsun ki "300 kelime/dk" gerçekten dakikada 300 kelime.
  const mean =
    tokens.reduce((sum, token) => sum + token.weight, 0) / (tokens.length || 1);
  for (const token of tokens) token.weight /= mean;

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
