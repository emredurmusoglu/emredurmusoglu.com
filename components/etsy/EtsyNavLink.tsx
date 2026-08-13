"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function EtsyNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/etsy" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "shrink-0 rounded-lg px-2.5 py-1.5 text-sm transition",
        active
          ? "bg-neutral-900 font-medium text-white"
          : "text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
