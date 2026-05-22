import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Pricvo",
  description: "Pricvo privacy policy — how we collect and use your information."
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-stone-800 md:px-6">
      <article className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-stone-500">Last updated: April 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 1 - Information We Collect</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Pricvo is a deal discovery site. We do not require account registration and do not collect personal
            information unless you voluntarily contact us. We collect standard server logs (IP address, browser
            type, pages visited) for site operation and security purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 2 - Cookies and Analytics</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            We use cookies and similar technologies for site functionality and anonymous analytics (such as
            Google Analytics). Analytics data is aggregated and does not identify individual users. You may opt
            out of Google Analytics by using the Google Analytics Opt-out Browser Add-on.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 3 - Third-Party Links</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Pricvo contains links to third-party retailer websites. When you click these links, you are subject to
            the privacy policy of that retailer. We are not responsible for the privacy practices of linked sites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 4 - California Residents (CCPA)</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            California residents have rights under the California Consumer Privacy Act (CCPA). As Pricvo does not
            sell personal information, most CCPA rights do not apply to our data practices. For inquiries, contact{" "}
            <a href="mailto:hello@pricvo.com" className="text-stone-900 underline decoration-stone-300">
              hello@pricvo.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 5 - Changes to This Policy</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            We may update this policy periodically. Continued use of Pricvo after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Section 6 - Contact</h2>
          <p className="text-[15px] leading-relaxed text-stone-700">
            Privacy questions:{" "}
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
