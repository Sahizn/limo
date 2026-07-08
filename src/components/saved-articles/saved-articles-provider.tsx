"use client";

import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Article } from "@/lib/types/article";
import { migrateAnonymousStorage } from "@/lib/auth/scoped-storage";
import {
  getSavedArticlesLimit,
  isPremiumUser,
} from "@/lib/saved-articles/constants";
import { applySavedArticlesLimit } from "@/lib/saved-articles/limit";
import {
  mergeSavedArticles,
  savedArticlesNeedCloudSync,
} from "@/lib/saved-articles/merge";
import {
  readSavedArticles,
  writeSavedArticles,
  SAVED_ARTICLES_STORAGE_KEY,
  type SavedArticleEntry,
} from "@/lib/saved-articles/storage";
import {
  fetchRemoteSavedArticles,
  pushRemoteSavedArticles,
} from "@/lib/saved-articles/sync";
import type { UserSavedArticlesData } from "@/lib/saved-articles/types";

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
  isSyncing: boolean;
}

const SavedArticlesContext = createContext<SavedArticlesContextValue | null>(
  null
);
const SYNC_DEBOUNCE_MS = 500;

function applyLocalSavedArticles(
  data: UserSavedArticlesData,
  userId: string | null
) {
  writeSavedArticles(data.articles, userId);
}

export function SavedArticlesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? null;

  const [savedArticles, setSavedArticles] = useState<SavedArticleEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isPremium = isPremiumUser();
  const limit = getSavedArticlesLimit();

  const cloudStateRef = useRef<UserSavedArticlesData | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCloudSync = useCallback(
    (articles: SavedArticleEntry[]) => {
      if (!userId) return;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        const payload: UserSavedArticlesData = {
          articles,
          updatedAt:
            cloudStateRef.current?.updatedAt ?? new Date().toISOString(),
        };

        void pushRemoteSavedArticles(payload).then((saved) => {
          if (saved) {
            cloudStateRef.current = saved;
          }
        });
      }, SYNC_DEBOUNCE_MS);
    },
    [userId]
  );

  const pullFromCloud = useCallback(async () => {
    if (!userId) return;

    setIsSyncing(true);

    try {
      migrateAnonymousStorage(
        SAVED_ARTICLES_STORAGE_KEY,
        userId,
        JSON.parse,
        JSON.stringify
      );

      const localArticles = readSavedArticles(userId);
      const remote = await fetchRemoteSavedArticles();
      const merged = mergeSavedArticles(localArticles, remote);

      applyLocalSavedArticles(merged, userId);
      setSavedArticles(merged.articles);

      if (savedArticlesNeedCloudSync(merged, remote)) {
        const saved = await pushRemoteSavedArticles(merged);
        cloudStateRef.current = saved ?? merged;
      } else {
        cloudStateRef.current = remote ?? merged;
      }
    } catch {
      setSavedArticles(readSavedArticles(userId));
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      cloudStateRef.current = null;
      setSavedArticles(readSavedArticles(null));
      return;
    }

    void pullFromCloud();
  }, [userId, isLoaded, pullFromCloud]);

  useEffect(() => {
    if (!userId) return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void pullFromCloud();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [userId, pullFromCloud]);

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

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
        const next = applySavedArticlesLimit([entry, ...current]);
        writeSavedArticles(next, userId);
        scheduleCloudSync(next);
        return next;
      });

      return { ok: true };
    },
    [isPremium, isSaved, limit, savedArticles.length, userId, scheduleCloudSync]
  );

  const removeArticle = useCallback(
    (slug: string) => {
      setSavedArticles((current) => {
        const next = current.filter((entry) => entry.article.slug !== slug);
        writeSavedArticles(next, userId);
        scheduleCloudSync(next);
        return next;
      });
    },
    [userId, scheduleCloudSync]
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
      isSyncing,
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
      isSyncing,
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
