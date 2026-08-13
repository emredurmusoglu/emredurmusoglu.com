"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { etsyLogin, type LoginState } from "@/lib/actions/auth";

const fieldClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Kontrol ediliyor…" : "Giriş yap"}
    </button>
  );
}

export function EtsyLoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    etsyLogin,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="username" className="mb-2 block text-sm text-neutral-600">
          Kullanıcı adı
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          required
          className={fieldClass}
          placeholder="kullaniciadi"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-neutral-600">
          Parola
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
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
