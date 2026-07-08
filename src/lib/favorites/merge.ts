import type { UserFavoritesData } from "@/lib/favorites/types";

export function mergeCategorySlugs(local: string[], remote: string[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const slug of [...remote, ...local]) {
    if (!seen.has(slug)) {
      seen.add(slug);
      merged.push(slug);
    }
  }

  return merged;
}

export function mergeFavorites(
  localCategories: string[],
  localFavoritesOnly: boolean,
  remote: UserFavoritesData | null
): UserFavoritesData {
  if (!remote || !remote.updatedAt) {
    return {
      categories: localCategories,
      favoritesOnly: localFavoritesOnly,
      updatedAt: new Date().toISOString(),
    };
  }

  const categories = mergeCategorySlugs(localCategories, remote.categories);
  const favoritesOnly = remote.favoritesOnly;

  return {
    categories,
    favoritesOnly,
    updatedAt: remote.updatedAt,
  };
}

export function favoritesNeedCloudSync(
  merged: UserFavoritesData,
  remote: UserFavoritesData | null
): boolean {
  if (!remote?.updatedAt) return true;

  if (merged.favoritesOnly !== remote.favoritesOnly) return true;

  if (merged.categories.length !== remote.categories.length) return true;

  const remoteSet = new Set(remote.categories);
  return merged.categories.some((slug) => !remoteSet.has(slug));
}
