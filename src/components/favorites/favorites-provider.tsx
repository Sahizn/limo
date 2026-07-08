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
import { migrateAnonymousStorage } from "@/lib/auth/scoped-storage";
import {
  favoritesNeedCloudSync,
  mergeFavorites,
} from "@/lib/favorites/merge";
import {
  readFavoriteSlugs,
  readFavoritesOnly,
  writeFavoriteSlugs,
  writeFavoritesOnly,
  FAVORITES_STORAGE_KEY,
  FAVORITES_ONLY_KEY,
} from "@/lib/favorites/storage";
import type { UserFavoritesData } from "@/lib/favorites/types";
import {
  fetchRemoteFavorites,
  pushRemoteFavorites,
} from "@/lib/favorites/sync";

interface FavoritesContextValue {
  favorites: string[];
  favoritesOnly: boolean;
  isFavorite: (categorySlug: string) => boolean;
  toggleFavorite: (categorySlug: string) => void;
  setFavoritesOnly: (value: boolean) => void;
  userId: string | null;
  isSyncing: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const SYNC_DEBOUNCE_MS = 500;

function applyLocalFavorites(data: UserFavoritesData, userId: string | null) {
  writeFavoriteSlugs(data.categories, userId);
  writeFavoritesOnly(data.favoritesOnly, userId);
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? null;

  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnlyState] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const cloudStateRef = useRef<UserFavoritesData | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCloudSync = useCallback(
    (categories: string[], onlyFavorites: boolean) => {
      if (!userId) return;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        const payload: UserFavoritesData = {
          categories,
          favoritesOnly: onlyFavorites,
          updatedAt: cloudStateRef.current?.updatedAt ?? new Date().toISOString(),
        };

        void pushRemoteFavorites(payload).then((saved) => {
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
        FAVORITES_STORAGE_KEY,
        userId,
        JSON.parse,
        JSON.stringify
      );
      migrateAnonymousStorage(
        FAVORITES_ONLY_KEY,
        userId,
        (value) => value,
        (value) => String(value)
      );

      const localCategories = readFavoriteSlugs(userId);
      const localOnly = readFavoritesOnly(userId);
      const remote = await fetchRemoteFavorites();
      const merged = mergeFavorites(localCategories, localOnly, remote);

      applyLocalFavorites(merged, userId);
      setFavorites(merged.categories);
      setFavoritesOnlyState(merged.favoritesOnly);

      if (favoritesNeedCloudSync(merged, remote)) {
        const saved = await pushRemoteFavorites(merged);
        cloudStateRef.current = saved ?? merged;
      } else {
        cloudStateRef.current = remote ?? merged;
      }
    } catch {
      setFavorites(readFavoriteSlugs(userId));
      setFavoritesOnlyState(readFavoritesOnly(userId));
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      cloudStateRef.current = null;
      setFavorites(readFavoriteSlugs(null));
      setFavoritesOnlyState(readFavoritesOnly(null));
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

  const isFavorite = useCallback(
    (categorySlug: string) => favorites.includes(categorySlug),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (categorySlug: string) => {
      setFavorites((current) => {
        const next = current.includes(categorySlug)
          ? current.filter((slug) => slug !== categorySlug)
          : [...current, categorySlug];
        writeFavoriteSlugs(next, userId);
        scheduleCloudSync(next, favoritesOnly);
        return next;
      });
    },
    [userId, favoritesOnly, scheduleCloudSync]
  );

  const setFavoritesOnly = useCallback(
    (value: boolean) => {
      setFavoritesOnlyState(value);
      writeFavoritesOnly(value, userId);
      scheduleCloudSync(favorites, value);
    },
    [userId, favorites, scheduleCloudSync]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoritesOnly,
      isFavorite,
      toggleFavorite,
      setFavoritesOnly,
      userId,
      isSyncing,
    }),
    [
      favorites,
      favoritesOnly,
      isFavorite,
      toggleFavorite,
      setFavoritesOnly,
      userId,
      isSyncing,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  }
  return context;
}
