import { slugify } from "@/lib/utils";
import type { Article } from "@/lib/types/article";
import type { IngestResult } from "@/lib/types/engine";
import type { RssFeedItem } from "@/lib/rss/types";
import { fetchAllFeeds } from "@/lib/rss/fetcher";
import { synthesizeArticle } from "@/lib/engine/synthesize";
import { extractEntities } from "@/lib/engine/entity-extractor";
import { resolveEntities } from "@/lib/engine/tag-resolver";
import { syncTagStats } from "@/lib/engine/tag-analytics";
import {
  articleExistsBySourceUrl,
  getAllArticles,
  saveArticles,
} from "@/lib/storage/articles";
import { getProcessedUrls, markUrlsProcessed } from "@/lib/storage/processed";
import { seedArticles } from "@/lib/data/seed-articles";
import { seedTags } from "@/lib/data/seed-tags";
import { saveTags } from "@/lib/storage/tags";
import { readJsonFile } from "@/lib/storage/json";

const MAX_ARTICLES_PER_RUN = 5;
const MAX_STORED_ARTICLES = 200;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function similarity(a: RssFeedItem, b: RssFeedItem): number {
  const wordsA = tokenize(a.title);
  const wordsB = tokenize(b.title);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) overlap++;
  }

  return overlap / Math.max(wordsA.size, wordsB.size);
}

function clusterItems(items: RssFeedItem[]): RssFeedItem[][] {
  const clusters: RssFeedItem[][] = [];
  const used = new Set<string>();

  for (const item of items) {
    if (used.has(item.link)) continue;

    const cluster = [item];
    used.add(item.link);

    for (const other of items) {
      if (used.has(other.link)) continue;
      if (similarity(item, other) >= 0.35) {
        cluster.push(other);
        used.add(other.link);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function buildUniqueSlug(title: string, existingSlugs: Set<string>): string {
  const base = slugify(title).slice(0, 80) || "article";
  let slug = base;
  let counter = 2;

  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

export async function initializeStore(): Promise<void> {
  const articles = await readJsonFile("articles.json", null);
  const tags = await readJsonFile("tags.json", null);

  if (!articles) await saveArticles(seedArticles);
  if (!tags) await saveTags(seedTags);
}

export async function runIngestion(options?: {
  maxArticles?: number;
}): Promise<IngestResult> {
  await initializeStore();

  const maxArticles = options?.maxArticles ?? MAX_ARTICLES_PER_RUN;
  const result: IngestResult = {
    fetched: 0,
    processed: 0,
    published: 0,
    skipped: 0,
    errors: [],
    articles: [],
  };

  const [allItems, processedUrls, existingArticles] = await Promise.all([
    fetchAllFeeds(6),
    getProcessedUrls(),
    getAllArticles(),
  ]);

  result.fetched = allItems.length;

  const newItems = allItems.filter((item) => !processedUrls.has(item.link));
  const clusters = clusterItems(newItems);

  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  const newArticles: Article[] = [];

  for (const cluster of clusters) {
    if (result.published >= maxArticles) break;

    const alreadyExists = await Promise.all(
      cluster.map((item) => articleExistsBySourceUrl(item.link))
    );

    if (alreadyExists.some(Boolean)) {
      result.skipped += cluster.length;
      await markUrlsProcessed(cluster.map((i) => i.link));
      continue;
    }

    result.processed++;

    try {
      const defaultCategory =
        cluster[0].defaultCategorySlug || "politique";

      const synthesis = await synthesizeArticle({
        items: cluster,
        defaultCategorySlug: defaultCategory,
      });

      const synthesisEntities = synthesis.entities.map((e) => ({
        name: e.name,
        type: e.type,
      }));

      const extractedEntities = await extractEntities({
        title: synthesis.title,
        summary: synthesis.summary,
        sourceTitles: cluster.map((i) => i.title),
      });

      const allEntities = [
        ...synthesisEntities.map((e) => ({
          name: e.name,
          type: e.type as typeof extractedEntities[0]["type"],
        })),
        ...extractedEntities,
      ];

      const tagSlugs = await resolveEntities(allEntities);

      const slug = buildUniqueSlug(synthesis.title, existingSlugs);
      existingSlugs.add(slug);

      const article: Article = {
        slug,
        title: synthesis.title,
        summary: synthesis.summary,
        categorySlug: synthesis.categorySlug,
        tagSlugs,
        sources: cluster.map((item) => ({
          name: item.sourceName,
          url: item.link,
        })),
        sourceUrls: cluster.map((item) => item.link),
        publishedAt: cluster[0].publishedAt,
        isBreaking: synthesis.isBreaking,
      };

      newArticles.push(article);
      result.published++;
      result.articles.push(slug);

      await markUrlsProcessed(cluster.map((i) => i.link));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      result.errors.push(message);
      result.skipped += cluster.length;
      console.error("[Ingestion] Erreur cluster:", error);
    }
  }

  if (newArticles.length > 0) {
    const merged = [...newArticles, ...existingArticles]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, MAX_STORED_ARTICLES);

    await saveArticles(merged);
  }

  await syncTagStats();

  return result;
}
