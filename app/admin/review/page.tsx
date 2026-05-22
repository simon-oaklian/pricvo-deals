import Link from "next/link";
import ReviewDealActions from "@/components/admin/ReviewDealActions";
import { discountPercent, formatMoney } from "@/data/deals";
import { requireAdmin } from "@/lib/auth";
import { getPendingReviewDeals } from "@/lib/deals";

export default async function AdminReviewPage() {
  await requireAdmin();
  const deals = getPendingReviewDeals();

  return (
    <main className="page-shell">
      <div className="container-page py-8 md:py-10">
        <div className="mb-8 space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Admin</p>
          <h1 className="text-3xl font-semibold text-gray-900">Review Queue</h1>
          <p className="copy-soft">
            {deals.length} deal{deals.length === 1 ? "" : "s"} waiting for review
          </p>
        </div>

        {deals.length === 0 ? (
          <div className="admin-card px-6 py-10">
            <p className="text-base font-medium text-gray-900">No deals pending review. Generate some first.</p>
            <Link
              href="/admin/generate"
              className="mt-4 inline-block text-sm text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
            >
              Go to Generate
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {deals.map((deal) => {
              const pct =
                deal.originalPrice > 0 ? discountPercent(deal.originalPrice, deal.dealPrice) : 0;
              const highlightsLine = deal.highlights.join(" · ");
              return (
                <li key={deal.id}>
                  <article className="admin-card flex flex-col gap-6 p-6 md:flex-row md:items-stretch">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={deal.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">{deal.title}</h2>
                        {deal.aiGenerated ? (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-800">
                            AI Generated
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-500">
                        {deal.category} · {deal.store}
                      </p>
                      <p className="text-sm text-gray-800">
                        {formatMoney(deal.originalPrice)} → {formatMoney(deal.dealPrice)}
                        {pct > 0 ? ` · ${pct}% off` : null}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-600">{deal.description}</p>
                      {highlightsLine ? (
                        <p className="line-clamp-1 text-xs text-gray-500">{highlightsLine}</p>
                      ) : null}
                      {deal.sourceUrl ? (
                        <a
                          href={deal.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block max-w-full truncate text-xs text-blue-600 underline decoration-blue-200"
                        >
                          {deal.sourceUrl}
                        </a>
                      ) : null}
                    </div>

                    <ReviewDealActions dealId={deal.id} />
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
