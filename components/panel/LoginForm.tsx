"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "@/lib/actions/auth";

/** Parola yöneticisindeki kaydın etiketi. Sunucuya gönderilmez, doğrulanmaz. */
const ACCOUNT = "emredurmusoglu1@gmail.com";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
    >
      {pending ? "Kontrol ediliyor…" : "Giriş yap"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {/*
        Sadece parola alanı olan formlarda Safari/iCloud Keychain kaydı ya hiç
        önermiyor ya da boş kullanıcı adıyla kaydedip otomatik doldurmayı
        bozuyor. Bu alan tam da bunun için var: parola yöneticisi kaydı
        adlandırabilsin diye. `type="hidden"` işe yaramaz — yöneticiler onu
        yok sayar — o yüzden gerçek bir alan olarak duruyor ama görünmüyor.
      */}
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={ACCOUNT}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
      />

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-neutral-600">
          Parola
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          placeholder="••••••••••••"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
