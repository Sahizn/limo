import type { MetadataRoute } from "next";
import { categories, families } from "@/lib/data/categories";
import { getAllArticles } from "@/lib/storage/articles";
import { getAllTags } from "@/lib/storage/tags";

const BASE_URL = "https://limo-ochre.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const now = new Date();

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    {
      url: `${BASE_URL}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/favoris`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/recherche`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sign-in`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...families.map((family) => ({
      url: `${BASE_URL}/famille/${family.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${BASE_URL}/categorie/${category.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${BASE_URL}/article/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...tags.map((tag) => ({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastModified: new Date(tag.lastUsedAt ?? tag.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
