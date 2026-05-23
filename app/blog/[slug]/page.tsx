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

function ArticleLightbox() {
  return (
    <>
      <dialog className="lightbox" id="lb">
        <button className="lb-close" aria-label="Close">&times;</button>
        <img id="lb-img" alt="" />
      </dialog>
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            const lb = document.getElementById('lb');
            const img = document.getElementById('lb-img');
            if (!lb || !img || !lb.showModal) return;
            document.querySelectorAll('.article-figure img').forEach((el) => {
              el.addEventListener('click', () => {
                img.src = el.currentSrc || el.src;
                img.alt = el.alt || '';
                lb.showModal();
              });
            });
            lb.addEventListener('click', (event) => {
              if (event.target === lb || event.target === img || event.target.classList.contains('lb-close')) lb.close();
            });
          })();`
        }}
      />
    </>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#F9F8F6] px-4 py-7 text-stone-800 md:px-6 md:py-10">
      {post.schemaOrg ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemaOrg) }} /> : null}
      <style dangerouslySetInnerHTML={{ __html: `
        .article-figure {
          margin: 56px 0;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .article-figure .img-wrap {
          position: relative;
          display: inline-block;
          line-height: 0;
          max-width: 720px;
          width: 100%;
        }
        .article-figure img {
          width: 100%;
          aspect-ratio: 16 / 9;
          height: auto;
          max-height: 430px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(15, 29, 58, 0.10);
          display: block;
          margin: 0 auto;
          cursor: zoom-in;
          transition: transform .15s ease;
        }
        .article-figure img:hover { transform: scale(1.01); }
        .article-figure .zoom-hint {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 29, 58, 0.55);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          pointer-events: none;
          backdrop-filter: blur(4px);
          transition: background .15s ease, transform .15s ease;
          line-height: 1;
        }
        .article-figure .img-wrap:hover .zoom-hint {
          background: rgba(15, 29, 58, 0.85);
          transform: scale(1.08);
        }
        .article-figure figcaption {
          font-size: .85rem;
          color: #78716c;
          margin-top: 14px;
          font-style: italic;
          line-height: 1.5;
          padding: 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 600px;
        }
        dialog.lightbox {
          border: none;
          padding: 0;
          background: rgba(0, 0, 0, 0.92);
          max-width: 100vw;
          max-height: 100vh;
          width: 100vw;
          height: 100vh;
          margin: 0;
          overflow: hidden;
        }
        dialog.lightbox::backdrop { background: rgba(0, 0, 0, 0.92); }
        dialog.lightbox img {
          max-width: 95vw;
          max-height: 95vh;
          display: block;
          margin: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: zoom-out;
          border-radius: 4px;
        }
        dialog.lightbox .lb-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
          padding: 8px 12px;
          z-index: 10;
        }
        @media (max-width: 640px) {
          .article-figure { margin: 40px 0; }
          .article-figure img { max-height: 320px; border-radius: 6px; }
          .article-figure .zoom-hint { width: 30px; height: 30px; font-size: 15px; bottom: 8px; right: 8px; }
          .article-figure figcaption { font-size: .8rem; padding: 0 8px; }
        }
      ` }} />

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
      <ArticleLightbox />
    </main>
  );
}
