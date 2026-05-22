import Link from "next/link";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-800 antialiased">
      <header className="border-b border-stone-200/80 bg-[#F9F8F6]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <Link href="/" className="text-lg font-medium tracking-tight text-stone-900">
            Pricvo
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-stone-600 md:gap-6">
            <Link href="/category/bathroom-vanity" className="transition hover:text-stone-900">
              Vanity
            </Link>
            <Link href="/category/bathroom-mirror" className="transition hover:text-stone-900">
              Mirrors
            </Link>
            <Link href="/" className="transition hover:text-stone-900">
              All Deals
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-stone-200/80 bg-[#F9F8F6] px-4 py-12 text-center md:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-xs text-stone-500">
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-stone-600">
            <Link href="/affiliate-disclosure" className="underline decoration-stone-300 hover:text-stone-900">
              About
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/affiliate-disclosure" className="underline decoration-stone-300 hover:text-stone-900">
              Affiliate Disclosure
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/privacy-policy" className="underline decoration-stone-300 hover:text-stone-900">
              Privacy Policy
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/terms" className="underline decoration-stone-300 hover:text-stone-900">
              Terms of Use
            </Link>
          </nav>
          <p className="leading-relaxed text-stone-600">
            Pricvo participates in affiliate advertising programs. We earn commissions on purchases made through
            links on this site, at no additional cost to you.
          </p>
          <p className="text-stone-500">
            © 2026 Pricvo. Prices are subject to change. Verify pricing on retailer site before purchase.
          </p>
        </div>
      </footer>
    </div>
  );
}
