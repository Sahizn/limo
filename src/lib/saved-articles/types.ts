import type { SavedArticleEntry } from "@/lib/saved-articles/storage";

export interface UserSavedArticlesData {
  articles: SavedArticleEntry[];
  updatedAt: string;
}

export const EMPTY_SAVED_ARTICLES: UserSavedArticlesData = {
  articles: [],
  updatedAt: "",
};
