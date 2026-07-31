import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { SESSION_COOKIE } from "./session.shared";

export { SESSION_COOKIE };

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 gün

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET tanımlı değil ya da 32 karakterden kısa. `openssl rand -base64 48` ile üret.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<void> {
  const expiresAt = new Date(Date.now() + MAX_AGE_SECONDS * 1000);

  const token = await new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/**
 * Cookie'yi doğrular. Geçersizse null döner.
 * `cache()` sayesinde aynı request içinde birden çok çağrılsa da bir kez çalışır.
 */
export const getSession = cache(async (): Promise<{ role: "owner" } | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.sub !== "owner") return null;
    return { role: "owner" };
  } catch {
    return null;
  }
});

/**
 * Panel içindeki her sayfa / server action bunu çağırır.
 * Asıl yetki kontrolü burasıdır — middleware sadece yönlendirme kolaylığı sağlar.
 */
export async function requireSession(): Promise<{ role: "owner" }> {
  const session = await getSession();
  if (!session) redirect("/panel/login");
  return session;
}
