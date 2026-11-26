#!/usr/bin/env node
// Cloudflare gizli değerleri (taşıma 6). Davetiva'daki düzenin aynısı.
//
// Tek dosya: .cf-gizli.env (git'e girmez, sadece senin okuyabileceğin izinle).
// Bu betik değerleri ASLA ekrana yazmaz; sadece adını ve durumunu gösterir.
//
//   npm run -s cf:gizli hazirla   Dosyayı oluşturur / eksik satırları ekler.
//                                 Değerleri .env.local'dan alır (oradaki
//                                 veritabanı canlı Neon). SESSION_SECRET'i
//                                 yeni ve rastgele üretir: Cloudflare'de
//                                 herkes bir kez yeniden giriş yapar.
//   npm run -s cf:gizli kontrol   Eksik / hatalı biçimli değerleri listeler.
//   npm run -s cf:gizli yukle     Değerleri Worker'a yükler (Worker ilk
//                                 yüklemeden sonra var olur; ilk seferde
//                                 cf:yukle bunu kendisi yapar).

import { readFileSync, writeFileSync, existsSync, chmodSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

// CF_GIZLI_DOSYA sadece denemeler için (sahte değerlerle).
export const DOSYA = process.env.CF_GIZLI_DOSYA || ".cf-gizli.env";

// Hepsi Worker'a gizli değer olarak gider. DATABASE_URL derlemede de
// kullanılır (ana sayfa ve yazılar derlemede veritabanından üretiliyor).
export const ALANLAR = [
  { ad: "DATABASE_URL", bicim: "neon", ipucu: ".env.local'dan alındı (canlı Neon)" },
  { ad: "SESSION_SECRET", bicim: "uzun", ipucu: "betik yeni üretti, değiştirme" },
  { ad: "PANEL_PASSWORD_HASH", bicim: "hash", ipucu: ".env.local'dan alındı. Yeni parola: npm run panel:hash -- 'parola'" },
  { ad: "ETSY_DRYAAKY_PASSWORD_HASH", bicim: "hash", ipucu: ".env.local'dan alındı" },
  { ad: "ETSY_ISMAILCAN_PASSWORD_HASH", bicim: "hash", ipucu: ".env.local'dan alındı" },
  { ad: "RESEND_API_KEY", bicim: "re_", ipucu: ".env.local'dan alındı (Resend → API Keys)" },
];

// Değeri göstermeden biçim kontrolü. Hata metni döner, sorun yoksa null.
export function bicimHatasi(alan, deger) {
  const v = deger.trim();
  switch (alan.bicim) {
    case "neon": {
      let host = "";
      try {
        const u = new URL(v);
        if (!/^postgres(ql)?:$/.test(u.protocol)) return "postgresql:// ile başlamalı";
        host = u.hostname;
      } catch {
        return "geçerli bir bağlantı adresi değil";
      }
      // Yerel Postgres canlıya gitmesin; Worker zaten sadece Neon'a konuşabilir.
      return /\.neon\.(tech|build)$/.test(host) ? null : "Neon adresi değil (yerel veritabanı olabilir)";
    }
    case "uzun": return v.length >= 32 ? null : "en az 32 karakter olmalı";
    case "hash": return /^[0-9a-f]{16,}:[0-9a-f]{64,}$/.test(v) ? null : "salt:hash biçiminde değil (npm run panel:hash)";
    case "re_": return v.startsWith("re_") ? null : '"re_" ile başlamalı';
    default: return null;
  }
}

/** Kontrol sonucu: { satirlar: [{ad, durum, not}], hata: sayı } */
export function denetle(degerler) {
  const satirlar = [];
  let hata = 0;
  for (const alan of ALANLAR) {
    const v = (degerler[alan.ad] ?? "").trim();
    let durum = "dolu";
    let not = "";
    if (!v) {
      durum = "EKSİK";
      not = alan.ipucu;
      hata++;
    } else {
      const b = bicimHatasi(alan, v);
      if (b) {
        durum = "HATALI";
        not = b;
        hata++;
      }
    }
    satirlar.push({ ad: alan.ad, durum, not });
  }
  return { satirlar, hata };
}

/** Worker'a gidecek değerler. */
export function workerDegerleri(degerler) {
  const out = {};
  for (const a of ALANLAR) out[a.ad] = (degerler[a.ad] ?? "").trim();
  return out;
}

export function oku(yol) {
  return existsSync(yol) ? parse(readFileSync(yol)) : {};
}

function hazirla() {
  const mevcut = oku(DOSYA);
  const yerel = oku(".env.local");
  const kaynak = {
    DATABASE_URL: yerel.DATABASE_URL,
    SESSION_SECRET: randomBytes(48).toString("base64"),
    PANEL_PASSWORD_HASH: yerel.PANEL_PASSWORD_HASH,
    ETSY_DRYAAKY_PASSWORD_HASH: yerel.ETSY_DRYAAKY_PASSWORD_HASH,
    ETSY_ISMAILCAN_PASSWORD_HASH: yerel.ETSY_ISMAILCAN_PASSWORD_HASH,
    RESEND_API_KEY: yerel.RESEND_API_KEY,
  };

  const satirlar = [
    "# emredurmusoglu.com canlı gizli değerleri (Cloudflare taşıması 6). GIT'E GİRMEZ, kimseyle paylaşma.",
    '# Değer değiştirmek için: AD="değer". Sonra: npm run -s cf:gizli kontrol',
    "",
  ];
  let eklenen = 0;
  for (const a of ALANLAR) {
    satirlar.push(`# ${a.ipucu}`);
    const v = mevcut[a.ad] ?? kaynak[a.ad] ?? "";
    if (!(a.ad in mevcut) && v) eklenen++;
    satirlar.push(`${a.ad}=${JSON.stringify(v)}`);
  }
  writeFileSync(DOSYA, satirlar.join("\n") + "\n", { mode: 0o600 });
  chmodSync(DOSYA, 0o600);
  console.log(`${DOSYA} hazır (${eklenen} değer dolduruldu, var olanlara dokunulmadı).`);
  kontrol();
}

function kontrol() {
  if (!existsSync(DOSYA)) {
    console.error(`${DOSYA} yok. Önce: npm run -s cf:gizli hazirla`);
    process.exit(1);
  }
  const { satirlar, hata } = denetle(oku(DOSYA));
  for (const s of satirlar) {
    console.log(`  ${s.durum === "dolu" ? "✓" : "✗"} ${s.ad.padEnd(30)} ${s.durum.padEnd(7)} ${s.not}`);
  }
  console.log(hata ? `\n${hata} sorun var. ${DOSYA} dosyasını düzeltip tekrar çalıştır.` : "\nHepsi tamam.");
  return hata;
}

function yukle() {
  if (kontrol()) process.exit(1);
  const klasor = mkdtempSync(join(tmpdir(), "cf-gizli-"));
  try {
    const yol = join(klasor, "worker.json");
    writeFileSync(yol, JSON.stringify(workerDegerleri(oku(DOSYA))), { mode: 0o600 });
    const r = spawnSync("npx", ["--no-install", "wrangler", "secret", "bulk", yol], { stdio: "inherit" });
    if (r.status !== 0) {
      console.error(
        "\nYükleme başarısız. Worker henüz hiç yüklenmediyse bu normal: ilk yüklemeyi npm run -s cf:yukle yapar, değerleri de birlikte gönderir.",
      );
      process.exit(1);
    }
  } finally {
    rmSync(klasor, { recursive: true, force: true });
  }
}

// Sadece doğrudan çalıştırılınca (cf-yukle.mjs bu dosyayı içe aktarıyor).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const komut = process.argv[2];
  if (komut === "hazirla") hazirla();
  else if (komut === "kontrol") process.exit(kontrol() ? 1 : 0);
  else if (komut === "yukle") yukle();
  else {
    console.log("Kullanım: npm run -s cf:gizli hazirla | kontrol | yukle");
    process.exit(1);
  }
}
