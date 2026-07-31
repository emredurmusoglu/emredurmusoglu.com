/**
 * Panel parolası için hash üretir.
 *
 *   npm run panel:hash -- 'senin-parolan'
 *
 * Çıktıyı .env.local ve Vercel'deki PANEL_PASSWORD_HASH değişkenine yapıştır.
 * Parolanın kendisi hiçbir yere yazılmaz.
 */
import { hashPassword } from "../lib/auth/password";

const password = process.argv[2];

if (!password) {
  console.error("Kullanım: npm run panel:hash -- 'parolan'");
  process.exit(1);
}

if (password.length < 12) {
  console.error("Parola en az 12 karakter olmalı.");
  process.exit(1);
}

hashPassword(password).then((hash) => {
  console.log("\nPANEL_PASSWORD_HASH=" + hash + "\n");
});
