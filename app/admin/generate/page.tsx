"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { discountPercent, formatMoney } from "@/data/deals";

const CATEGORY_OPTIONS = [
  { value: "vanity", label: "Bathroom Vanity" },
  { value: "mirror", label: "Bathroom Mirror" }
] as const;

const STORE_OPTIONS = ["Amazon", "Home Depot", "Wayfair", "Lowe's", "Other"] as const;

type Preview = {
  title: string;
  description: string;
  tag: string;
  topic: string;
};

export default function AdminGeneratePage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<string>("vanity");
  const [store, setStore] = useState<string>("Amazon");
  const [originalPrice, setOriginalPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ preview: Preview } | null>(null);
  const [imgError, setImgError] = useState(false);

  const origNum = parseFloat(originalPrice);
  const dealNum = parseFloat(dealPrice);
  const discountInfo = useMemo(() => {
    if (!Number.isFinite(origNum) || !Number.isFinite(dealNum) || origNum <= 0 || dealNum < 0) {
      return null;
    }
    if (origNum <= dealNum) return null;
    const pct = discountPercent(origNum, dealNum);
    const save = origNum - dealNum;
    return { pct, save };
  }, [origNum, dealNum]);

  const ensureToken = useCallback(() => {
    if (typeof window === "undefined") return "";
    let t = localStorage.getItem("adminToken");
    if (!t) {
      t = window.prompt("Enter admin API token (same as ADMIN_TOKEN in .env.local):") ?? "";
      if (t) localStorage.setItem("adminToken", t);
    }
    return t ?? "";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    const token = ensureToken();
    if (!token) {
      setError("Admin token required");
      return;
    }

    if (!Number.isFinite(origNum) || !Number.isFinite(dealNum) || origNum <= dealNum) {
      setError("Original price must be greater than deal price");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/generate-deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productName,
          category,
          store,
          originalPrice: origNum,
          dealPrice: dealNum,
          sourceUrl,
          affiliateUrl: affiliateUrl.trim() || sourceUrl,
          imageUrl,
          extraNotes: extraNotes.trim() || undefined
        })
      });
      const data = (await res.json()) as {
        message?: string;
        success?: boolean;
        preview?: Preview;
      };
      if (!res.ok) {
        setError(data.message ?? "Request failed");
        return;
      }
      if (data.success && data.preview) {
        setSuccess({ preview: data.preview });
        setProductName("");
        setCategory("vanity");
        setStore("Amazon");
        setOriginalPrice("");
        setDealPrice("");
        setSourceUrl("");
        setAffiliateUrl("");
        setImageUrl("");
        setExtraNotes("");
        setImgError(false);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="container-page py-8 md:py-10">
        <div className="mb-8 space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Admin</p>
          <h1 className="text-3xl font-semibold text-gray-900">Generate Deal with AI</h1>
          <p className="text-sm text-gray-600">
            Fill in the basic product info. AI will write the copy. You review before publishing.
          </p>
        </div>

        <section className="admin-card max-w-2xl space-y-6 p-6 md:p-8">
          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p>
                Deal generated! Title: {success.preview.title} | Tag: {success.preview.tag} | Topic:{" "}
                {success.preview.topic}
              </p>
              <Link
                href="/admin/review"
                className="mt-2 inline-block font-medium text-blue-700 underline decoration-blue-300 underline-offset-2"
              >
                → Go to Review Queue to publish
              </Link>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="grid gap-5">
            <div>
              <label className="label" htmlFor="productName">
                Product Name
              </label>
              <input
                id="productName"
                className="field"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="store">
                Store
              </label>
              <select id="store" className="field" value={store} onChange={(e) => setStore(e.target.value)}>
                {STORE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="originalPrice">
                  Original Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="field pl-7"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="dealPrice">
                  Deal Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    id="dealPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="field pl-7"
                    value={dealPrice}
                    onChange={(e) => setDealPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {discountInfo ? (
              <p className="text-sm text-emerald-700">
                {discountInfo.pct}% off, save {formatMoney(discountInfo.save)}
              </p>
            ) : null}

            <div>
              <label className="label" htmlFor="sourceUrl">
                Source URL
              </label>
              <input
                id="sourceUrl"
                type="url"
                className="field"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="affiliateUrl">
                Affiliate URL <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="affiliateUrl"
                type="url"
                className="field"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="Leave empty to use Source URL"
              />
            </div>

            <div>
              <label className="label" htmlFor="imageUrl">
                Image URL
              </label>
              <div className="flex flex-wrap items-start gap-3">
                <input
                  id="imageUrl"
                  type="url"
                  className="field min-w-[200px] flex-1"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImgError(false);
                  }}
                  required
                />
                {imageUrl && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    width={50}
                    height={50}
                    className="h-[50px] w-[50px] rounded border border-gray-200 object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : null}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="extraNotes">
                Extra Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="extraNotes"
                className="field min-h-[88px]"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="e.g. Limited time offer, use promo code SAVE10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Deal →"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
