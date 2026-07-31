import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/panel/LoginForm";
import { getSession } from "@/lib/auth/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // "Zaten giriş yapmışsan panele git" kararı burada veriliyor, proxy'de değil:
  // burada cookie gerçekten doğrulanıyor. Süresi dolmuş bir cookie form'u
  // gösterir, sonsuz yönlendirmeye girmez.
  if (await getSession()) redirect("/panel");

  const { next } = await searchParams;
  const safeNext = next?.startsWith("/panel") ? next : undefined;

  return (
    <main className="panel-light safe-top safe-bottom relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-6 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      {/* Siteyle aynı sky → indigo → fuchsia geçişi, açık zemine göre soluk */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-200/50 via-indigo-200/40 to-fuchsia-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white ring-1 ring-neutral-200 shadow-sm">
            <Image
              src="/ed-512.png"
              alt=""
              fill
              priority
              sizes="56px"
              className="object-cover"
            />
          </div>
          <h1 className="mt-5 text-lg font-semibold tracking-tight">Panel</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Devam etmek için parolanı gir.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LoginForm next={safeNext} />
        </div>
      </div>
    </main>
  );
}
