import { getAllTags } from "@/lib/storage/tags";

export type TagLookup = Record<string, { name: string }>;

export async function buildTagMap(): Promise<TagLookup> {
  const tags = await getAllTags();
  return Object.fromEntries(tags.map((tag) => [tag.slug, { name: tag.name }]));
}
