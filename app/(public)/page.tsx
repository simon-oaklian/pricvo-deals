export const dynamic = "force-dynamic";

import Link from "next/link";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import PublicDealGrid from "@/components/PublicDealGrid";
import { getAllPublishedDeals, getFeaturedHomeDeals } from "@/lib/deals";

export default function HomePage() {
  const carouselDeals = getFeaturedHomeDeals();
  const carouselIds = new Set(carouselDeals.map((d) => d.id));
  const deals = getAllPublishedDeals();
  const gridDeals = deals.filter((deal) => !carouselIds.has(deal.id));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pricvo",
    url: "https://pricvo.com",
    description: "Handpicked bathroom vanity and mirror deals from top US retailers.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://pricvo.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 md:pt-14">
      <FeaturedCarousel deals={carouselDeals} />

      <div className="mb-12 w-full">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            Verified deals only
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            Updated daily
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            No spam, no fluff
          </span>
        </div>
        <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Home savings</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
          Deals for calmer, lighter rooms
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
          A quiet wall of hand-picked discounts on furniture and decor. Tap any card for details and a secure
          link to buy.
        </p>
        </div>
      </div>

      {gridDeals.length === 0 ? (
        <div className="rounded-2xl border border-stone-200/80 bg-white/60 px-8 py-16 text-center shadow-sm">
          <p className="text-base font-medium text-stone-800">No published deals yet</p>
          <p className="mt-2 text-sm text-stone-500">
            Add items in the admin area — they will appear here automatically.
          </p>
        </div>
      ) : (
        <PublicDealGrid deals={gridDeals} />
      )}

      <section className="mt-16 border-t border-stone-200 pb-4 pt-8">
        <h2 className="text-xs uppercase tracking-widest text-stone-400">Pricing &amp; Affiliate Disclaimer</h2>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-stone-500">
          Prices shown are as of the date indicated and may change without notice. Pricvo participates in
          affiliate advertising programs — we may earn a commission when you click links to retailers, at no
          extra cost to you. Deal information is provided for reference only; always verify current pricing at
          the retailer before completing a purchase.{" "}
          <Link href="/affiliate-disclosure" className="text-stone-700 underline decoration-stone-300">
            Affiliate Disclosure
          </Link>
          {" · "}
          <Link href="/privacy-policy" className="text-stone-700 underline decoration-stone-300">
            Privacy Policy
          </Link>
        </p>
      </section>
    </main>
    </>
  );
}
