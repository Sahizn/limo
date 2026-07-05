import type { Article } from "@/lib/types/article";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json";
import { seedArticles } from "@/lib/data/seed-articles";

const FILE = "articles.json";
export const MAX_ARTICLE_AGE_DAYS = 7;

async function getStoredArticles(): Promise<Article[]> {
  return readJsonFile<Article[]>(FILE, seedArticles);
}

function isRecentArticle(article: Article): boolean {
  const cutoff = Date.now() - MAX_ARTICLE_AGE_DAYS * 24 * 60 * 60 * 1000;
  return new Date(article.publishedAt).getTime() >= cutoff;
}

function filterRecentArticles(articles: Article[]): Article[] {
  return articles.filter(isRecentArticle);
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await getStoredArticles();
  return filterRecentArticles(articles).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((a) => a.tagSlugs.includes(tagSlug));
}

export async function saveArticles(articles: Article[]): Promise<void> {
  await writeJsonFile(FILE, articles);
}

export async function upsertArticle(article: Article): Promise<void> {
  const articles = await getStoredArticles();
  const index = articles.findIndex((a) => a.slug === article.slug);

  if (index >= 0) {
    articles[index] = article;
  } else {
    articles.unshift(article);
  }

  await writeJsonFile(FILE, articles);
}

export async function articleExistsBySourceUrl(url: string): Promise<boolean> {
  const articles = await getStoredArticles();
  return articles.some((a) => a.sourceUrls?.includes(url) || a.sources.some((s) => s.url === url));
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}

/** Lecture interne sans filtre de date (ingestion, maintenance). */
export { getStoredArticles };
