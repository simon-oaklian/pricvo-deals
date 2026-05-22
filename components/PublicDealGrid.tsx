import Link from "next/link";
import { discountPercent, formatMoney } from "@/data/deals";
import type { Deal } from "@/lib/deals";

type Props = {
  deals: Deal[];
};

function DealQualityBadge({ pct }: { pct: number }) {
  if (pct >= 40) {
    return (
      <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-800">
        Hot deal 🔥
      </span>
    );
  }
  if (pct >= 30) {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
        Great deal
      </span>
    );
  }
  if (pct >= 20) {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
        Good deal
      </span>
    );
  }
  return null;
}

export default function PublicDealGrid({ deals }: Props) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 [&>a]:mb-6">
      {deals.map((deal) => {
        const pct = deal.originalPrice > 0 ? discountPercent(deal.originalPrice, deal.dealPrice) : 0;
        const savedAmount = Math.max(0, deal.originalPrice - deal.dealPrice);

        return (
          <Link key={deal.id} href={`/deals/${deal.id}`} className="group block break-inside-avoid">
            <article className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deal.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                {pct > 0 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-800 shadow-sm">
                    {pct}% off
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 px-4 py-4">
                <p className="line-clamp-2 text-[15px] font-medium leading-snug text-stone-900">{deal.title}</p>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-semibold text-stone-900">{formatMoney(deal.dealPrice)}</span>
                  {deal.originalPrice > deal.dealPrice ? (
                    <span className="text-sm text-stone-400 line-through">{formatMoney(deal.originalPrice)}</span>
                  ) : null}
                </div>
                {savedAmount > 0 ? (
                  <p className="text-xs font-medium text-emerald-700">Save {formatMoney(savedAmount)} today</p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">{pct > 0 ? <DealQualityBadge pct={pct} /> : null}</div>
                <p className="text-xs text-stone-500">{deal.store}</p>
                <span className="mt-1 block w-full rounded-lg bg-stone-900 py-2 text-center text-sm text-white">
                  View Deal →
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
