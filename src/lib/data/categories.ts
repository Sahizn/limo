export type FamilySlug =
  | "societe"
  | "economie"
  | "tech"
  | "culture"
  | "sciences"
  | "monde";

export interface Category {
  slug: string;
  name: string;
  family: FamilySlug;
  description: string;
}

export interface Family {
  slug: FamilySlug;
  name: string;
  description: string;
}

export const families: Family[] = [
  {
    slug: "societe",
    name: "Société",
    description: "Politique, justice, éducation et faits de société",
  },
  {
    slug: "economie",
    name: "Économie",
    description: "Finance, entreprises, emploi et marchés",
  },
  {
    slug: "tech",
    name: "Tech",
    description: "Technologie, IA, cybersécurité et numérique",
  },
  {
    slug: "culture",
    name: "Culture",
    description: "Culture, sport, divertissement et loisirs",
  },
  {
    slug: "sciences",
    name: "Sciences",
    description: "Sciences, santé, énergie et environnement",
  },
  {
    slug: "monde",
    name: "Monde",
    description: "International, mobilité et transport",
  },
];

export const categories: Category[] = [
  { slug: "politique", name: "Politique", family: "societe", description: "Gouvernement, élections et institutions" },
  { slug: "justice", name: "Justice", family: "societe", description: "Tribunaux, lois et affaires judiciaires" },
  { slug: "education", name: "Éducation", family: "societe", description: "École, université et formation" },
  { slug: "emploi", name: "Emploi", family: "societe", description: "Travail, chômage et conditions salariales" },
  { slug: "faits-divers", name: "Faits divers", family: "societe", description: "Événements et incidents en France" },
  { slug: "economie", name: "Économie", family: "economie", description: "Conjoncture et politiques économiques" },
  { slug: "finance", name: "Finance", family: "economie", description: "Marchés, banques et investissements" },
  { slug: "entreprise", name: "Entreprise", family: "economie", description: "Stratégies, résultats et fusions" },
  { slug: "immobilier", name: "Immobilier", family: "economie", description: "Logement, prix et construction" },
  { slug: "start-up", name: "Start-up", family: "economie", description: "Jeunes pousses et levées de fonds" },
  { slug: "technologie", name: "Technologie", family: "tech", description: "Innovation et produits numériques" },
  { slug: "intelligence-artificielle", name: "Intelligence artificielle", family: "tech", description: "IA, modèles et applications" },
  { slug: "cybersecurite", name: "Cybersécurité", family: "tech", description: "Menaces, attaques et protection" },
  { slug: "reseaux-sociaux", name: "Réseaux sociaux", family: "tech", description: "Plateformes et usages sociaux" },
  { slug: "jeux-video", name: "Jeux vidéo", family: "tech", description: "Gaming, studios et sorties" },
  { slug: "culture", name: "Culture", family: "culture", description: "Arts, spectacles et patrimoine" },
  { slug: "musique", name: "Musique", family: "culture", description: "Artistes, albums et concerts" },
  { slug: "livre", name: "Livre", family: "culture", description: "Littérature, édition et prix" },
  { slug: "divertissement", name: "Divertissement", family: "culture", description: "Cinéma, séries et célébrités" },
  { slug: "sport", name: "Sport", family: "culture", description: "Compétitions, clubs et résultats" },
  { slug: "voyage", name: "Voyage", family: "culture", description: "Tourisme, destinations et transport" },
  { slug: "sciences", name: "Sciences", family: "sciences", description: "Recherche, découvertes et espace" },
  { slug: "sante", name: "Santé", family: "sciences", description: "Médecine, santé publique et soins" },
  { slug: "energie", name: "Énergie", family: "sciences", description: "Nucléaire, renouvelables et approvisionnement" },
  { slug: "climat-meteo", name: "Climat et météo", family: "sciences", description: "Météo, climat et catastrophes naturelles" },
  { slug: "international", name: "International", family: "monde", description: "Actualité mondiale et géopolitique" },
  { slug: "automobile", name: "Automobile", family: "monde", description: "Constructeurs, véhicules et marché auto" },
  { slug: "transport", name: "Transport", family: "monde", description: "Routes, rails, aviation et logistique" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFamilyBySlug(slug: string): Family | undefined {
  return families.find((f) => f.slug === slug);
}

export function getCategoriesByFamily(familySlug: FamilySlug): Category[] {
  return categories.filter((c) => c.family === familySlug);
}
