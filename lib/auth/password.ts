// Not: burada bilerek `server-only` yok — `scripts/hash-password.ts` bu dosyayı
// Next dışında, düz node üzerinden import ediyor. `node:crypto` bağımlılığı
// zaten client bundle'a girmesini imkânsız kılıyor.
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/**
 * Parolayı `salt:hash` formatında hex string olarak döner.
 * Sadece `npm run panel:hash` scriptinde kullanılır — üretilen değer
 * PANEL_PASSWORD_HASH env değişkenine yazılır, parolanın kendisi hiçbir
 * yerde saklanmaz.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  let expected: Buffer;
  try {
    expected = Buffer.from(hashHex, "hex");
  } catch {
    return false;
  }
  if (expected.length !== KEY_LENGTH) return false;

  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), KEY_LENGTH);
  return timingSafeEqual(derived, expected);
}
