import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

type Body = {
  productName?: string;
  category?: string;
  store?: string;
  originalPrice?: number;
  dealPrice?: number;
  sourceUrl?: string;
  affiliateUrl?: string;
  imageUrl?: string;
  extraNotes?: string;
};

type AiJson = {
  title: string;
  description: string;
  highlights: string;
  tag: string;
  topic: string;
};

function makeSlug(productName: string): string {
  const suffix = String(Date.now()).slice(-4);
  const base = productName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "deal"}-${suffix}`;
}

function parseAiJson(text: string): AiJson {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as AiJson;
  if (
    typeof parsed.title !== "string" ||
    typeof parsed.description !== "string" ||
    typeof parsed.highlights !== "string" ||
    typeof parsed.tag !== "string" ||
    typeof parsed.topic !== "string"
  ) {
    throw new Error("invalid shape");
  }
  return parsed;
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const adminToken = process.env.ADMIN_TOKEN;
  const auth = request.headers.get("authorization");
  if (!adminToken || auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const productName = (body.productName ?? "").trim();
  const category = (body.category ?? "").trim().toLowerCase();
  const store = (body.store ?? "").trim();
  const originalPrice = Number(body.originalPrice);
  const dealPrice = Number(body.dealPrice);
  const sourceUrl = (body.sourceUrl ?? "").trim();
  const imageUrl = (body.imageUrl ?? "").trim();
  const affiliateUrl = (body.affiliateUrl ?? "").trim() || sourceUrl;
  const extraNotes = (body.extraNotes ?? "").trim();

  if (!productName || !store || !sourceUrl || !imageUrl) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  if (category !== "vanity" && category !== "mirror") {
    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  }

  if (!Number.isFinite(originalPrice) || !Number.isFinite(dealPrice)) {
    return NextResponse.json({ message: "Invalid prices" }, { status: 400 });
  }

  if (originalPrice <= dealPrice) {
    return NextResponse.json({ message: "originalPrice must be greater than dealPrice" }, { status: 400 });
  }

  const discountPct = Math.max(0, Math.round(((originalPrice - dealPrice) / originalPrice) * 100));

  const prompt = `You are a copywriter for Pricvo, a US home deals website focused on bathroom vanities and mirrors.
Write a product deal listing for the following item.

Product: ${productName}
Category: ${category}
Store: ${store}
Original Price: $${originalPrice}
Deal Price: $${dealPrice}
Discount: ${discountPct}% off
Extra notes: ${extraNotes || "none"}

Return ONLY a JSON object with these exact fields, no other text:
{
  "title": "concise product title, max 60 chars, highlight key feature",
  "description": "2-3 sentence product description, factual, no hype words like 'amazing' or 'stunning'",
  "highlights": "3 bullet points separated by newline \\n, each under 50 chars, focus on specs and features",
  "tag": "one short label like 'Best Seller' or 'Top Pick' or 'Editor Choice' or 'Value Pick' or 'Premium'",
  "topic": "one of: vanity-deals / 36-inch-vanity-deals / double-sink-vanity-sale / mirror-deals / under-1000"
}

Rules:
- title must not repeat the store name
- description must not include price information
- highlights must be factual specs only, no marketing language
- Do not use words: amazing, stunning, gorgeous, perfect, luxury (unless in product name)
- This is a US market product`;

  let aiText: string;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!res.ok) {
      return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const block = data.content?.[0];
    aiText = block?.type === "text" && block.text ? block.text : "";
    if (!aiText) {
      return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
  }

  let ai: AiJson;
  try {
    ai = parseAiJson(aiText);
  } catch {
    return NextResponse.json({ message: "Invalid AI response format" }, { status: 500 });
  }

  const now = new Date().toISOString();
  let slug = makeSlug(productName);
  let lastErr: unknown;

  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) {
      slug = `${makeSlug(productName)}-${Math.random().toString(36).slice(2, 8)}`;
    }
    try {
      const result = db
        .prepare(
          `
        INSERT INTO deals (
          title, slug, category, topic, store, original_price, deal_price,
          image_url, affiliate_url, source_url, description, highlights, tag,
          status, published_at, expires_at, updated_at,
          ai_generated, reviewer_note, retailer_region, featured_home, featured_topic
        ) VALUES (
          @title, @slug, @category, @topic, @store, @original_price, @deal_price,
          @image_url, @affiliate_url, @source_url, @description, @highlights, @tag,
          'pending_review', NULL, NULL, @updated_at,
          1, '', 'US', 0, 0
        )
        `
        )
        .run({
          title: ai.title.slice(0, 200),
          slug,
          category,
          topic: ai.topic,
          store,
          original_price: originalPrice,
          deal_price: dealPrice,
          image_url: imageUrl,
          affiliate_url: affiliateUrl,
          source_url: sourceUrl,
          description: ai.description,
          highlights: ai.highlights,
          tag: ai.tag,
          updated_at: now
        });

      const dealId = Number(result.lastInsertRowid);
      revalidatePath("/admin/review");
      revalidatePath("/admin/generate");
      revalidatePath("/");
      return NextResponse.json({
        success: true,
        dealId,
        preview: {
          title: ai.title,
          description: ai.description,
          tag: ai.tag,
          topic: ai.topic
        }
      });
    } catch (e) {
      lastErr = e;
    }
  }

  console.error(lastErr);
  return NextResponse.json({ message: "Database error" }, { status: 500 });
}
