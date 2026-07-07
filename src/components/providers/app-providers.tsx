"use client";

import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import { SavedArticlesProvider } from "@/components/saved-articles/saved-articles-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <SavedArticlesProvider>{children}</SavedArticlesProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
