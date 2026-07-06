import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { frenchPlaces } from "@/lib/data/known-entities";
import type { ExtractedEntity } from "@/lib/types/tag";
import { hasOpenAIKey } from "@/lib/engine/synthesize";
import { dedupeEntities, normalizeText } from "@/lib/engine/normalize";

const entitySchema = z.object({
  entities: z
    .array(
      z.object({
        name: z.string().describe("Nom canonique de l'entité"),
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
        aliases: z.array(z.string()).describe("Variantes du nom (acronymes, surnoms)"),
      })
    )
    .max(10),
});

export async function extractEntities(input: {
  title: string;
  summary: string[];
  sourceTitles?: string[];
}): Promise<ExtractedEntity[]> {
  const fromAi = hasOpenAIKey() ? await extractWithAI(input) : [];
  const fromFallback = extractFallback(input);

  return dedupeEntities([...fromAi, ...fromFallback]).slice(0, 10);
}

async function extractWithAI(input: {
  title: string;
  summary: string[];
}): Promise<ExtractedEntity[]> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: entitySchema,
      prompt: `Extrais les entités importantes de cet article d'actualité française.

RÈGLES :
- Personnes, entreprises, lieux (villes, régions, pays), technologies, événements, produits, lois/institutions, cryptomonnaies, concepts
- Noms canoniques (ex: "Macron" pas "le président", "OpenAI" pas "la startup")
- Inclus des alias si pertinent (ex: "Paris Saint-Germain" → alias de "PSG")
- Maximum 8 entités, les plus pertinentes uniquement
- Français

TITRE : ${input.title}

CONTENU :
${input.summary.join("\n\n")}`,
      temperature: 0.1,
    });

    return object.entities.map((e) => ({
      name: e.name,
      type: e.type,
      aliases: e.aliases,
    }));
  } catch (error) {
    console.error("[EntityExtractor] Erreur IA:", error);
    return [];
  }
}

function extractFallback(input: {
  title: string;
  summary: string[];
  sourceTitles?: string[];
}): ExtractedEntity[] {
  const text = [input.title, ...input.summary, ...(input.sourceTitles ?? [])].join(" ");
  const entities: ExtractedEntity[] = [];

  for (const place of frenchPlaces) {
    if (text.includes(place.name)) {
      entities.push({ name: place.name, type: "lieu" });
    }
  }

  const cryptoPatterns = [
    { pattern: /bitcoin/i, name: "Bitcoin", type: "cryptomonnaie" as const },
    { pattern: /ethereum/i, name: "Ethereum", type: "cryptomonnaie" as const },
  ];

  for (const { pattern, name, type } of cryptoPatterns) {
    if (pattern.test(text)) {
      entities.push({ name, type });
    }
  }

  const orgPatterns = [
    { pattern: /\b(OpenAI)\b/i, name: "OpenAI", type: "entreprise" as const },
    { pattern: /\b(Microsoft)\b/i, name: "Microsoft", type: "entreprise" as const },
    { pattern: /\b(Meta)\b/i, name: "Meta", type: "entreprise" as const },
    { pattern: /\b(Google)\b/i, name: "Google", type: "entreprise" as const },
    { pattern: /\b(Apple)\b/i, name: "Apple", type: "entreprise" as const },
    { pattern: /\b(PSG|Paris Saint-Germain)\b/i, name: "PSG", type: "entreprise" as const },
    { pattern: /\b(UE|Union européenne)\b/i, name: "Union européenne", type: "loi" as const },
    { pattern: /\b(OTAN|NATO)\b/i, name: "OTAN", type: "loi" as const },
    { pattern: /\bGPT-?\d+/i, name: "IA générative", type: "concept" as const },
  ];

  for (const { pattern, name, type } of orgPatterns) {
    if (pattern.test(text)) {
      entities.push({ name, type });
    }
  }

  const personPattern = /\b([A-ZÀ-Ÿ][a-zà-ÿ]+ [A-ZÀ-Ÿ][a-zà-ÿ]+)\b/g;
  let match;
  while ((match = personPattern.exec(text)) !== null) {
    const name = match[1];
    const normalized = normalizeText(name);
    if (
      !["le monde", "la france", "les echos", "france info"].includes(normalized)
    ) {
      entities.push({ name, type: "personne" });
    }
  }

  return dedupeEntities(entities);
}
