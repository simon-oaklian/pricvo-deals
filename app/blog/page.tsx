import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Home Deal Guides | Pricvo",
  description: "Buying guides and deal notes for bathroom vanities, mirrors, and home upgrades.",
  robots: { index: false, follow: true }
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-4 py-10 text-stone-800 md:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-lg font-medium tracking-tight text-stone-950">Pricvo</Link>
        <section className="mt-8 border-b border-stone-200 pb-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Pricvo guides</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-stone-950 md:text-4xl">Home deal notes and buying guides</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-stone-600">This page is not promoted in navigation. Search visitors should land on a specific guide.</p>
        </section>
        <div className="mt-6 grid gap-4">
          {posts.length === 0 ? <p className="text-sm text-stone-500">Guides are being prepared.</p> : posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded border border-stone-200 bg-white/80 p-5 shadow-sm">
              <h2 className="text-xl font-medium leading-snug text-stone-950">{post.title}</h2>
              {post.description ? <p className="mt-2 text-sm leading-relaxed text-stone-600">{post.description}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
