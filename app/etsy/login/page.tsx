import Image from "next/image";
import { redirect } from "next/navigation";

import { EtsyLoginForm } from "@/components/etsy/EtsyLoginForm";
import { getSession } from "@/lib/auth/session";

export default async function EtsyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Cookie burada gerçekten doğrulanıyor — proxy sadece varlığına bakıyor.
  if (await getSession()) redirect("/etsy");

  const { next } = await searchParams;
  const safeNext = next?.startsWith("/etsy") ? next : undefined;

  return (
    <main className="panel-light safe-top safe-bottom relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-6 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-orange-200/50 via-amber-200/40 to-rose-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-neutral-200">
            <Image
              src="/icons/etsy-icon-192.png"
              alt="Cheerish Days Crafts"
              fill
              priority
              sizes="64px"
              className="object-cover"
            />
          </div>
          <p className="mt-5 text-sm text-neutral-500">
            Kullanıcı adın ve parolanla gir.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <EtsyLoginForm next={safeNext} />
        </div>
      </div>
    </main>
  );
}
