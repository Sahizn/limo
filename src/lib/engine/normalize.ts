export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenSimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeText(a).split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normalizeText(b).split(" ").filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return overlap / Math.max(wordsA.size, wordsB.size);
}

export function dedupeEntities<T extends { name: string }>(entities: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const entity of entities) {
    const key = normalizeText(entity.name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(entity);
  }

  return result;
}
