import type { Article } from "@/lib/types/article";
import { extractEntities } from "@/lib/engine/entity-extractor";
import { resolveEntities } from "@/lib/engine/tag-resolver";
import { syncTagStats } from "@/lib/engine/tag-analytics";
import { getAllArticles, saveArticles } from "@/lib/storage/articles";

export interface RetagResult {
  processed: number;
  updated: number;
  errors: string[];
}

export async function retagAllArticles(): Promise<RetagResult> {
  const articles = await getAllArticles();
  const result: RetagResult = {
    processed: 0,
    updated: 0,
    errors: [],
  };

  const updatedArticles: Article[] = [];

  for (const article of articles) {
    result.processed++;

    try {
      const entities = await extractEntities({
        title: article.title,
        summary: article.summary,
        sourceTitles: article.sources.map((s) => s.name),
      });

      const tagSlugs = await resolveEntities(entities);

      const mergedSlugs = [...new Set([...article.tagSlugs, ...tagSlugs])];

      if (
        mergedSlugs.length !== article.tagSlugs.length ||
        !mergedSlugs.every((s) => article.tagSlugs.includes(s))
      ) {
        result.updated++;
        updatedArticles.push({ ...article, tagSlugs: mergedSlugs });
      } else {
        updatedArticles.push(article);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      result.errors.push(`${article.slug}: ${message}`);
      updatedArticles.push(article);
    }
  }

  await saveArticles(updatedArticles);
  await syncTagStats();

  return result;
}

export async function retagArticle(slug: string): Promise<string[]> {
  const articles = await getAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return [];

  const entities = await extractEntities({
    title: article.title,
    summary: article.summary,
    sourceTitles: article.sources.map((s) => s.name),
  });

  const tagSlugs = await resolveEntities(entities);
  const mergedSlugs = [...new Set([...article.tagSlugs, ...tagSlugs])];

  const updated = articles.map((a) =>
    a.slug === slug ? { ...a, tagSlugs: mergedSlugs } : a
  );
  await saveArticles(updated);
  await syncTagStats();

  return mergedSlugs;
}
