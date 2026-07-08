import type { UserFavoritesData } from "@/lib/favorites/types";

const FAVORITES_API = "/api/user/favorites";

export async function fetchRemoteFavorites(): Promise<UserFavoritesData | null> {
  const response = await fetch(FAVORITES_API, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as UserFavoritesData;
  if (!data.updatedAt) return null;

  return {
    categories: Array.isArray(data.categories)
      ? data.categories.filter((item): item is string => typeof item === "string")
      : [],
    favoritesOnly: Boolean(data.favoritesOnly),
    updatedAt: data.updatedAt,
  };
}

export async function pushRemoteFavorites(
  data: UserFavoritesData
): Promise<UserFavoritesData | null> {
  const response = await fetch(FAVORITES_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) return null;
  return (await response.json()) as UserFavoritesData;
}
