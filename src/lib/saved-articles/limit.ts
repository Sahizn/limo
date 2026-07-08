import { getSavedArticlesLimit } from "@/lib/saved-articles/constants";
import type { SavedArticleEntry } from "@/lib/saved-articles/storage";

export function sortSavedArticles(entries: SavedArticleEntry[]): SavedArticleEntry[] {
  return [...entries].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function applySavedArticlesLimit(
  entries: SavedArticleEntry[]
): SavedArticleEntry[] {
  const limit = getSavedArticlesLimit();
  const sorted = sortSavedArticles(entries);

  if (!Number.isFinite(limit)) {
    return sorted;
  }

  return sorted.slice(0, limit);
}
