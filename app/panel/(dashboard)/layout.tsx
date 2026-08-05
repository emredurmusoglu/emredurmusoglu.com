import Link from "next/link";

import { NavLink } from "@/components/panel/NavLink";
import { ToastHost } from "@/components/panel/Toast";
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
  // Asıl yetki kontrolü burada — proxy sadece yönlendirme yapıyor.
  await requireSession();
  const counts = await getTaskCounts();

  return (
    <div className="panel-light safe-top safe-bottom min-h-screen bg-neutral-50 text-neutral-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-10 md:px-6 md:py-10">
        <aside className="md:w-52 md:shrink-0">
          <div className="flex items-center justify-between md:block">
            <Link
              href="/panel"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900"
            >
              Panel
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400" />
            </Link>
            <form action={logout} className="md:hidden">
              <button
                type="submit"
                className="text-xs text-neutral-400 transition hover:text-neutral-700"
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
              className="block rounded-xl px-3 py-2 text-sm text-neutral-400 transition hover:text-neutral-700"
            >
              ← Siteye dön
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-neutral-400 transition hover:text-neutral-700"
              >
                Çıkış yap
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>

      {/* Layout hiç unmount olmadığı için toast burada duruyor */}
      <ToastHost />
    </div>
  );
}
