import { applySavedArticlesLimit } from "@/lib/saved-articles/limit";
import type { SavedArticleEntry } from "@/lib/saved-articles/storage";
import type { UserSavedArticlesData } from "@/lib/saved-articles/types";

function mergeEntriesBySlug(
  local: SavedArticleEntry[],
  remote: SavedArticleEntry[]
): SavedArticleEntry[] {
  const bySlug = new Map<string, SavedArticleEntry>();

  for (const entry of [...remote, ...local]) {
    const existing = bySlug.get(entry.article.slug);
    if (!existing || entry.savedAt > existing.savedAt) {
      bySlug.set(entry.article.slug, entry);
    }
  }

  return applySavedArticlesLimit(Array.from(bySlug.values()));
}

export function mergeSavedArticles(
  local: SavedArticleEntry[],
  remote: UserSavedArticlesData | null
): UserSavedArticlesData {
  if (!remote?.updatedAt) {
    return {
      articles: applySavedArticlesLimit(local),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    articles: mergeEntriesBySlug(local, remote.articles),
    updatedAt: remote.updatedAt,
  };
}

export function savedArticlesNeedCloudSync(
  merged: UserSavedArticlesData,
  remote: UserSavedArticlesData | null
): boolean {
  if (!remote?.updatedAt) return true;

  if (merged.articles.length !== remote.articles.length) return true;

  const remoteBySlug = new Map(
    remote.articles.map((entry) => [entry.article.slug, entry.savedAt])
  );

  return merged.articles.some(
    (entry) => remoteBySlug.get(entry.article.slug) !== entry.savedAt
  );
}
