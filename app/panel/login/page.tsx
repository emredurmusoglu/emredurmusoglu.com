import Image from "next/image";

import { LoginForm } from "@/components/panel/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/panel") ? next : undefined;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 text-white [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/25 via-indigo-500/20 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
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
          <p className="mt-1 text-sm text-white/40">Devam etmek için parolanı gir.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <LoginForm next={safeNext} />
        </div>
      </div>
    </main>
  );
}
