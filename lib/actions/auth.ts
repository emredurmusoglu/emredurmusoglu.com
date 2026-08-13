"use server";

import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { findUser } from "@/lib/auth/users";

export type LoginState = { error?: string };

/**
 * Basit kaba-kuvvet freni. Serverless'ta her instance kendi sayacını tutar,
 * yani mutlak bir koruma değil — küçük bir panel için yeterli bir
 * yavaşlatma. Daha sıkısı gerekirse Upstash Redis ile paylaşımlı sayaca geçilir.
 */
const attempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 10;
const BLOCK_MS = 15 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Ortak giriş akışı: kullanıcıyı bulur, parolayı doğrular, oturumu açar.
 * Hata mesajları bilerek genel — hangi kullanıcının var olduğunu sızdırmasın.
 */
async function authenticate(
  username: string,
  password: unknown,
): Promise<LoginState> {
  const now = Date.now();
  const gate = attempts.get(username) ?? { count: 0, blockedUntil: 0 };

  if (now < gate.blockedUntil) {
    const minutes = Math.ceil((gate.blockedUntil - now) / 60000);
    return { error: `Çok fazla deneme. ${minutes} dakika sonra tekrar dene.` };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Parola gerekli." };
  }

  const user = findUser(username);
  const storedHash = user ? process.env[user.hashEnv] : undefined;

  if (user && !storedHash) {
    return {
      error: `${user.hashEnv} tanımlı değil. \`npm run panel:hash\` ile üret.`,
    };
  }

  const ok = Boolean(
    user && storedHash && (await verifyPassword(password, storedHash)),
  );

  if (!ok || !user) {
    const count = gate.count + 1;
    attempts.set(
      username,
      count >= MAX_ATTEMPTS
        ? { count: 0, blockedUntil: now + BLOCK_MS }
        : { count, blockedUntil: 0 },
    );
    await sleep(500);
    return { error: "Kullanıcı adı ya da parola hatalı." };
  }

  attempts.delete(username);
  await createSession(user.username);
  return {};
}

/** /panel girişi — kullanıcı adı sorulmuyor, tek sahibi var. */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = await authenticate("emre", formData.get("password"));
  if (result.error) return result;

  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith("/panel") ? next : "/panel";
  redirect(target);
}

/** /etsy girişi — üç kullanıcı da kendi adıyla giriyor. */
export async function etsyLogin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username");
  const result = await authenticate(
    typeof username === "string" ? username.trim().toLowerCase() : "",
    formData.get("password"),
  );
  if (result.error) return result;

  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith("/etsy") ? next : "/etsy";
  redirect(target);
}

export async function logout() {
  await destroySession();
  redirect("/panel/login");
}

export async function etsyLogout() {
  await destroySession();
  redirect("/etsy/login");
}
