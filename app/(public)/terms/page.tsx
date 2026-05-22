import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Pricvo",
  description: "Pricvo terms of use and disclaimer."
};

export default function TermsOfUsePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-stone-800 md:px-6">
      <article className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Terms of Use</h1>
          <p className="mt-2 text-sm text-stone-500">Last updated: April 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 1 - Disclaimer</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Pricvo provides deal information for informational purposes only. We make no warranties regarding
            accuracy, completeness, or fitness for any particular purpose. Deal prices and availability can change
            without notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 2 - No Purchase Guarantee</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Clicking a deal link on Pricvo does not guarantee the advertised price will be available. Retailer
            pricing is controlled entirely by the respective retailer. Pricvo is not a party to any transaction
            between you and a retailer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 3 - Intellectual Property</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Content on Pricvo, including text, images, and design, is owned by Pricvo or used with permission.
            Product images displayed are the property of their respective retailers and are used for deal reference
            purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 4 - Limitation of Liability</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            To the maximum extent permitted by law, Pricvo shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of this site or reliance on deal information provided.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 5 - Governing Law</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            These terms are governed by the laws of the State of California, United States.
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
