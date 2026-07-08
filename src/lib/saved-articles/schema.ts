import { z } from "zod";

const articleSourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const articleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.array(z.string()),
  categorySlug: z.string(),
  tagSlugs: z.array(z.string()),
  sources: z.array(articleSourceSchema),
  publishedAt: z.string(),
  isBreaking: z.boolean().optional(),
  sourceUrls: z.array(z.string()).optional(),
});

export const savedArticleEntrySchema = z.object({
  article: articleSchema,
  savedAt: z.string(),
});

export const savedArticlesPayloadSchema = z.object({
  articles: z.array(savedArticleEntrySchema),
  updatedAt: z.string().optional(),
});
