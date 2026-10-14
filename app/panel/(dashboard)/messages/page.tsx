import { ConfirmSubmit } from "@/components/panel/ConfirmSubmit";
import { deleteMessage, markAllMessagesRead, setMessageRead } from "@/lib/actions/messages";
import { listMessages } from "@/lib/dal";
import { formatDateTime } from "@/lib/date";

const linkClass =
  "text-indigo-600 underline decoration-indigo-200 underline-offset-2 transition hover:decoration-indigo-500";
const buttonClass =
  "rounded-lg px-2.5 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900";

/** "+90 532 …" → "905…": wa.me yalnızca rakam istiyor. Başında 0 varsa TR kabul et. */
function whatsappHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `9${digits}`;
  return `https://wa.me/${digits}`;
}

export default async function MessagesPage() {
  const messages = await listMessages();
  const unread = messages.filter((m) => !m.readAt).length;

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mesajlar</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sitedeki iletişim formundan gelenler
            {unread ? ` · ${unread} okunmamış` : ""}
          </p>
        </div>
        {unread ? (
          <form action={markAllMessagesRead}>
            <button
              type="submit"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              Tümünü okundu yap
            </button>
          </form>
        ) : null}
      </header>

      {messages.length ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={[
                "rounded-2xl border bg-white p-4 shadow-sm md:p-5",
                m.readAt ? "border-neutral-200" : "border-rose-200 ring-1 ring-rose-100",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="flex items-center gap-2">
                  {!m.readAt ? (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" aria-label="Okunmadı" />
                  ) : null}
                  <h2 className="font-medium text-neutral-900">{m.name}</h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                    {m.preference} ile dönüş
                  </span>
                </div>
                <time
                  dateTime={m.createdAt.toISOString()}
                  className="text-xs tabular-nums text-neutral-400"
                >
                  {formatDateTime(m.createdAt)}
                </time>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: Siteden mesajınız")}`}
                  className={linkClass}
                >
                  {m.email}
                </a>
                {m.phone ? (
                  <>
                    <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                      {m.phone}
                    </a>
                    <a href={whatsappHref(m.phone)} target="_blank" rel="noreferrer" className={linkClass}>
                      WhatsApp
                    </a>
                  </>
                ) : null}
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3">
                <span className="text-xs text-neutral-400">
                  {m.emailSent ? "Mail bildirimi gitti" : "Mail bildirimi gitmedi"}
                </span>
                <div className="flex items-center gap-1">
                  <form action={setMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.readAt ? "0" : "1"} />
                    <button type="submit" className={buttonClass}>
                      {m.readAt ? "Okunmadı yap" : "Okundu"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit
                      message="Bu mesaj kalıcı olarak silinsin mi?"
                      className={`${buttonClass} hover:bg-rose-50 hover:text-rose-600`}
                    >
                      Sil
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-neutral-200 bg-white px-4 py-8 text-center text-sm text-neutral-400 shadow-sm">
          Henüz mesaj yok. Siteden biri yazdığında burada görünecek.
        </p>
      )}
    </div>
  );
}
