"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession, validateAdminPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDealById } from "@/lib/deals";

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: FormDataEntryValue | null) {
  const parsed = Number(normalizeString(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeDate(value: FormDataEntryValue | null) {
  const raw = normalizeString(value);
  if (!raw) {
    return null;
  }
  return new Date(raw).toISOString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHighlights(value: FormDataEntryValue | null) {
  return normalizeString(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

function normalizeDealPayload(formData: FormData) {
  const title = normalizeString(formData.get("title"));
  const explicitSlug = normalizeString(formData.get("slug"));
  const status = normalizeString(formData.get("status")) || "draft";
  const publishedAtInput = normalizeDate(formData.get("published_at"));
  const expiresAtInput = normalizeDate(formData.get("expires_at"));
  const now = new Date().toISOString();

  return {
    title,
    slug: explicitSlug || slugify(title),
    category: normalizeString(formData.get("category")),
    topic: normalizeString(formData.get("topic")),
    store: normalizeString(formData.get("store")),
    originalPrice: normalizeNumber(formData.get("original_price")),
    dealPrice: normalizeNumber(formData.get("deal_price")),
    imageUrl: normalizeString(formData.get("image_url")),
    affiliateUrl: normalizeString(formData.get("affiliate_url")),
    description: normalizeString(formData.get("description")),
    highlights: normalizeHighlights(formData.get("highlights")),
    tag: normalizeString(formData.get("tag")),
    status,
    publishedAt: status === "published" ? publishedAtInput || now : publishedAtInput,
    expiresAt: status === "expired" ? expiresAtInput || now : expiresAtInput,
    updatedAt: now,
    featuredHome: formData.get("featured_home") === "on" ? 1 : 0,
    featuredTopic: formData.get("featured_topic") === "on" ? 1 : 0,
    aiGenerated: 0,
    reviewerNote: "",
    sourceUrl: normalizeString(formData.get("source_url")),
    retailerRegion: "US"
  };
}

function revalidateDealPaths(slug: string, dealId?: number) {
  const paths: string[] = [
    "/",
    "/vanity-deals",
    "/brands",
    "/under-1000",
    "/seo-pages",
    "/36-inch-vanity-deals",
    "/double-sink-vanity-sale",
    "/mattress-clearance",
    `/deal/${slug}`,
    "/admin/deals",
    "/admin/review",
    "/admin/generate"
  ];
  if (dealId != null) {
    paths.push(`/deals/${dealId}`);
  }

  paths.forEach((path) => revalidatePath(path));
}

export async function loginAction(formData: FormData) {
  const password = normalizeString(formData.get("password"));

  if (!validateAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin/deals");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createDealAction(formData: FormData) {
  const payload = normalizeDealPayload(formData);

  const result = db.prepare(
    `
    INSERT INTO deals (
      title,
      slug,
      category,
      topic,
      store,
      original_price,
      deal_price,
      image_url,
      affiliate_url,
      description,
      highlights,
      tag,
      status,
      published_at,
      expires_at,
      updated_at,
      featured_home,
      featured_topic,
      ai_generated,
      reviewer_note,
      source_url,
      retailer_region
    ) VALUES (
      @title,
      @slug,
      @category,
      @topic,
      @store,
      @originalPrice,
      @dealPrice,
      @imageUrl,
      @affiliateUrl,
      @description,
      @highlights,
      @tag,
      @status,
      @publishedAt,
      @expiresAt,
      @updatedAt,
      @featuredHome,
      @featuredTopic,
      @aiGenerated,
      @reviewerNote,
      @sourceUrl,
      @retailerRegion
    )
    `
  ).run(payload);

  revalidateDealPaths(payload.slug, Number(result.lastInsertRowid));
  redirect("/admin/deals");
}

export async function updateDealAction(id: number, formData: FormData) {
  const existing = getDealById(id);
  if (!existing) {
    redirect("/admin/deals");
  }

  const payload = normalizeDealPayload(formData);

  db.prepare(
    `
    UPDATE deals
    SET
      title = @title,
      slug = @slug,
      category = @category,
      topic = @topic,
      store = @store,
      original_price = @originalPrice,
      deal_price = @dealPrice,
      image_url = @imageUrl,
      affiliate_url = @affiliateUrl,
      description = @description,
      highlights = @highlights,
      tag = @tag,
      status = @status,
      published_at = @publishedAt,
      expires_at = @expiresAt,
      updated_at = @updatedAt,
      featured_home = @featuredHome,
      featured_topic = @featuredTopic,
      ai_generated = @aiGenerated,
      reviewer_note = @reviewerNote,
      source_url = @sourceUrl,
      retailer_region = @retailerRegion
    WHERE id = @id
    `
  ).run({
    id,
    ...payload,
    aiGenerated: existing.aiGenerated ? 1 : 0,
    reviewerNote: existing.reviewerNote,
    sourceUrl: payload.sourceUrl || existing.sourceUrl,
    retailerRegion: existing.retailerRegion || "US"
  });

  revalidateDealPaths(payload.slug, id);
  redirect("/admin/deals");
}

export async function publishDeal(id: number, reviewerNote: string): Promise<void> {
  const existing = getDealById(id);
  if (!existing) {
    return;
  }
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE deals
    SET status = 'published',
        published_at = @publishedAt,
        updated_at = @updatedAt,
        reviewer_note = @reviewerNote
    WHERE id = @id
    `
  ).run({
    id,
    publishedAt: now,
    updatedAt: now,
    reviewerNote: reviewerNote.trim()
  });

  revalidateDealPaths(existing.slug, id);
  revalidatePath("/admin/review");
}

export async function rejectDeal(id: number, reviewerNote: string): Promise<void> {
  const existing = getDealById(id);
  if (!existing) {
    return;
  }
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE deals
    SET status = 'rejected',
        updated_at = @updatedAt,
        reviewer_note = @reviewerNote
    WHERE id = @id
    `
  ).run({
    id,
    updatedAt: now,
    reviewerNote: reviewerNote.trim()
  });

  revalidatePath(`/deals/${id}`);
  revalidatePath("/admin/review");
}
