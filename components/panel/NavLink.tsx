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
        "flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-indigo-50 font-medium text-indigo-700"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
      ].join(" ")}
    >
      <span>{label}</span>
      {badge ? (
        <span
          className={[
            "rounded-full px-2 py-0.5 text-xs tabular-nums",
            active
              ? "bg-indigo-100 text-indigo-700"
              : "bg-neutral-200/70 text-neutral-600",
          ].join(" ")}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
