"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
  badge,
}: {
  href: string;
  label: string;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = href === "/panel" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white/85",
      ].join(" ")}
    >
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums text-white/70">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
