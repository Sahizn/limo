import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { slugify } from "@/lib/utils";
import type { ExtractedEntity, Tag, TagType } from "@/lib/types/tag";
import { knownAliasMap } from "@/lib/data/known-entities";
import { getAllTags, saveTags } from "@/lib/storage/tags";
import { hasOpenAIKey } from "@/lib/engine/synthesize";
import { normalizeText, tokenSimilarity } from "@/lib/engine/normalize";

const VALID_TYPES: TagType[] = [
  "personne",
  "entreprise",
  "lieu",
  "technologie",
  "evenement",
  "produit",
  "loi",
  "cryptomonnaie",
  "concept",
];

function isValidTagType(type: string): type is TagType {
  return VALID_TYPES.includes(type as TagType);
}

function resolveCanonicalSlug(name: string): string | null {
  const normalized = normalizeText(name);
  const knownSlug = knownAliasMap[normalized];
  if (knownSlug) return knownSlug;
  const slug = slugify(name);
  return slug || null;
}

function findExistingTag(tags: Tag[], entity: ExtractedEntity): Tag | undefined {
  const canonicalSlug = resolveCanonicalSlug(entity.name);
  const normalizedName = normalizeText(entity.name);

  const direct = tags.find(
    (tag) =>
      tag.slug === canonicalSlug ||
      normalizeText(tag.name) === normalizedName ||
      tag.alias.some((a) => normalizeText(a) === normalizedName)
  );
  if (direct) return direct;

  for (const alias of entity.aliases ?? []) {
    const byAlias = tags.find(
      (t) =>
        normalizeText(t.name) === normalizeText(alias) ||
        t.alias.some((a) => normalizeText(a) === normalizeText(alias))
    );
    if (byAlias) return byAlias;
  }

  return tags.find(
    (tag) =>
      tokenSimilarity(tag.name, entity.name) >= 0.7 ||
      tag.alias.some((a) => tokenSimilarity(a, entity.name) >= 0.8)
  );
}

async function generateTagDescription(
  name: string,
  type: TagType
): Promise<string> {
  if (!hasOpenAIKey()) {
    return `Actualité liée à ${name}.`;
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Écris une description factuelle d'une phrase (max 120 caractères) pour le tag "${name}" (type: ${type}) dans un agrégateur d'actualité française. Pas de marketing.`,
      temperature: 0.2,
    });
    return text.trim().slice(0, 150) || `Actualité liée à ${name}.`;
  } catch {
    return `Actualité liée à ${name}.`;
  }
}

function mergeAliases(tag: Tag, entity: ExtractedEntity): void {
  const candidates = [entity.name, ...(entity.aliases ?? [])];
  for (const candidate of candidates) {
    const norm = normalizeText(candidate);
    if (
      norm &&
      normalizeText(tag.name) !== norm &&
      !tag.alias.some((a) => normalizeText(a) === norm)
    ) {
      tag.alias.push(candidate);
    }
  }
}

export async function resolveEntities(
  entities: ExtractedEntity[]
): Promise<string[]> {
  if (entities.length === 0) return [];

  const tags = await getAllTags();
  const resolvedSlugs: string[] = [];
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString();

  for (const entity of entities) {
    const existing = findExistingTag(tags, entity);

    if (existing) {
      existing.popularity += 1;
      existing.lastUsedAt = now;
      mergeAliases(existing, entity);
      if (!resolvedSlugs.includes(existing.slug)) {
        resolvedSlugs.push(existing.slug);
      }
      continue;
    }

    const canonicalSlug =
      resolveCanonicalSlug(entity.name) ?? slugify(entity.name);
    if (!canonicalSlug || resolvedSlugs.includes(canonicalSlug)) continue;

    const description = await generateTagDescription(
      entity.name,
      isValidTagType(entity.type) ? entity.type : "concept"
    );

    const newTag: Tag = {
      slug: canonicalSlug,
      name: entity.name,
      type: isValidTagType(entity.type) ? entity.type : "concept",
      alias: entity.aliases ?? [],
      description,
      popularity: 1,
      createdAt: today,
      lastUsedAt: now,
    };

    tags.push(newTag);
    resolvedSlugs.push(canonicalSlug);
  }

  await saveTags(tags);
  return resolvedSlugs;
}

/** @deprecated Utiliser resolveEntities */
export async function resolveTagSlugs(
  entities: Array<{ name: string; type: string; aliases?: string[] }>
): Promise<string[]> {
  return resolveEntities(
    entities.map((e) => ({
      name: e.name,
      type: isValidTagType(e.type) ? e.type : "concept",
      aliases: e.aliases,
    }))
  );
}
