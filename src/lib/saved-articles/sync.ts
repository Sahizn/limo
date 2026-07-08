import type { UserSavedArticlesData } from "@/lib/saved-articles/types";

const SAVED_ARTICLES_API = "/api/user/saved-articles";

export async function fetchRemoteSavedArticles(): Promise<UserSavedArticlesData | null> {
  const response = await fetch(SAVED_ARTICLES_API, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as UserSavedArticlesData;
  if (!data.updatedAt) return null;

  return {
    articles: Array.isArray(data.articles) ? data.articles : [],
    updatedAt: data.updatedAt,
  };
}

export async function pushRemoteSavedArticles(
  data: UserSavedArticlesData
): Promise<UserSavedArticlesData | null> {
  const response = await fetch(SAVED_ARTICLES_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) return null;
  return (await response.json()) as UserSavedArticlesData;
}
