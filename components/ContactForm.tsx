"use client";

import { useActionState } from "react";

import { sendContact, type ContactState } from "@/lib/actions/contact";

const INPUT =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.07]";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" },
  );

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-white/80">
        <p className="font-medium text-white">Mesajınız ulaştı, teşekkürler.</p>
        <p className="mt-2 text-sm text-white/55">
          En kısa sürede size dönüş yapacağım.
        </p>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-white/55">Adınız</span>
          <input
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            defaultValue={values?.name}
            className={INPUT}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-white/55">E-posta</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={values?.email}
            className={INPUT}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm text-white/55">Mesajınız</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          defaultValue={values?.message}
          className={`${INPUT} resize-y`}
        />
      </label>

      {/* Bal küpü — ekran dışında, botlar için */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-rose-300">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-white/85 disabled:opacity-60"
      >
        {pending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
