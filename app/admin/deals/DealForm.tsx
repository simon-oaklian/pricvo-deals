import Link from "next/link";
import { CATEGORIES } from "@/data/deals";
import { Deal } from "@/lib/deals";

type DealFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  deal?: Deal;
};

function toDateTimeLocalValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function DealForm({ title, description, submitLabel, action, deal }: DealFormProps) {
  return (
    <main className="page-shell">
      <div className="container-page py-8 md:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Admin</p>
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
            <p className="copy-soft">{description}</p>
          </div>
          <Link href="/admin/deals" className="btn-secondary">
            Back to deals
          </Link>
        </div>

        <section className="admin-card">
          <form action={action} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="label">
                  Title
                </label>
                <input id="title" name="title" className="field" defaultValue={deal?.title ?? ""} required />
              </div>
              <div>
                <label htmlFor="slug" className="label">
                  Slug (optional)
                </label>
                <input id="slug" name="slug" className="field" defaultValue={deal?.slug ?? ""} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="category" className="label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="field"
                  defaultValue={(deal?.category ?? "vanity").toLowerCase()}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="label">
                  Topic
                </label>
                <input id="topic" name="topic" className="field" defaultValue={deal?.topic ?? ""} required />
              </div>
              <div>
                <label htmlFor="store" className="label">
                  Store
                </label>
                <input id="store" name="store" className="field" defaultValue={deal?.store ?? ""} required />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="original_price" className="label">
                  Original price
                </label>
                <input
                  id="original_price"
                  name="original_price"
                  type="number"
                  min="0"
                  step="1"
                  className="field"
                  defaultValue={deal?.originalPrice ?? 0}
                  required
                />
              </div>
              <div>
                <label htmlFor="deal_price" className="label">
                  Deal price
                </label>
                <input
                  id="deal_price"
                  name="deal_price"
                  type="number"
                  min="0"
                  step="1"
                  className="field"
                  defaultValue={deal?.dealPrice ?? 0}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="image_url" className="label">
                Image URL
              </label>
              <input id="image_url" name="image_url" className="field" defaultValue={deal?.imageUrl ?? ""} required />
            </div>

            <div>
              <label htmlFor="affiliate_url" className="label">
                Affiliate URL
              </label>
              <input
                id="affiliate_url"
                name="affiliate_url"
                className="field"
                defaultValue={deal?.affiliateUrl ?? ""}
                required
              />
            </div>

            <div>
              <label htmlFor="source_url" className="label">
                Source URL
              </label>
              <input
                id="source_url"
                name="source_url"
                type="url"
                className="field"
                defaultValue={deal?.sourceUrl ?? ""}
                placeholder="Product page URL"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="field min-h-[110px]"
                defaultValue={deal?.description ?? ""}
                required
              />
            </div>

            <div>
              <label htmlFor="highlights" className="label">
                Highlights (one per line)
              </label>
              <textarea
                id="highlights"
                name="highlights"
                className="field min-h-[110px]"
                defaultValue={(deal?.highlights ?? []).join("\n")}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="tag" className="label">
                  Tag
                </label>
                <input id="tag" name="tag" className="field" defaultValue={deal?.tag ?? ""} required />
              </div>
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select id="status" name="status" className="field" defaultValue={deal?.status ?? "draft"}>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending review</option>
                  <option value="published">Published</option>
                  <option value="expired">Expired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="label mb-0 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
                  <input
                    type="checkbox"
                    name="featured_home"
                    defaultChecked={deal?.featuredHome ?? false}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-800">Featured home (carousel, max 3)</span>
                </label>
                <label className="label mb-0 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
                  <input
                    type="checkbox"
                    name="featured_topic"
                    defaultChecked={deal?.featuredTopic ?? false}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-800">Featured topic</span>
                </label>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="published_at" className="label">
                  Published at
                </label>
                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  className="field"
                  defaultValue={toDateTimeLocalValue(deal?.publishedAt ?? null)}
                />
              </div>
              <div>
                <label htmlFor="expires_at" className="label">
                  Expires at
                </label>
                <input
                  id="expires_at"
                  name="expires_at"
                  type="datetime-local"
                  className="field"
                  defaultValue={toDateTimeLocalValue(deal?.expiresAt ?? null)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary">
                {submitLabel}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
