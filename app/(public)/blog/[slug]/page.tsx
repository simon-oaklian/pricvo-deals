import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Pricvo`,
    description: post.description,
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonicalUrl,
      type: "article"
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-12 md:px-6">
      {post.schemaOrg ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemaOrg) }} />
      ) : null}
      <article className="rounded border border-stone-200 bg-white/85 px-5 py-7 shadow-sm md:px-8 md:py-9">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Pricvo guide</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-stone-900">{post.title}</h1>
        <p className="mt-3 text-sm text-stone-500">
          {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
            new Date(post.publishedAt)
          )}
        </p>
        <div
          className="prose-pricvo mt-8 text-[16px] leading-8 text-stone-700"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </article>
    </main>
  );
}
