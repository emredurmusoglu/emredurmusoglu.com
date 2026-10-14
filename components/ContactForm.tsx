"use client";

import { useActionState } from "react";

import { sendContact, type ContactState } from "@/lib/actions/contact";
import { PREFERENCES } from "@/lib/contact";

const INPUT =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.07]";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" },
  );

  // Gönderildikten sonra tanıtım metni ve form kalkıyor, yalnızca bu kutu kalıyor.
  if (state.status === "sent") {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-white/80">
        <p className="font-medium text-white">Mesajınız ulaştı, teşekkürler.</p>
        <p className="mt-2 text-sm text-white/55">
          En kısa sürede size dönüş yapacağım.
        </p>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;

  return (
    <>
      <p className="mt-8 text-base leading-relaxed text-white/60 md:text-lg">
        Aklınızdaki projeyi, sorunuzu ya da fikrinizi kısaca yazın. Mesajınız
        doğrudan bana ulaşır, en kısa sürede size dönüş yaparım.
      </p>

      <form action={action} className="mt-10 space-y-4">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/55">
              Telefon <span className="text-white/30">(isteğe bağlı)</span>
            </span>
            <input
              name="phone"
              type="tel"
              maxLength={30}
              autoComplete="tel"
              placeholder="+90 5xx xxx xx xx"
              defaultValue={values?.phone}
              className={INPUT}
            />
          </label>
          <fieldset>
            <legend className="mb-1.5 block text-sm text-white/55">
              Size nasıl dönüş yapayım?
            </legend>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((p) => (
                <label key={p} className="cursor-pointer">
                  <input
                    type="radio"
                    name="preference"
                    value={p}
                    defaultChecked={(values?.preference ?? "E-posta") === p}
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/60 transition peer-checked:border-white/40 peer-checked:bg-white/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 hover:border-white/25">
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
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
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
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
    </>
  );
}
