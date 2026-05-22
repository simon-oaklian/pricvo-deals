import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Pricvo",
  description: "Learn how Pricvo earns commissions through affiliate links."
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-stone-800 md:px-6">
      <article className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Affiliate Disclosure</h1>
          <p className="mt-2 text-sm text-stone-500">Last updated: April 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 1 - Our Relationship with Retailers</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Pricvo participates in affiliate advertising programs designed to provide a means for us to earn
            fees by linking to affiliated sites. When you click a &quot;View Deal&quot; or &quot;Shop Now&quot; link
            on Pricvo and make a purchase, we may receive a small commission from the retailer at no additional
            cost to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 2 - Which Programs We Use</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            We currently participate in affiliate programs including but not limited to: Amazon Associates
            Program, Home Depot Affiliate Program, Wayfair Affiliate Program, and Lowe&apos;s Affiliate Program.
            These programs are administered by third parties including Impact, CJ Affiliate, and Amazon.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 3 - How This Affects Our Content</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Our editorial team selects deals based on value, quality, and reader interest — not commission
            rates. We do not accept payment to feature specific products. Affiliate relationships do not influence
            our deal curation or pricing information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 4 - Price Accuracy</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Prices and availability are accurate as of the date/time indicated and are subject to change. Any
            price and availability information displayed on retailer websites at the time of purchase will apply.
            Pricvo is not responsible for price discrepancies between our site and the retailer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 5 - Contact</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Questions about this disclosure? Contact us at:{" "}
            <a href="mailto:hello@pricvo.com" className="text-stone-900 underline decoration-stone-300">
              hello@pricvo.com
            </a>
          </p>
        </section>

        <p className="pt-4">
          <Link href="/" className="text-sm text-stone-600 underline decoration-stone-300">
            ← Back to home
          </Link>
        </p>
      </article>
    </main>
  );
}
