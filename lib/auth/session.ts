import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { findUser, type Role } from "./users";
import { SESSION_COOKIE } from "./session.shared";

export { SESSION_COOKIE };

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 gün

export type Session = { username: string; role: Role };

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET tanımlı değil ya da 32 karakterden kısa. `openssl rand -base64 48` ile üret.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(username: string): Promise<void> {
  const user = findUser(username);
  if (!user) throw new Error(`Tanımsız kullanıcı: ${username}`);

  const expiresAt = new Date(Date.now() + MAX_AGE_SECONDS * 1000);

  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.username)
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
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });

    // Çok kullanıcıya geçmeden önce token'ın subject'i sabit "owner" idi.
    // Eski cookie'lerin geçerli kalması için o değeri emre'ye eşliyoruz.
    const sub = payload.sub === "owner" ? "emre" : payload.sub;
    if (typeof sub !== "string") return null;

    const user = findUser(sub);
    if (!user) return null;

    // Rol her zaman kayıttan okunuyor; token'daki değere güvenilmiyor.
    return { username: user.username, role: user.role };
  } catch {
    return null;
  }
});

/**
 * Panel içindeki her sayfa / server action bunu çağırır.
 * Asıl yetki kontrolü burasıdır — proxy sadece yönlendirme kolaylığı sağlar.
 *
 * Sadece `owner` geçer: Etsy defterine eklenen kullanıcılar panele giremez.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session || session.role !== "owner") redirect("/panel/login");
  return session;
}

/** Etsy defteri: kayıtlı üç kullanıcının hepsi okuyup yazabilir. */
export async function requireEtsySession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/etsy/login");
  return session;
}

/**
 * Etsy defterinin yönetim işleri (kategoriler) sadece sahibinde.
 * Giriş yapmış ama yetkisi olmayan kullanıcı deftere geri gönderiliyor.
 */
export async function requireEtsyOwner(): Promise<Session> {
  const session = await requireEtsySession();
  if (session.role !== "owner") redirect("/etsy");
  return session;
}
