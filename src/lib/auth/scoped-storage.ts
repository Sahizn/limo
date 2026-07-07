const ANONYMOUS_SUFFIX = "";

export function scopedStorageKey(baseKey: string, userId: string | null): string {
  return userId ? `${baseKey}--${userId}` : baseKey;
}

export function migrateAnonymousStorage(
  baseKey: string,
  userId: string,
  parse: (raw: string) => unknown,
  serialize: (value: unknown) => string
): void {
  if (typeof window === "undefined") return;

  const userKey = scopedStorageKey(baseKey, userId);
  const existing = localStorage.getItem(userKey);
  const anonymous = localStorage.getItem(baseKey);

  if (!anonymous || existing) return;

  try {
    const parsed = parse(anonymous);
    if (
      (Array.isArray(parsed) && parsed.length > 0) ||
      (typeof parsed === "string" && parsed.length > 0) ||
      parsed === "true"
    ) {
      localStorage.setItem(userKey, serialize(parsed));
    }
  } catch {
    // ignore invalid anonymous data
  }
}

export { ANONYMOUS_SUFFIX };
