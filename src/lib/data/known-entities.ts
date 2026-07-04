import type { TagType } from "@/lib/types/tag";

/** Alias connus → tag canonique (slug) */
export const knownAliasMap: Record<string, string> = {
  "open ai": "openai",
  "gpt6": "gpt-6",
  "gpt 6": "gpt-6",
  msft: "microsoft",
  "intelligence artificielle generative": "ia-generative",
  "intelligence artificielle générative": "ia-generative",
  "paris saint-germain": "psg",
  "paris sg": "psg",
  btc: "bitcoin",
  idf: "ile-de-france",
  "ile de france": "ile-de-france",
  "île-de-france": "ile-de-france",
  "emmanuel macron": "macron",
  "kylian mbappe": "mbappe",
  "kylian mbappé": "mbappe",
  "union europeenne": "union-europeenne",
  "union européenne": "union-europeenne",
  ue: "union-europeenne",
  "etats-unis": "etats-unis",
  "états-unis": "etats-unis",
  usa: "etats-unis",
  "royaume-uni": "royaume-uni",
  uk: "royaume-uni",
  "reforme des retraites": "retraites",
  "réforme des retraites": "retraites",
};

/** Régions et grandes villes françaises pour extraction fallback */
export const frenchPlaces: Array<{ name: string; slug: string }> = [
  { name: "Bretagne", slug: "bretagne" },
  { name: "Île-de-France", slug: "ile-de-france" },
  { name: "Paris", slug: "paris" },
  { name: "Lyon", slug: "lyon" },
  { name: "Marseille", slug: "marseille" },
  { name: "Toulouse", slug: "toulouse" },
  { name: "Bordeaux", slug: "bordeaux" },
  { name: "Lille", slug: "lille" },
  { name: "Nantes", slug: "nantes" },
  { name: "Strasbourg", slug: "strasbourg" },
  { name: "Nice", slug: "nice" },
  { name: "Normandie", slug: "normandie" },
  { name: "Occitanie", slug: "occitanie" },
  { name: "Provence-Alpes-Côte d'Azur", slug: "paca" },
  { name: "Guadeloupe", slug: "guadeloupe" },
  { name: "Martinique", slug: "martinique" },
  { name: "Réunion", slug: "reunion" },
  { name: "Mayotte", slug: "mayotte" },
];

export const tagTypeOrder: TagType[] = [
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
