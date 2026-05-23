import Link from "next/link";
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
    openGraph: { title: post.title, description: post.description, url: post.canonicalUrl, type: "article" }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-4 py-7 text-stone-800 md:px-6 md:py-10">
      {post.schemaOrg ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemaOrg) }} /> : null}
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-medium tracking-tight text-stone-950">Pricvo</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/category/bathroom-vanity" className="hidden text-stone-600 hover:text-stone-950 sm:inline">Vanity Deals</Link>
          <Link href="/" className="rounded bg-stone-950 px-4 py-2 font-medium text-white">Shop Deals</Link>
        </div>
      </header>
      <section className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <article className="rounded border border-stone-200 bg-white/90 px-5 py-7 shadow-sm md:px-8 md:py-9">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Pricvo guide</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-stone-950 md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-stone-500">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(post.publishedAt))}</p>
          <div className="mt-8 text-[16px] leading-8 text-stone-700 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-snug [&_h2]:text-stone-950 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-stone-950 [&_p]:mb-5 [&_a]:text-stone-950 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        </article>
        <aside className="h-fit rounded border border-stone-200 bg-white/90 p-5 shadow-sm lg:sticky lg:top-5">
          <h2 className="text-xl font-medium tracking-tight text-stone-950">Find the actual deal</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Use this guide to compare, then go back to Pricvo to check current bathroom vanity and mirror deals.</p>
          <div className="mt-5 grid gap-2">
            <Link href="/" className="rounded bg-stone-950 px-4 py-3 text-center text-sm font-medium text-white">Shop all deals</Link>
            <Link href="/category/bathroom-vanity" className="rounded border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-800">Bathroom vanity deals</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
