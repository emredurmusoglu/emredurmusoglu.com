#!/usr/bin/env node
// Cloudflare'e yükleme (taşıma 6). Mac'ten tek komut, Davetiva'daki gibi:
//
//   npm run -s cf:yukle            Derler ve yükler (gizli değerler dahil).
//   npm run -s cf:yukle -- --dene  Aynısı ama hiçbir şey göndermez (wrangler --dry-run).
//
// Sırası: .cf-gizli.env kontrolü → temiz derleme (opennextjs-cloudflare build,
// DATABASE_URL .cf-gizli.env'den) → derleme çıktısından .env değerlerinin
// silinmesi ve sızıntı taraması → geçiş koruması → yükleme (sayfa önbelleği
// R2'ye, revalidations tablosu D1'e, Worker ve gizli değerleri Cloudflare'e).
// Değerler ekrana yazılmaz. Yüklenen adresler wrangler.jsonc "routes"ta.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { resolveCname } from "node:dns/promises";
import { createInterface } from "node:readline/promises";
import { DOSYA, oku, denetle, workerDegerleri } from "./cf-gizli.mjs";

const DENE = process.argv.includes("--dene");
const CIKTI = ".open-next";
const ASIL_ADRES = "www.emredurmusoglu.com";

function dur(mesaj) {
  console.error(`\n✗ ${mesaj}`);
  process.exit(1);
}

function calistir(komut, args, env = process.env) {
  return spawnSync(komut, args, { stdio: "inherit", env }).status === 0;
}

