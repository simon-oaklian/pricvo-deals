"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  pendingCount: number;
};

function navActive(pathname: string, href: string) {
  if (href === "/admin/generate") return pathname === "/admin/generate";
  if (href === "/admin/review") return pathname === "/admin/review";
  if (href === "/admin/deals") return pathname.startsWith("/admin/deals");
  return false;
}

export default function AdminNav({ pendingCount }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center gap-8">
      <Link
        href="/admin/deals"
        className={`relative pb-1 text-sm transition ${
          navActive(pathname, "/admin/deals")
            ? "font-medium text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Deals
      </Link>
      <Link
        href="/admin/generate"
        className={`relative pb-1 text-sm transition ${
          navActive(pathname, "/admin/generate")
            ? "font-medium text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Generate
      </Link>
      <Link
        href="/admin/review"
        className={`relative pb-1 text-sm transition ${
          navActive(pathname, "/admin/review")
            ? "font-medium text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          Review
          {pendingCount > 0 ? (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          ) : null}
        </span>
      </Link>
    </nav>
  );
}
