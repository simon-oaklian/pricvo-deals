import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatMoney } from "@/data/deals";
import { getAllDealsAdmin } from "@/lib/deals";

function statusClasses(status: string) {
  if (status === "published") {
    return "status-badge status-published";
  }

  if (status === "expired") {
    return "status-badge status-expired";
  }

  if (status === "pending_review") {
    return "status-badge status-pending";
  }

  if (status === "rejected") {
    return "status-badge status-rejected";
  }

  return "status-badge status-draft";
}

export default async function AdminDealsPage() {
  await requireAdmin();
  const deals = getAllDealsAdmin();

  return (
    <main className="page-shell">
      <div className="container-page py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Admin</p>
            <h1 className="text-3xl font-semibold text-gray-900">Deals</h1>
            <p className="copy-soft">
              Local admin list powered by the existing SQLite-backed helpers in <code className="text-gray-800">lib/deals.ts</code>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/admin/deals/new" className="btn-primary">
              New deal
            </Link>
          </div>
        </div>

        <section className="admin-card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">All deals</h2>
              <p className="copy-soft">{deals.length} item(s) in local storage</p>
            </div>
          </div>

          {deals.length === 0 ? (
            <div className="px-6 py-10">
              <p className="text-base font-medium text-gray-900">No deals found yet.</p>
              <p className="copy-soft mt-2">
                The route is working, but the local SQLite database currently has no rows. Once data is seeded,
                this page will render the full admin list automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-[0.16em] text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Current</th>
                    <th className="px-6 py-3 font-medium">Compare at</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Store</th>
                    <th className="px-6 py-3 font-medium">Featured</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{deal.title}</p>
                          <p className="text-xs text-gray-500">{deal.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{deal.category}</td>
                      <td className="px-6 py-4 text-gray-900">{formatMoney(deal.dealPrice)}</td>
                      <td className="px-6 py-4">
                        {deal.originalPrice ? formatMoney(deal.originalPrice) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusClasses(deal.status)}>{deal.status}</span>
                      </td>
                      <td className="px-6 py-4">{deal.store}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {deal.featuredHome ? "Home" : "-"}
                        {deal.featuredTopic ? (deal.featuredHome ? " / Topic" : "Topic") : ""}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/deals/${deal.id}/edit`}
                          className="text-sm text-blue-600 underline decoration-blue-200 underline-offset-2 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
