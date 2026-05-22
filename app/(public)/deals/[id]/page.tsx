import Link from "next/link";
import { notFound } from "next/navigation";
import { discountPercent, formatMoney } from "@/data/deals";
import { getCategoryBrowsePath, getCategoryLabel } from "@/lib/publicCategory";
import { getAllPublishedDeals, getDealById, getRelatedPublishedDeals } from "@/lib/deals";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const deal = getDealById(Number(params.id));
  if (!deal || deal.status !== "published" || deal.isExpired) {
    return { title: "Deal" };
  }

  const discount =
    deal.originalPrice > 0
      ? Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
      : 0;
  const title = `${deal.title} — ${discount}% Off at ${deal.store}`;
  const description = `${deal.title} on sale at ${deal.store}. Was $${deal.originalPrice}, now $${deal.dealPrice} (save ${discount}%). ${deal.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pricvo.com/deals/${deal.id}`,
      type: "website",
      images: deal.imageUrl ? [{ url: deal.imageUrl, alt: deal.title }] : []
    },
    alternates: {
      canonical: `https://pricvo.com/deals/${deal.id}`
    }
  };
}

export async function generateStaticParams() {
  const deals = getAllPublishedDeals();
  return deals.map((deal) => ({ id: String(deal.id) }));
}

export default function DealDetailPage({ params }: Props) {
  const id = params.id;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const deal = getDealById(numericId);
  if (!deal || deal.status !== "published" || deal.isExpired) {
    notFound();
  }

  const pct = deal.originalPrice > 0 ? discountPercent(deal.originalPrice, deal.dealPrice) : 0;
  const saveAmount = Math.max(0, deal.originalPrice - deal.dealPrice);
  const categoryLabel = getCategoryLabel(deal.category);
  const categoryPath = getCategoryBrowsePath(deal.category);
  const crumbTitle = deal.title.length > 40 ? `${deal.title.slice(0, 37)}...` : deal.title;

  const relatedDeals = getRelatedPublishedDeals(deal.category, deal.id, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.description,
    image: deal.imageUrl,
    offers: {
      "@type": "Offer",
      price: deal.dealPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: deal.affiliateUrl,
      seller: { "@type": "Organization", name: deal.store }
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-6 md:pt-12">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500">
        <Link href="/" className="transition hover:text-stone-800">
          Home
        </Link>
        <span className="text-stone-400">/</span>
        {categoryPath ? (
          <Link href={categoryPath} className="transition hover:text-stone-800">
            {categoryLabel}
          </Link>
        ) : (
          <span className="text-stone-600">{categoryLabel}</span>
        )}
        <span className="text-stone-400">/</span>
        <span className="text-stone-800">{crumbTitle}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-stone-700">
        <p>
          <span className="font-medium text-stone-800">ℹ</span> We may earn a commission from purchases made
          through our links.
        </p>
        <Link
          href="/affiliate-disclosure"
          className="shrink-0 font-medium text-stone-900 underline decoration-stone-400"
        >
          Disclosure →
        </Link>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
        <div className="self-start overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] md:sticky md:top-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deal.imageUrl} alt="" className="aspect-square w-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{deal.store}</p>
          <h1 className="mt-3 text-2xl font-medium tracking-tight text-stone-900 md:text-3xl">{deal.title}</h1>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stone-600">
            {deal.description.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {deal.highlights.length > 0 ? (
            <section className="mt-4 rounded-xl border border-stone-200 bg-stone-50/90 p-4">
              <h2 className="text-sm font-semibold text-stone-900">Deal Highlights</h2>
              <ul className="mt-3 space-y-2">
                {deal.highlights.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-stone-700">
                    <span className="shrink-0 text-emerald-600" aria-hidden>
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-6 border-t border-stone-100 pt-4">
            <p className="text-3xl font-semibold text-stone-900">{formatMoney(deal.dealPrice)}</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              {deal.originalPrice > deal.dealPrice ? (
                <span className="text-lg text-stone-400 line-through">{formatMoney(deal.originalPrice)}</span>
              ) : null}
            </div>
            {saveAmount > 0 && pct > 0 ? (
              <p className="mt-2 text-base font-medium text-emerald-700">
                You save {formatMoney(saveAmount)} ({pct}% off)
              </p>
            ) : null}
            <p className="mt-2 text-sm text-stone-500">{deal.store}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              ⏱ Deal price — verify availability before purchase
            </p>
          </div>

          <div className="mt-6">
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-stone-900 px-6 py-4 text-base font-medium text-white shadow-[0_2px_12px_rgba(15,23,42,0.2)] transition hover:bg-stone-800"
            >
              View Deal at {deal.store} →
            </a>
            <p className="mt-2 text-center text-sm text-emerald-700 md:text-left">
              ✓ Link opens directly on retailer site
            </p>
            <p className="mt-3 text-xs text-stone-500">
              Price and availability may change. Verify on retailer site before purchase.
            </p>
          </div>
        </div>
      </div>

      {relatedDeals.length > 0 ? (
        <section className="mt-16 border-t border-stone-200 pt-10">
          <h2 className="text-lg font-medium text-stone-900">More {categoryLabel} Deals</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {relatedDeals.map((r) => (
              <Link
                key={r.id}
                href={`/deals/${r.id}`}
                className="w-[160px] shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md sm:w-[180px]"
              >
                <div className="aspect-square w-full overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-stone-900">{r.title}</p>
                  <p className="mt-1.5 text-sm font-semibold text-stone-900">{formatMoney(r.dealPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </main>
  );
}
