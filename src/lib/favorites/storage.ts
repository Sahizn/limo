import { scopedStorageKey } from "@/lib/auth/scoped-storage";

export const FAVORITES_STORAGE_KEY = "limo-favorite-categories";
export const FAVORITES_ONLY_KEY = "limo-favorites-only";

export function readFavoriteSlugs(userId: string | null = null): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(scopedStorageKey(FAVORITES_STORAGE_KEY, userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeFavoriteSlugs(
  slugs: string[],
  userId: string | null = null
): void {
  localStorage.setItem(
    scopedStorageKey(FAVORITES_STORAGE_KEY, userId),
    JSON.stringify(slugs)
  );
}

export function readFavoritesOnly(userId: string | null = null): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(scopedStorageKey(FAVORITES_ONLY_KEY, userId)) === "true"
  );
}

export function writeFavoritesOnly(
  value: boolean,
  userId: string | null = null
): void {
  localStorage.setItem(
    scopedStorageKey(FAVORITES_ONLY_KEY, userId),
    String(value)
  );
}
