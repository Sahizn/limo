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
import { migrateAnonymousStorage } from "@/lib/auth/scoped-storage";
import {
  readFavoriteSlugs,
  readFavoritesOnly,
  writeFavoriteSlugs,
  writeFavoritesOnly,
  FAVORITES_STORAGE_KEY,
  FAVORITES_ONLY_KEY,
} from "@/lib/favorites/storage";

interface FavoritesContextValue {
  favorites: string[];
  favoritesOnly: boolean;
  isFavorite: (categorySlug: string) => boolean;
  toggleFavorite: (categorySlug: string) => void;
  setFavoritesOnly: (value: boolean) => void;
  userId: string | null;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? null;

  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnlyState] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (userId) {
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
    }

    setFavorites(readFavoriteSlugs(userId));
    setFavoritesOnlyState(readFavoritesOnly(userId));
  }, [userId, isLoaded]);

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
        return next;
      });
    },
    [userId]
  );

  const setFavoritesOnly = useCallback(
    (value: boolean) => {
      setFavoritesOnlyState(value);
      writeFavoritesOnly(value, userId);
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoritesOnly,
      isFavorite,
      toggleFavorite,
      setFavoritesOnly,
      userId,
    }),
    [favorites, favoritesOnly, isFavorite, toggleFavorite, setFavoritesOnly, userId]
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
