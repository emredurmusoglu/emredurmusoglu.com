/**
 * Sitedeki "kaynak katmanı" için bileşenlerin ve sayfaların gerçek kodunu
 * okur, renklendirir ve her parçayı lib/source/<id>.json'a ayrı yazar — her
 * sayfa sadece kendi kodunu yüklesin diye. predev / prebuild ile kendiliğinden
 * çalışır; kod değişince arkada görünen kod da değişir.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type SnippetConfig = {
  file: string;
  /** Dosyada bu fonksiyonun gövdesi alınır (sondaki "}" dahil). */
  fn: string;
  /** Verilirse kod bu satırdan başlar — kartın arkasına sığsın diye. */
  from?: string;
  /** Verilirse kod, başlangıçtan sonra tam olarak bu olan ilk satırda biter. */
  until?: string;
  /** Tıklanınca parlayan satırlar: anahtar → satırda geçen metin. */
  focus: Record<string, string>;
};

const SNIPPETS: Record<string, SnippetConfig> = {
  contact: {
    file: "components/ContactButton.tsx",
    fn: "ContactButton",
    focus: { default: 'href="/iletisim"' },
  },
  home: {
    file: "app/page.tsx",
    fn: "Home",
    focus: {},
  },
  productPage: {
    file: "app/projeler/[slug]/page.tsx",
    fn: "ProductPage",
    focus: {},
  },
  productCta: {
    file: "app/projeler/[slug]/page.tsx",
    fn: "ProductPage",
    from: "{/* Kapanış */}",
    until: "</section>",
    focus: { default: 'href="/iletisim"' },
  },
  workPage: {
    file: "app/isler/[slug]/page.tsx",
    fn: "WorkPage",
    focus: {},
  },
  workCta: {
    file: "app/isler/[slug]/page.tsx",
    fn: "WorkPage",
    from: "{/* Kapanış */}",
    until: "</section>",
    focus: { default: 'href="/iletisim"' },
  },
  workCard: {
    file: "components/work/WorkCard.tsx",
    fn: "WorkCard",
    focus: { default: "href={`/isler/${work.slug}`}" },
  },
  notes: {
    file: "components/NotesSection.tsx",
    fn: "NotesSection",
    focus: { default: "href={`/yazilar/${note.slug}`}" },
  },
  projectCard: {
    file: "components/ProjectCard.tsx",
    fn: "ProjectCard",
    from: "const shell =",
    focus: {
      static: "if (project.comingSoon || !singleHref)",
      detail: "href={detailHref}",
      picker: "onClick={() => setPicking(true)}",
      store: "href={singleHref}",
    },
  },
};

// Kaba ama yeterli bir TSX renklendirici: arkada %5 opaklıkta duran kod için
// tam bir dil sözdizimi ağacına gerek yok.
const KEYWORDS =
  "const|let|var|return|if|else|export|default|function|import|from|type|null|undefined|true|false|typeof|new|await|async|as";
