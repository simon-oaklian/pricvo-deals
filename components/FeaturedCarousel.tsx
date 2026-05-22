"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Deal } from "@/lib/deals";
import { discountPercent, formatMoney } from "@/data/deals";

type Props = {
  deals: Deal[];
};

/** Slower auto-advance; arrows / dots still work anytime */
const AUTO_MS = 13000;

export default function FeaturedCarousel({ deals }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = deals.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [n, paused, go]);

  useEffect(() => {
    setIndex(0);
  }, [deals]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (n === 0) return null;

  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,23,42,0.08)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured deals"
    >
      <div>
        <div className="relative">
          <div className="w-full overflow-hidden">
            <div
              className="flex w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {deals.map((deal, i) => (
                <div
                  key={deal.id}
                  className="w-full shrink-0 basis-full"
                  aria-hidden={i !== index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}`}
                >
                  <div className="flex h-[320px] flex-col overflow-hidden md:h-[420px] md:flex-row">
                    {/* Mobile: image on top */}
                    <Link
                      href={`/deals/${deal.id}`}
                      className="relative order-1 block h-48 w-full shrink-0 overflow-hidden bg-stone-100 md:order-2 md:h-full md:w-[55%]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={deal.imageUrl}
                        alt=""
                        className="h-full w-full object-cover object-center transition duration-500 hover:opacity-95"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-stone-800 shadow-sm">
                        {i + 1}/{n}
                      </span>
                    </Link>

                    <div className="order-2 flex min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden px-6 py-5 md:order-1 md:w-[45%] md:px-12 md:py-0">
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500">
                        Today&apos;s picks
                      </p>
                      <h2 className="mt-1.5 text-2xl font-medium leading-snug tracking-tight text-stone-900 md:text-3xl">
                        {deal.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">{deal.description}</p>

                      <div className="mt-3 flex flex-wrap items-end gap-2">
                        <span className="text-xl font-semibold text-stone-900 sm:text-2xl">
                          {formatMoney(deal.dealPrice)}
                        </span>
                        {deal.originalPrice > deal.dealPrice ? (
                          <span className="pb-0.5 text-sm text-stone-400 line-through">
                            {formatMoney(deal.originalPrice)}
                          </span>
                        ) : null}
                        {deal.originalPrice > deal.dealPrice ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Save {formatMoney(deal.originalPrice - deal.dealPrice)}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-stone-500">
                        {discountPercent(deal.originalPrice, deal.dealPrice)}% off · {deal.store}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="inline-flex items-center rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800 sm:text-sm"
                        >
                          View details
                        </Link>
                        <span className="text-[11px] text-stone-500">
                          Updated {new Date(deal.updatedAt).toLocaleDateString("en-US")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {n > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-1 top-1/2 z-10 flex -translate-y-1/2 rounded-full border border-stone-200/90 bg-white/95 p-1.5 text-stone-700 shadow-md transition hover:bg-white md:left-2 md:p-2"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-1 top-1/2 z-10 flex -translate-y-1/2 rounded-full border border-stone-200/90 bg-white/95 p-1.5 text-stone-700 shadow-md transition hover:bg-white md:right-2 md:p-2"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
              </button>
            </>
          ) : null}
        </div>

        {n > 1 ? (
          <div className="flex items-center justify-center gap-2 border-t border-stone-100 bg-stone-50/90 py-2">
            {deals.map((deal, i) => (
              <button
                key={deal.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-stone-800" : "w-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
