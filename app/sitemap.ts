import type { MetadataRoute } from "next";
import { getAllPublishedDeals } from "@/lib/deals";

export default function sitemap(): MetadataRoute.Sitemap {
  const deals = getAllPublishedDeals();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://pricvo.com",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0
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

  return [...staticPages, ...dealPages];
}
