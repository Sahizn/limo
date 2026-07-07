#!/usr/bin/env tsx
/**
 * Supprime les tags invalides et retire leurs slugs des articles.
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { isPlausibleEntity } from "../src/lib/engine/entity-validation";
import { saveTags } from "../src/lib/storage/tags";
import { getAllArticles, saveArticles } from "../src/lib/storage/articles";
import { readJsonFile } from "../src/lib/storage/json";
import { seedTags } from "../src/lib/data/seed-tags";
import type { Tag } from "../src/lib/types/tag";

const FILE = "tags.json";

async function main() {
  const tags = await readJsonFile<Tag[]>(FILE, seedTags);
  const validTags = tags.filter((tag) => isPlausibleEntity(tag.name, tag.type));
  const validSlugs = new Set(validTags.map((tag) => tag.slug));
  const removed = tags.length - validTags.length;

  const articles = await getAllArticles();
  let cleanedArticles = 0;

  const updatedArticles = articles.map((article) => {
    const tagSlugs = article.tagSlugs.filter((slug) => validSlugs.has(slug));
    if (tagSlugs.length !== article.tagSlugs.length) cleanedArticles++;
    return { ...article, tagSlugs };
  });

  await saveTags(validTags);
  await saveArticles(updatedArticles);

  console.log(`✅ ${removed} tag(s) supprimé(s)`);
  console.log(`✅ ${cleanedArticles} article(s) nettoyé(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
