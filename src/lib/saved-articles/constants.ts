export const FREE_SAVED_ARTICLES_LIMIT = 5;

/** Futur abonnement premium — pour l'instant toujours false. */
export function isPremiumUser(): boolean {
  return false;
}

export function getSavedArticlesLimit(): number {
  return isPremiumUser() ? Infinity : FREE_SAVED_ARTICLES_LIMIT;
}
