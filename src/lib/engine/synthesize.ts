import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { validCategorySlugs } from "@/lib/rss/feeds";
import type { SynthesisInput, SynthesisOutput } from "@/lib/types/engine";
import type { RssFeedItem } from "@/lib/rss/types";

const categorySlugSchema = z.enum(
  validCategorySlugs as unknown as [string, ...string[]]
);

const synthesisSchema = z.object({
  title: z.string().describe("Titre concis et factuel en français"),
  summary: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2 à 4 paragraphes courts, objectifs, sans opinion"),
  categorySlug: categorySlugSchema,
  isBreaking: z.boolean().describe("true si sujet majeur en cours"),
  entities: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum([
          "personne",
          "entreprise",
          "lieu",
          "technologie",
          "evenement",
          "produit",
          "loi",
          "cryptomonnaie",
          "concept",
        ]),
      })
    )
    .max(8),
});

function buildPrompt(items: RssFeedItem[], defaultCategorySlug: string): string {
  const sourcesBlock = items
    .map(
      (item, i) =>
        `Source ${i + 1} — ${item.sourceName}
Titre : ${item.title}
Résumé : ${item.description.slice(0, 600)}
URL : ${item.link}`
    )
    .join("\n\n");

  return `Tu es le moteur éditorial de Limo, une plateforme d'actualité française.

RÈGLES :
- Français uniquement
- Concis, objectif, factuel — lisible dans le bus en 60 secondes
- Pas d'opinion, pas de jugement, pas de formule marketing
- 2 à 4 paragraphes courts dans summary
- Choisis la catégorie la plus pertinente parmi les slugs disponibles
- Extrais les entités importantes (personnes, entreprises, lieux, technologies, événements, produits, lois, cryptomonnaies, concepts)
- isBreaking = true seulement pour un sujet majeur national ou international en cours

Catégorie par défaut suggérée : ${defaultCategorySlug}

SOURCES À SYNTHÉTISER :
${sourcesBlock}`;
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function synthesizeArticle(
  input: SynthesisInput
): Promise<SynthesisOutput> {
  if (!hasOpenAIKey()) {
    return synthesizeFallback(input);
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: synthesisSchema,
    prompt: buildPrompt(input.items, input.defaultCategorySlug),
    temperature: 0.2,
  });

  return object;
}

function synthesizeFallback(input: SynthesisInput): SynthesisOutput {
  const main = input.items[0];
  const description = main.description || main.title;

  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 20)
    .slice(0, 3);

  const summary =
    sentences.length >= 2
      ? sentences
      : [
          description.slice(0, 280) + (description.length > 280 ? "…" : ""),
        ];

  return {
    title: main.title,
    summary,
    categorySlug: main.defaultCategorySlug as SynthesisOutput["categorySlug"],
    isBreaking: false,
    entities: [],
  };
}