function git(...args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

// 1. Gizli değerler
if (!existsSync(DOSYA)) dur(`${DOSYA} yok. Önce: npm run -s cf:gizli hazirla`);
const degerler = oku(DOSYA);
if (denetle(degerler).hata) dur("Gizli değerlerde eksik/hata var. Ayrıntı: npm run -s cf:gizli kontrol");

const dal = git("rev-parse", "--abbrev-ref", "HEAD");
const surum = git("rev-parse", "--short", "HEAD");
const kirli = git("status", "--porcelain") !== "";
console.log(`Yüklenecek kod: ${dal} @ ${surum}${kirli ? " (commitlenmemiş değişiklikler de dahil)" : ""}`);
if (DENE) console.log("Kuru deneme: hiçbir şey gönderilmeyecek.");

// 2. Derleme. DATABASE_URL ortamdan verilir; Next ortamdakini .env.local'a
// tercih eder, yani sayfalar kesinlikle .cf-gizli.env'deki veritabanından üretilir.
rmSync(CIKTI, { recursive: true, force: true }); // eski çıktı karışmasın
console.log("\nDerleniyor (next build + OpenNext)...");
const derlemeEnv = { ...process.env, DATABASE_URL: degerler.DATABASE_URL.trim() };
if (!calistir("npx", ["--no-install", "opennextjs-cloudflare", "build"], derlemeEnv)) {
  dur("Derleme başarısız, hiçbir şey yüklenmedi.");
}

// 3. Derleme çıktısı
if (!existsSync(join(CIKTI, "worker.js")) || !existsSync(join(CIKTI, "assets", "_headers"))) {
  dur(`Derleme çıktısı beklenen yerde değil (${CIKTI}/worker.js, ${CIKTI}/assets/_headers).`);
}

// OpenNext .env dosyalarındaki değerleri Worker koduna gömüyor (next-env.mjs).
// Canlıda hepsi gizli değer olarak geliyor; koda hiçbiri girmesin.
const envDosyasi = join(CIKTI, "cloudflare", "next-env.mjs");
if (!existsSync(envDosyasi)) dur(`${envDosyasi} bulunamadı; OpenNext'in çıktısı değişmiş olabilir.`);
writeFileSync(
  envDosyasi,
  "// cf:yukle boşalttı: canlıda değerler Worker'ın gizli değerlerinden gelir.\n" +
    "export const production = {};\nexport const development = {};\nexport const test = {};\n",
);

// Sızıntı taraması: bilinen gizli değerlerin hiçbiri çıktıda geçmesin.
const gizliler = new Set();
for (const kaynak of [DOSYA, ".env.local", ".env", ".env.production", ".env.production.local", ".dev.vars"]) {
  for (const v of Object.values(oku(kaynak))) if (v.trim().length >= 16) gizliler.add(v.trim());
}
const sizan = [];
(function tara(klasor) {
  for (const ad of readdirSync(klasor)) {
    const yol = join(klasor, ad);
    const bilgi = statSync(yol);
    if (bilgi.isDirectory()) tara(yol);
    else if (bilgi.size < 50 * 1024 * 1024) {
      const icerik = readFileSync(yol);
      if ([...gizliler].some((g) => icerik.includes(g))) sizan.push(yol);
    }
    if (/^\.env|^\.dev\.vars$|^\.cf-gizli/.test(ad)) sizan.push(yol);
  }
})(CIKTI);
if (sizan.length) dur(`Derleme çıktısında gizli değer var, yükleme durduruldu:\n  ${sizan.join("\n  ")}`);
console.log(`\n✓ Derleme tamam, çıktıda gizli değer yok (${gizliler.size} değer tarandı).`);

// 4. Adresler ve geçiş koruması
const ayar = JSON.parse(readFileSync("wrangler.jsonc", "utf8").replace(/^\s*\/\/.*$/gm, ""));
const adresler = (ayar.routes ?? []).map((r) => (typeof r === "string" ? r : r.pattern));
console.log(`Adres: ${adresler.join(", ") || "(yok: Worker hiçbir adrese bağlı değil)"}`);

// www hâlâ Vercel'i gösteriyorsa bu yükleme canlı siteyi Cloudflare'e taşır.
if (!DENE && adresler.includes(ASIL_ADRES) && (await vercelde(ASIL_ADRES))) {
  console.log(`
⚠ GEÇİŞ: Bu yükleme emredurmusoglu.com ve www'yu Vercel'den Cloudflare'e taşır.
  Devam etmeden önce Cloudflare → emredurmusoglu.com:
   1. Rules → Redirect Rules: emredurmusoglu.com → https://www.emredurmusoglu.com (301, yol ve sorgu korunur)
   2. SSL/TLS → Edge Certificates → Always Use HTTPS: açık
  Yükleme www ve kökü Workers Route olarak bağlar; trafik, DNS'te bu iki kaydın
  bulutu turuncuya (Proxied) çevrilince Cloudflare'e geçer. Geri dönüş: bulutu
  griye (DNS only) çevirmek.`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const cevap = (await rl.question('\nHepsi tamamsa "gecis" yaz: ')).trim();
  rl.close();
  if (cevap !== "gecis") dur("Geçiş yapılmadı, hiçbir şey yüklenmedi.");
}

// 5. Yükleme. Gizli değerler geçici bir dosyadan, iş bitince silinir.
const klasor = mkdtempSync(join(tmpdir(), "cf-yukle-"));
let basarili = false;
try {
  const gizli = join(klasor, "worker.json");
  writeFileSync(gizli, JSON.stringify(workerDegerleri(degerler)), { mode: 0o600 });
  basarili = DENE
    ? // Kuru denemede OpenNext'in deploy'u kullanılmaz: o, önbelleği R2'ye
      // gerçekten yazıyor.
      calistir("npx", ["--no-install", "wrangler", "deploy", "--dry-run", "--secrets-file", gizli])
    : calistir("npx", ["--no-install", "opennextjs-cloudflare", "deploy", "--secrets-file", gizli]);
} finally {
  rmSync(klasor, { recursive: true, force: true });
}
if (!basarili) dur("Yükleme başarısız.");

if (DENE) console.log("\n✓ Kuru deneme tamam. Gerçek yükleme: npm run -s cf:yukle");
else console.log(`\n✓ Yüklendi: ${adresler.map((a) => `https://${a}`).join(", ") || "(adres yok)"}`);

/** Adres DNS'te Vercel'i mi gösteriyor (CNAME *vercel-dns*). Bilinemezse evet say. */
async function vercelde(adres) {
  try {
    return (await resolveCname(adres)).some((c) => c.includes("vercel"));
  } catch (e) {
    // Cloudflare'e geçince CNAME kalmaz (proxy'li kayıt): ENODATA.
    return !(e && (e.code === "ENODATA" || e.code === "ENOTFOUND"));
  }
}
