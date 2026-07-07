"use client";

import { useFavorites } from "@/components/favorites/favorites-provider";

export function HomeExtras({ children }: { children: React.ReactNode }) {
  const { favoritesOnly } = useFavorites();

  if (favoritesOnly) return null;

  return <>{children}</>;
}
