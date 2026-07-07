"use client";

import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Article } from "@/lib/types/article";
import { migrateAnonymousStorage } from "@/lib/auth/scoped-storage";
import {
  getSavedArticlesLimit,
  isPremiumUser,
} from "@/lib/saved-articles/constants";
import {
  readSavedArticles,
  writeSavedArticles,
  SAVED_ARTICLES_STORAGE_KEY,
  type SavedArticleEntry,
} from "@/lib/saved-articles/storage";

type SaveResult = { ok: true } | { ok: false; reason: "limit" | "exists" };

interface SavedArticlesContextValue {
  savedArticles: SavedArticleEntry[];
  limit: number;
  isPremium: boolean;
  remainingSlots: number;
  isSaved: (slug: string) => boolean;
  getSavedArticle: (slug: string) => SavedArticleEntry | undefined;
  saveArticle: (article: Article) => SaveResult;
  removeArticle: (slug: string) => void;
  userId: string | null;
}

const SavedArticlesContext = createContext<SavedArticlesContextValue | null>(
  null
);

export function SavedArticlesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? null;

  const [savedArticles, setSavedArticles] = useState<SavedArticleEntry[]>([]);
  const isPremium = isPremiumUser();
  const limit = getSavedArticlesLimit();

  useEffect(() => {
    if (!isLoaded) return;

    if (userId) {
      migrateAnonymousStorage(
        SAVED_ARTICLES_STORAGE_KEY,
        userId,
        JSON.parse,
        JSON.stringify
      );
    }

    setSavedArticles(readSavedArticles(userId));
  }, [userId, isLoaded]);

  const isSaved = useCallback(
    (slug: string) => savedArticles.some((entry) => entry.article.slug === slug),
    [savedArticles]
  );

  const getSavedArticle = useCallback(
    (slug: string) =>
      savedArticles.find((entry) => entry.article.slug === slug),
    [savedArticles]
  );

  const saveArticle = useCallback(
    (article: Article): SaveResult => {
      if (isSaved(article.slug)) {
        return { ok: false, reason: "exists" };
      }

      if (!isPremium && savedArticles.length >= limit) {
        return { ok: false, reason: "limit" };
      }

      const entry: SavedArticleEntry = {
        article,
        savedAt: new Date().toISOString(),
      };

      setSavedArticles((current) => {
        const next = [entry, ...current];
        writeSavedArticles(next, userId);
        return next;
      });

      return { ok: true };
    },
    [isPremium, isSaved, limit, savedArticles.length, userId]
  );

  const removeArticle = useCallback(
    (slug: string) => {
      setSavedArticles((current) => {
        const next = current.filter((entry) => entry.article.slug !== slug);
        writeSavedArticles(next, userId);
        return next;
      });
    },
    [userId]
  );

  const remainingSlots = isPremium
    ? Infinity
    : Math.max(0, limit - savedArticles.length);

  const value = useMemo(
    () => ({
      savedArticles,
      limit,
      isPremium,
      remainingSlots,
      isSaved,
      getSavedArticle,
      saveArticle,
      removeArticle,
      userId,
    }),
    [
      savedArticles,
      limit,
      isPremium,
      remainingSlots,
      isSaved,
      getSavedArticle,
      saveArticle,
      removeArticle,
      userId,
    ]
  );

  return (
    <SavedArticlesContext.Provider value={value}>
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext);
  if (!context) {
    throw new Error(
      "useSavedArticles doit être utilisé dans SavedArticlesProvider"
    );
  }
  return context;
}
