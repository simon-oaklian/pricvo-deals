import Link from "next/link";
import { notFound } from "next/navigation";
import PublicDealGrid from "@/components/PublicDealGrid";
import { getDealsByCategory } from "@/lib/deals";
import type { Metadata } from "next";

const SLUG_MAP: Record<string, { dbCategory: string; title: string; description: string }> = {
  "bathroom-vanity": {
    dbCategory: "vanity",
    title: "Bathroom Vanity Deals",
    description:
      "Handpicked bathroom vanity deals from Amazon, Home Depot, Wayfair and Lowe's. Updated regularly."
  },
  "bathroom-mirror": {
    dbCategory: "mirror",
    title: "Bathroom Mirror Deals",
    description: "Best deals on bathroom mirrors — LED mirrors, framed mirrors, and medicine cabinets."
  }
};

const SITE = "https://pricvo.com";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return [{ slug: "bathroom-vanity" }, { slug: "bathroom-mirror" }];
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const config = SLUG_MAP[params.slug];
  if (!config) {
    return {};
  }

  const deals = getDealsByCategory(config.dbCategory);
  const minPrice = deals.length > 0 ? Math.min(...deals.map((d) => d.dealPrice)) : null;
  const dealCount = deals.length;

  const title = config.title;
  const description =
    dealCount > 0
      ? `${dealCount} ${config.title.toLowerCase()} available. Starting from $${minPrice}. Updated regularly from Amazon, Home Depot, Wayfair.`
      : config.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Pricvo`,
      description,
      url: `https://pricvo.com/category/${params.slug}`,
      type: "website"
    },
    alternates: {
      canonical: `https://pricvo.com/category/${params.slug}`
    }
  };
}

export default function CategoryPage({ params }: Props) {
  const meta = SLUG_MAP[params.slug];
  if (!meta) {
    notFound();
  }

  const deals = getDealsByCategory(meta.dbCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    itemListElement: deals.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: deal.title,
      url: `${SITE}/deals/${deal.id}`
    }))
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 md:pt-14">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="transition hover:text-stone-800">
          Home
        </Link>
        <span className="mx-2 text-stone-400">/</span>
        <span className="text-stone-700">{meta.title}</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">{meta.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-600">{meta.description}</p>
      </div>

      <div className="mt-6 max-w-3xl rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-stone-700">
        <span className="font-medium text-stone-800">ℹ</span> Pricvo earns a commission when you shop via our
        links — at no extra cost to you.{" "}
        <Link href="/affiliate-disclosure" className="font-medium text-stone-900 underline decoration-stone-400">
          Learn more
        </Link>
      </div>

      <div className="mt-10">
        {deals.length === 0 ? (
          <p className="text-center text-sm text-stone-600">No deals in this category yet. Check back soon.</p>
        ) : (
          <PublicDealGrid deals={deals} />
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
