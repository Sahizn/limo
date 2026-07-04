import type { Tag } from "@/lib/types/tag";
import { readJsonFile, writeJsonFile } from "@/lib/storage/json";
import { seedTags } from "@/lib/data/seed-tags";
import {
  getTrendingTagsWithStats,
  syncTagStats,
} from "@/lib/engine/tag-analytics";

const FILE = "tags.json";

export async function getAllTags(): Promise<Tag[]> {
  const tags = await readJsonFile<Tag[]>(FILE, seedTags);
  return tags.map((tag) => ({
    ...tag,
    lastUsedAt: tag.lastUsedAt ?? tag.createdAt,
  }));
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  const tags = await getAllTags();
  return tags.find((t) => t.slug === slug);
}

export async function getTrendingTags(limit = 8) {
  return getTrendingTagsWithStats(limit);
}

export async function saveTags(tags: Tag[]): Promise<void> {
  await writeJsonFile(FILE, tags);
}

export async function getTagSlugs(): Promise<string[]> {
  const tags = await getAllTags();
  return tags.map((t) => t.slug);
}

export { syncTagStats };
