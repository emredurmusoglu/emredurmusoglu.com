"use server";

import { PREFERENCES } from "@/lib/contact";
import { text } from "@/lib/form";

const TO = "emredurmusoglu1@gmail.com";
const FROM = "Site İletişim <iletisim@emredurmusoglu.com>";

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string; values: ContactValues };

type ContactValues = {
  name: string;
  email: string;
  phone: string;
  preference: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Rakam, boşluk, tire, parantez ve baştaki + serbest; 7–20 karakter.
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * İletişim formu → Resend üzerinden Gmail'e mail.
 * SDK yerine düz fetch: tek bir istek için bağımlılık eklemeye gerek yok.
 */
export async function sendContact(
  _prev: ContactState,
  form: FormData,
): Promise<ContactState> {
  const preference = text(form, "preference", { max: 20 });
  const values: ContactValues = {
    name: text(form, "name", { max: 120 }),
    email: text(form, "email", { max: 200 }),
    phone: text(form, "phone", { max: 30 }),
    preference: (PREFERENCES as readonly string[]).includes(preference)
      ? preference
      : "E-posta",
    message: text(form, "message", { max: 5000 }),
  };

  // Bal küpü: insanlar görmez, botlar doldurur. Bota başarılı gibi görün.
  if (text(form, "website")) return { status: "sent" };

  if (!values.name || !values.email || !values.message) {
    return { status: "error", message: "Lütfen tüm alanları doldurun.", values };
  }
  if (!EMAIL_RE.test(values.email)) {
    return { status: "error", message: "E-posta adresi geçerli görünmüyor.", values };
  }
  if (values.phone && !PHONE_RE.test(values.phone)) {
    return { status: "error", message: "Telefon numarası geçerli görünmüyor.", values };
  }
  if (values.preference !== "E-posta" && !values.phone) {
    return {
      status: "error",
      message: `${values.preference} ile dönüş için telefon numaranızı yazın.`,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY tanımlı değil");
    return {
      status: "error",
      message: `Mesaj şu an gönderilemedi. Doğrudan ${TO} adresine yazabilirsiniz.`,
      values,
    };
  }

  const html = `
    <p><strong>Ad:</strong> ${escapeHtml(values.name)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(values.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(values.phone || "—")}</p>
    <p><strong>İletişim tercihi:</strong> ${escapeHtml(values.preference)}</p>
    <p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: values.email,
      subject: `Siteden mesaj: ${values.name}`,
      text: `Ad: ${values.name}\nE-posta: ${values.email}\nTelefon: ${values.phone || "—"}\nİletişim tercihi: ${values.preference}\n\n${values.message}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend hatası", res.status, await res.text());
    return {
      status: "error",
      message: `Mesaj şu an gönderilemedi. Doğrudan ${TO} adresine yazabilirsiniz.`,
      values,
    };
  }

  return { status: "sent" };
}
