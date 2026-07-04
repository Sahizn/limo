import type { Article } from "@/lib/types/article";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json";
import { seedArticles } from "@/lib/data/seed-articles";

const FILE = "articles.json";

export async function getAllArticles(): Promise<Article[]> {
  const articles = await readJsonFile<Article[]>(FILE, seedArticles);
  return [...articles].sort(
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
  const articles = await readJsonFile<Article[]>(FILE, seedArticles);
  const index = articles.findIndex((a) => a.slug === article.slug);

  if (index >= 0) {
    articles[index] = article;
  } else {
    articles.unshift(article);
  }

  await writeJsonFile(FILE, articles);
}

export async function articleExistsBySourceUrl(url: string): Promise<boolean> {
  const articles = await getAllArticles();
  return articles.some((a) => a.sourceUrls?.includes(url) || a.sources.some((s) => s.url === url));
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}
