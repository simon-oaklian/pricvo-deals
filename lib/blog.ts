import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  bodyHtml: string;
  canonicalUrl: string;
  publishedAt: string;
  updatedAt?: string;
  schemaOrg?: Record<string, unknown>;
};

const BLOG_DIR = path.join(process.cwd(), "content", "seo-posts");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizePost(value: unknown): BlogPost | null {
  if (!isRecord(value)) return null;
  const slug = typeof value.slug === "string" ? value.slug : "";
  const title = typeof value.title === "string" ? value.title : "";
  const bodyHtml = typeof value.bodyHtml === "string" ? value.bodyHtml : "";
  if (!slug || !title || !bodyHtml) return null;

  return {
    slug,
    title,
    description: typeof value.description === "string" ? value.description : "",
    bodyHtml,
    canonicalUrl: typeof value.canonicalUrl === "string" ? value.canonicalUrl : `https://pricvo.com/blog/${slug}`,
    publishedAt: typeof value.publishedAt === "string" ? value.publishedAt : new Date(0).toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    schemaOrg: isRecord(value.schemaOrg) ? value.schemaOrg : undefined
  };
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      try {
        const raw = fs.readFileSync(path.join(BLOG_DIR, name), "utf8");
        return normalizePost(JSON.parse(raw));
      } catch {
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return normalizePost(JSON.parse(fs.readFileSync(filePath, "utf8")));
  } catch {
    return null;
  }
}