const RULES: [RegExp, string][] = [
  [/\/\/.*|\/\*[\s\S]*?\*\//y, "c"],
  [/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y, "s"],
  [new RegExp(`\\b(?:${KEYWORDS})\\b`, "y"), "k"],
  [/(?<=<\/?)[A-Za-z][\w.]*/y, "t"],
  [/[A-Za-z_][\w-]*(?==(?!=))/y, "a"],
  [/[A-Za-z_$][\w$]*(?=\()/y, "f"],
  [/[A-Z][\w$]*/y, "t"],
  [/\d+(?:\.\d+)?/y, "n"],
  [/[A-Za-z_$][\w$]*/y, ""],
  // Noktalama yorum başlangıcını (// ya da /*) yutmasın
  [/(?:(?!\/[/*])[{}()[\]<>/=;:,.?!&|+\-*])+/y, "p"],
  [/\s+/y, ""],
  [/./y, ""],
];

type Token = [string, string];

function tokenize(code: string): Token[][] {
  const lines: Token[][] = [[]];
  let i = 0;
  while (i < code.length) {
    for (const [re, cls] of RULES) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (!m || !m[0]) continue;
      i += m[0].length;
      // Çok satırlı yorum / string'ler satır satır bölünür.
      m[0].split("\n").forEach((part, n) => {
        if (n > 0) lines.push([]);
        if (!part) return;
        const line = lines[lines.length - 1];
        const last = line[line.length - 1];
        if (last && last[1] === cls) last[0] += part;
        else line.push([part, cls]);
      });
      break;
    }
  }
  return lines;
}

/**
 * Yorumları atar: yorumlar bizim kendimize notlarımız, sitede sergilenecek
 * kod değil. JSX yorumunun {} sarmalı da gider; sadece yorumdan oluşan
 * satırlar tamamen düşer. Kalan satırlar gerçek satır numaralarını korur.
 */
function stripComments(lines: Token[][], numbers: number[]) {
  const kept: { tokens: Token[]; n: number }[] = [];
  lines.forEach((line, i) => {
    const tokens: Token[] = line.map(([t, c]) => [t, c]);
    for (let j = 0; j < tokens.length; j++) {
      if (tokens[j][1] !== "c") continue;
      const prev = tokens[j - 1];
      const next = tokens[j + 1];
      if (prev?.[1] === "p" && prev[0].endsWith("{") && next?.[1] === "p" && next[0].startsWith("}")) {
        prev[0] = prev[0].slice(0, -1);
        next[0] = next[0].slice(1);
      }
      tokens[j][0] = "";
    }
    const cleaned = tokens.filter(([t]) => t !== "");
    // Satır sonundaki boşluklar (yorumdan önce kalan) temizlenir
    while (cleaned.length && cleaned[cleaned.length - 1][0].trim() === "") cleaned.pop();
    if (cleaned.length) {
      const last = cleaned[cleaned.length - 1];
      last[0] = last[0].replace(/\s+$/, "");
    }
    const hadCode = line.some(([t, c]) => c !== "c" && t.trim() !== "" && t.trim() !== "{" && t.trim() !== "}");
    const isBlank = line.every(([t]) => t.trim() === "");
    if (cleaned.length || isBlank) kept.push({ tokens: cleaned, n: numbers[i] });
    else if (hadCode) kept.push({ tokens: cleaned, n: numbers[i] });
  });
  // Yorum düşünce art arda kalan boş satırları teke indir
  return kept.filter((l, i) => l.tokens.length || !kept[i - 1] || kept[i - 1].tokens.length);
}

function extract(id: string, cfg: SnippetConfig) {
  const source = readFileSync(join(process.cwd(), cfg.file), "utf8").split("\n");
  const fnStart = source.findIndex((l) => l.includes(`function ${cfg.fn}(`));
  if (fnStart < 0) throw new Error(`${id}: ${cfg.fn} bulunamadı (${cfg.file})`);
  const start = cfg.from
    ? source.findIndex((l, i) => i > fnStart && l.includes(cfg.from!))
    : source[fnStart - 1]?.startsWith("/**")
      ? fnStart - 1
      : fnStart;
  const end = cfg.until
    ? source.findIndex((l, i) => i > start && l.trim() === cfg.until)
    : source.findIndex((l, i) => i > fnStart && l === "}");
  if (start < 0 || end < 0) throw new Error(`${id}: kod aralığı bulunamadı`);

  const raw = source.slice(start, end + 1);
  const kept = stripComments(
    tokenize(raw.join("\n")),
    raw.map((_, i) => start + 1 + i),
  );
  const text = kept.map((l) => l.tokens.map(([t]) => t).join(""));
  const focus: Record<string, number> = {};
  for (const [key, needle] of Object.entries(cfg.focus)) {
    const at = text.findIndex((l) => l.includes(needle));
    if (at < 0) throw new Error(`${id}: odak satırı yok → ${needle}`);
    focus[key] = at;
  }

  return {
    file: cfg.file,
    numbers: kept.map((l) => l.n),
    lines: kept.map((l) => l.tokens),
    focus,
  };
}

const dir = join(process.cwd(), "lib/source");
mkdirSync(dir, { recursive: true });
// Artık kullanılmayan parçalar ortada kalmasın
for (const f of readdirSync(dir)) {
  if (f.endsWith(".json") && !(f.slice(0, -5) in SNIPPETS)) rmSync(join(dir, f));
}
for (const [id, cfg] of Object.entries(SNIPPETS)) {
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(extract(id, cfg)) + "\n");
}
console.log(`kaynak katmanı: ${Object.keys(SNIPPETS).length} parça yazıldı`);
