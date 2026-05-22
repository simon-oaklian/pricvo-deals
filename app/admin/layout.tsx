import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "@/lib/actions";
import { getPendingReviewCount } from "@/lib/deals";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = Number(getPendingReviewCount());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 border-b border-gray-200 bg-white">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
          <span className="font-medium text-gray-900">Pricvo Admin</span>
          <AdminNav pendingCount={pendingCount} />
          <div className="flex items-center justify-end gap-4">
            <Link href="/" className="text-xs text-gray-500 transition hover:text-gray-900">
              Home
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-gray-500 transition hover:text-red-500">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
