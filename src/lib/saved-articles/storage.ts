import { scopedStorageKey } from "@/lib/auth/scoped-storage";
import type { Article } from "@/lib/types/article";

export const SAVED_ARTICLES_STORAGE_KEY = "limo-saved-articles";

export interface SavedArticleEntry {
  article: Article;
  savedAt: string;
}

export function readSavedArticles(
  userId: string | null = null
): SavedArticleEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(
      scopedStorageKey(SAVED_ARTICLES_STORAGE_KEY, userId)
    );
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is SavedArticleEntry =>
        entry &&
        typeof entry === "object" &&
        typeof entry.savedAt === "string" &&
        entry.article &&
        typeof entry.article.slug === "string"
    );
  } catch {
    return [];
  }
}

export function writeSavedArticles(
  entries: SavedArticleEntry[],
  userId: string | null = null
): void {
  localStorage.setItem(
    scopedStorageKey(SAVED_ARTICLES_STORAGE_KEY, userId),
    JSON.stringify(entries)
  );
}
