import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Home Deal Guides | Pricvo",
  description: "Buying guides and deal notes for bathroom vanities, mirrors, and home upgrades."
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-12 md:px-6">
      <section className="mb-10 border-b border-stone-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Pricvo guides</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-stone-900 md:text-4xl">
          Home deal notes and buying guides
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
          Practical notes for comparing home upgrades, spotting price changes, and choosing products that fit your room.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="rounded border border-stone-200 bg-white/70 px-6 py-12 text-center text-sm text-stone-500">
          Guides are being prepared.
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded border border-stone-200 bg-white/80 p-5 shadow-sm transition hover:border-stone-300 hover:bg-white"
            >
              <p className="text-xs text-stone-400">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                  new Date(post.publishedAt)
                )}
              </p>
              <h2 className="mt-2 text-xl font-medium leading-snug text-stone-900">{post.title}</h2>
              {post.description ? <p className="mt-2 text-sm leading-relaxed text-stone-600">{post.description}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
