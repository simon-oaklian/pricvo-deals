import type { Category } from "@/data/deals";
import { db } from "@/lib/db";

export type DealStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "expired"
  | "rejected";

export type Deal = {
  id: number;
  title: string;
  slug: string;
  category: Category;
  topic: string;
  store: string;
  originalPrice: number;
  dealPrice: number;
  imageUrl: string;
  affiliateUrl: string;
  description: string;
  highlights: string[];
  tag: string;
  status: DealStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  updatedAt: string;
  featuredHome: boolean;
  featuredTopic: boolean;
  aiGenerated: boolean;
  reviewerNote: string;
  sourceUrl: string;
  retailerRegion: string;
  isExpired: boolean;
};

type DealRow = {
  id: number;
  title: string;
  slug: string;
  category: string;
  topic: string;
  store: string;
  original_price: number;
  deal_price: number;
  image_url: string;
  affiliate_url: string;
  description: string;
  highlights: string;
  tag: string;
  status: string;
  published_at: string | null;
  expires_at: string | null;
  updated_at: string;
  featured_home: number;
  featured_topic: number;
  ai_generated?: number;
  reviewer_note?: string;
  source_url?: string;
  retailer_region?: string;
};

function isExpiredValue(status: string, expiresAt: string | null): boolean {
  if (status === "expired") {
    return true;
  }
  if (!expiresAt) {
    return false;
  }
  return new Date(expiresAt).getTime() <= Date.now();
}

function mapRow(row: DealRow): Deal {
  const highlightsRaw = row.highlights ?? "";
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category as Category,
    topic: row.topic,
    store: row.store,
    originalPrice: row.original_price,
    dealPrice: row.deal_price,
    imageUrl: row.image_url,
    affiliateUrl: row.affiliate_url,
    description: row.description,
    highlights: highlightsRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    tag: row.tag,
    status: row.status as DealStatus,
    publishedAt: row.published_at,
    expiresAt: row.expires_at,
    updatedAt: row.updated_at,
    featuredHome: Boolean(row.featured_home),
    featuredTopic: Boolean(row.featured_topic),
    aiGenerated: Boolean(row.ai_generated ?? 0),
    reviewerNote: row.reviewer_note ?? "",
    sourceUrl: row.source_url ?? "",
    retailerRegion: row.retailer_region ?? "US",
    isExpired: isExpiredValue(row.status, row.expires_at)
  };
}

export function getAllPublishedDeals(): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE status = 'published'
      ORDER BY published_at DESC
      `
    )
    .all() as DealRow[];

  return rows.map(mapRow);
}

export function getFeaturedHomeDeals(): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE status = 'published'
        AND featured_home = 1
      ORDER BY published_at DESC
      LIMIT 6
      `
    )
    .all() as DealRow[];

  return rows.map(mapRow);
}

export function getDealById(id: number): Deal | null {
  const row = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE id = ?
      LIMIT 1
      `
    )
    .get(id) as DealRow | undefined;

  return row ? mapRow(row) : null;
}

export function getDealsByCategory(category: string): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE status = 'published'
        AND category = ?
      ORDER BY published_at DESC
      `
    )
    .all(category) as DealRow[];

  return rows.map(mapRow);
}

export function getPendingReviewDeals(): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE status = 'pending_review'
      ORDER BY updated_at DESC
      `
    )
    .all() as DealRow[];

  return rows.map(mapRow);
}

export function getAllDealsAdmin(): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      ORDER BY updated_at DESC, id DESC
      `
    )
    .all() as DealRow[];

  return rows.map(mapRow);
}

export function getPendingReviewCount(): number {
  const row = db
    .prepare(
      `
      SELECT COUNT(*) AS c
      FROM deals
      WHERE status = 'pending_review'
      `
    )
    .get() as { c: number };

  return Number(row.c);
}

/** Same category, published, not expired, excluding one id — for related deals on detail page */
export function getRelatedPublishedDeals(
  category: string,
  excludeId: number,
  limit = 4
): Deal[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM deals
      WHERE status = 'published'
        AND category = ?
        AND id != ?
      ORDER BY published_at DESC
      LIMIT ?
      `
    )
    .all(category, excludeId, Math.max(limit * 3, 8)) as DealRow[];

  return rows
    .map(mapRow)
    .filter((d) => !d.isExpired)
    .slice(0, limit);
}
