export type TagType =
  | "personne"
  | "entreprise"
  | "lieu"
  | "technologie"
  | "evenement"
  | "produit"
  | "loi"
  | "cryptomonnaie"
  | "concept";

export interface Tag {
  slug: string;
  name: string;
  type: TagType;
  alias: string[];
  description: string;
  popularity: number;
  createdAt: string;
  lastUsedAt: string;
}

export interface ExtractedEntity {
  name: string;
  type: TagType;
  aliases?: string[];
}

export const tagTypeLabels: Record<TagType, string> = {
  personne: "Personne",
  entreprise: "Entreprise",
  lieu: "Lieu",
  technologie: "Technologie",
  evenement: "Événement",
  produit: "Produit",
  loi: "Loi / Institution",
  cryptomonnaie: "Cryptomonnaie",
  concept: "Concept",
};
