import type { MetadataRoute } from "next";
import { getAllPublishedDeals } from "@/lib/deals";
import { getAllBlogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const deals = getAllPublishedDeals();
  const posts = getAllBlogPosts();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://pricvo.com",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: "https://pricvo.com/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: "https://pricvo.com/category/bathroom-vanity",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: "https://pricvo.com/category/bathroom-mirror",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: "https://pricvo.com/affiliate-disclosure",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: "https://pricvo.com/privacy-policy",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: "https://pricvo.com/terms",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];

  const dealPages: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `https://pricvo.com/deals/${deal.id}`,
    lastModified: new Date(deal.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://pricvo.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65
  }));

  return [...staticPages, ...dealPages, ...blogPages];
}
