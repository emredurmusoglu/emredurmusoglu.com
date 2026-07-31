import Link from "next/link";

import { NavLink } from "@/components/panel/NavLink";
import { logout } from "@/lib/actions/auth";
import { requireSession } from "@/lib/auth/session";
import { getTaskCounts } from "@/lib/dal";

// Panel her zaman taze veri gösterir, cache'lenmez.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Asıl yetki kontrolü burada — middleware sadece yönlendirme yapıyor.
  await requireSession();
  const counts = await getTaskCounts();

  return (
    <div className="min-h-screen bg-neutral-950 text-white [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-10 md:px-6 md:py-10">
        <aside className="md:w-52 md:shrink-0">
          <div className="flex items-center justify-between md:block">
            <Link
              href="/panel"
              className="text-sm font-semibold tracking-tight text-white/90"
            >
              Panel
            </Link>
            <form action={logout} className="md:hidden">
              <button
                type="submit"
                className="text-xs text-white/40 transition hover:text-white/70"
              >
                Çıkış
              </button>
            </form>
          </div>

          <nav className="mt-4 flex gap-1 overflow-x-auto md:mt-6 md:flex-col md:overflow-visible">
            <NavLink href="/panel" label="Bugün" />
            <NavLink
              href="/panel/tasks"
              label="Yapılacaklar"
              badge={counts.todo + counts.doing}
            />
            <NavLink href="/panel/notes" label="Notlar" />
            <NavLink href="/panel/projects" label="Projeler" />
          </nav>

          <div className="mt-8 hidden md:block">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 text-sm text-white/40 transition hover:text-white/70"
            >
              ← Siteye dön
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/40 transition hover:text-white/70"
              >
                Çıkış yap
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
