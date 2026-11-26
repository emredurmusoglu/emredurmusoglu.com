#!/usr/bin/env node
// Workers Builds'in derleme komutu (npm run cf:ci). main'e her push'ta Cloudflare
// bunu çalıştırır, ardından ayrı bir adımda `npx opennextjs-cloudflare deploy`.
//
// DATABASE_URL, Workers Builds → Build variables and secrets'tan gelir (sayfalar
// derlemede veritabanından üretiliyor). Burada .env dosyası olmadığı için
// next-env.mjs zaten boş çıkar; yine de boşaltılır ve DATABASE_URL çıktıda
// aranır. Bir şey ters giderse derleme hata verir, yükleme adımı hiç çalışmaz.

import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { CIKTI, ciktiEksigi, envDosyasiniBosalt, sizintiTara } from "./cf-cikti.mjs";

function dur(mesaj) {
  console.error(`\n✗ ${mesaj}`);
  process.exit(1);
}

const url = process.env.DATABASE_URL?.trim();
if (!url) dur("DATABASE_URL yok. Workers Builds → Settings → Build → Build variables and secrets'a ekle.");
if (!/^postgres(ql)?:\/\/[^@]+@[^/]+\.neon\.(tech|build)\//.test(url)) {
  dur("DATABASE_URL bir Neon adresi değil.");
}

const commit = process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7);
console.log(`Derleniyor${commit ? ` (${process.env.WORKERS_CI_BRANCH ?? "?"} @ ${commit})` : ""}...`);

rmSync(CIKTI, { recursive: true, force: true });
if (spawnSync("npx", ["--no-install", "opennextjs-cloudflare", "build"], { stdio: "inherit" }).status !== 0) {
  dur("Derleme başarısız.");
}

const eksik = ciktiEksigi();
if (eksik) dur(eksik);
envDosyasiniBosalt();

const { sizan, taranan } = sizintiTara([url]);
if (sizan.length) dur(`Derleme çıktısında gizli değer var, yükleme durduruldu:\n  ${sizan.join("\n  ")}`);
console.log(`\n✓ Derleme tamam, çıktıda gizli değer yok (${taranan} değer tarandı).`);
