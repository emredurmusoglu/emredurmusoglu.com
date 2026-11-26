// OpenNext derleme çıktısının (.open-next) yüklemeden önceki son kontrolleri.
// Hem Mac'ten yüklemede (cf-yukle.mjs) hem Workers Builds'te (cf-ci.mjs) aynı.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const CIKTI = ".open-next";

/** Çıktı beklenen yerde mi; değilse hata mesajı döner. */
export function ciktiEksigi() {
  for (const yol of [join(CIKTI, "worker.js"), join(CIKTI, "assets", "_headers")]) {
    if (!existsSync(yol)) return `Derleme çıktısı beklenen yerde değil (${yol}).`;
  }
  const envDosyasi = join(CIKTI, "cloudflare", "next-env.mjs");
  if (!existsSync(envDosyasi)) return `${envDosyasi} bulunamadı; OpenNext'in çıktısı değişmiş olabilir.`;
  return null;
}

/**
 * OpenNext .env dosyalarındaki değerleri Worker koduna gömüyor (next-env.mjs).
 * Canlıda hepsi Worker'ın gizli değerlerinden geliyor; koda hiçbiri girmesin.
 */
export function envDosyasiniBosalt() {
  writeFileSync(
    join(CIKTI, "cloudflare", "next-env.mjs"),
    "// Boşaltıldı (scripts/cf-cikti.mjs): canlıda değerler Worker'ın gizli değerlerinden gelir.\n" +
      "export const production = {};\nexport const development = {};\nexport const test = {};\n",
  );
}

/** Verilen gizli değerlerden biri çıktıda geçen ya da .env benzeri dosyaların yolları. */
export function sizintiTara(gizliler) {
  const degerler = [...gizliler].filter((g) => g.length >= 16);
  const sizan = [];
  (function tara(klasor) {
    for (const ad of readdirSync(klasor)) {
      const yol = join(klasor, ad);
      const bilgi = statSync(yol);
      if (bilgi.isDirectory()) tara(yol);
      else if (bilgi.size < 50 * 1024 * 1024) {
        const icerik = readFileSync(yol);
        if (degerler.some((g) => icerik.includes(g))) sizan.push(yol);
      }
      if (/^\.env|^\.dev\.vars$|^\.cf-gizli/.test(ad)) sizan.push(yol);
    }
  })(CIKTI);
  return { sizan, taranan: degerler.length };
}
