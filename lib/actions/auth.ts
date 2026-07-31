"use server";

import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export type LoginState = { error?: string };

/**
 * Basit kaba-kuvvet freni. Serverless'ta her instance kendi sayacını tutar,
 * yani mutlak bir koruma değil — tek kullanıcılı bir panel için yeterli bir
 * yavaşlatma. Daha sıkısı gerekirse Upstash Redis ile paylaşımlı sayaca geçilir.
 */
const attempts = { count: 0, blockedUntil: 0 };
const MAX_ATTEMPTS = 10;
const BLOCK_MS = 15 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const now = Date.now();
  if (now < attempts.blockedUntil) {
    const minutes = Math.ceil((attempts.blockedUntil - now) / 60000);
    return { error: `Çok fazla deneme. ${minutes} dakika sonra tekrar dene.` };
  }

  const password = formData.get("password");
  const next = formData.get("next");

  const storedHash = process.env.PANEL_PASSWORD_HASH;
  if (!storedHash) {
    return {
      error: "PANEL_PASSWORD_HASH tanımlı değil. `npm run panel:hash` ile üret.",
    };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Parola gerekli." };
  }

  const ok = await verifyPassword(password, storedHash);

  if (!ok) {
    attempts.count += 1;
    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.blockedUntil = now + BLOCK_MS;
      attempts.count = 0;
    }
    await sleep(500);
    return { error: "Parola hatalı." };
  }

  attempts.count = 0;
  await createSession();

  const target =
    typeof next === "string" && next.startsWith("/panel") ? next : "/panel";
  redirect(target);
}

export async function logout() {
  await destroySession();
  redirect("/panel/login");
}
