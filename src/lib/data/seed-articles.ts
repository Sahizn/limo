import type { Article } from "@/lib/types/article";

export const seedArticles: Article[] = [
  {
    slug: "openai-lance-gpt-6-avec-microsoft",
    title: "OpenAI lance GPT-6 en partenariat avec Microsoft",
    summary: [
      "OpenAI a officiellement dévoilé GPT-6, son nouveau modèle de langage, lors d'une conférence à San Francisco. Le modèle promet des capacités de raisonnement nettement améliorées par rapport à GPT-5.",
      "Microsoft confirme une intégration progressive dans Copilot et Azure OpenAI Service dès le trimestre prochain. Les entreprises européennes pourront y accéder sous réserve de conformité RGPD.",
      "Les experts saluent les progrès techniques tout en appelant à une régulation plus stricte des modèles les plus puissants.",
    ],
    categorySlug: "intelligence-artificielle",
    tagSlugs: ["openai", "gpt-6", "microsoft", "ia-generative"],
    sources: [
      { name: "Le Monde", url: "https://www.lemonde.fr" },
      { name: "France Info", url: "https://www.francetvinfo.fr" },
      { name: "Les Échos", url: "https://www.lesechos.fr" },
    ],
    publishedAt: "2026-07-04T06:12:00Z",
    isBreaking: true,
  },
  {
    slug: "senat-adopte-article-7-retraites",
    title: "Réforme des retraites : le Sénat adopte l'article 7",
    summary: [
      "Le Sénat a adopté l'article 7 de la réforme des retraites par 189 voix contre 142. La mesure prévoit un report progressif de l'âge légal à 64 ans d'ici 2030.",
      "Les syndicats CGT, FO et Solidaires ont annoncé une journée de mobilisation nationale pour le 15 juillet. Le gouvernement maintient son calendrier législatif.",
      "L'Assemblée nationale devra se prononcer à nouveau sur le texte avant la trêve parlementaire d'été.",
    ],
    categorySlug: "politique",
    tagSlugs: ["senat", "retraites"],
    sources: [
      { name: "Le Monde", url: "https://www.lemonde.fr" },
      { name: "France Info", url: "https://www.francetvinfo.fr" },
      { name: "Libération", url: "https://www.liberation.fr" },
    ],
    publishedAt: "2026-07-04T05:38:00Z",
  },
  {
    slug: "canicule-15-departements-vigilance-orange",
    title: "Canicule : 15 départements placés en vigilance orange",
    summary: [
      "Météo-France a placé 15 départements en vigilance orange canicule à partir de midi. Les températures pourraient dépasser 38°C dans le sud-ouest et en Île-de-France.",
      "Le gouvernement appelle les personnes vulnérables à limiter leurs déplacements aux heures les plus chaudes. Des centres de rafraîchissement ouvrent dans les mairies concernées.",
      "La canicule devrait s'étendre à d'autres régions d'ici le week-end selon les prévisionnistes.",
    ],
    categorySlug: "climat-meteo",
    tagSlugs: ["canicule", "ile-de-france"],
    sources: [
      { name: "France Info", url: "https://www.francetvinfo.fr" },
      { name: "Le Parisien", url: "https://www.leparisien.fr" },
    ],
    publishedAt: "2026-07-04T04:45:00Z",
  },
  {
    slug: "psg-remporte-trophee-des-champions",
    title: "PSG remporte le Trophée des Champions face à Marseille",
    summary: [
      "Le Paris Saint-Germain a remporté le Trophée des Champions en battant l'OM 2-1 à Bangkok. Doublé de Kylian Mbappé en première période.",
      "Luis Enrique a salué la solidité défensive de son équipe en seconde mi-temps. Marseille reste sur une série de trois défaites en matchs officiels.",
      "Le PSG débutera la Ligue 1 le 16 août prochain à domicile.",
    ],
    categorySlug: "sport",
    tagSlugs: ["psg"],
    sources: [
      { name: "L'Équipe", url: "https://www.lequipe.fr" },
      { name: "RMC Sport", url: "https://rmcsport.bfmtv.com" },
    ],
    publishedAt: "2026-07-04T03:20:00Z",
  },
  {
    slug: "inflation-ralentit-juin-france",
    title: "L'inflation ralentit en juin en France à 1,8 %",
    summary: [
      "L'INSEE confirme un taux d'inflation annuel de 1,8 % en juin, en légère baisse par rapport à mai. La décélération s'explique principalement par le recul des prix de l'énergie.",
      "Les prix alimentaires restent toutefois en hausse de 2,4 % sur un an. Le gouvernement maintient sa cible de pouvoir d'achat pour l'automne.",
      "La Banque de France prévoit une inflation moyenne de 2 % sur l'ensemble de l'année 2026.",
    ],
    categorySlug: "economie",
    tagSlugs: ["inflation"],
    sources: [
      { name: "Les Échos", url: "https://www.lesechos.fr" },
      { name: "BFM Business", url: "https://www.bfmtv.com/economie" },
    ],
    publishedAt: "2026-07-04T02:10:00Z",
  },
  {
    slug: "bretagne-investissement-eolien-offshore",
    title: "La Bretagne accueille un nouveau parc éolien offshore",
    summary: [
      "Un parc éolien offshore de 500 MW sera installé au large de Saint-Brieuc d'ici 2028. L'investissement représente 2,3 milliards d'euros et créera 800 emplois locaux.",
      "Les écologistes saluent le projet mais demandent une étude d'impact renforcée sur la biodiversité marine. L'État assure un cadre réglementaire strict.",
      "Ce projet s'inscrit dans l'objectif français de 40 GW d'éolien en mer d'ici 2035.",
    ],
    categorySlug: "energie",
    tagSlugs: ["bretagne"],
    sources: [
      { name: "Ouest-France", url: "https://www.ouest-france.fr" },
      { name: "France Info", url: "https://www.francetvinfo.fr" },
    ],
    publishedAt: "2026-07-04T01:00:00Z",
  },
  {
    slug: "bitcoin-franchit-100000-dollars",
    title: "Le Bitcoin franchit à nouveau la barre des 100 000 dollars",
    summary: [
      "Le Bitcoin a dépassé les 100 000 dollars pour la première fois depuis mars, porté par les flux institutionnels et l'approbation de nouveaux ETF aux États-Unis.",
      "Les analystes restent prudents face à la volatilité historique du marché. L'AMF rappelle les risques pour les investisseurs particuliers français.",
      "L'Ethereum progresse également de 4 % sur la semaine, tiré par l'activité des protocoles DeFi.",
    ],
    categorySlug: "finance",
    tagSlugs: ["bitcoin"],
    sources: [
      { name: "Les Échos", url: "https://www.lesechos.fr" },
      { name: "BFM Crypto", url: "https://www.bfmtv.com/crypto" },
    ],
    publishedAt: "2026-07-03T22:30:00Z",
  },
  {
    slug: "cyberattaque-hopitaux-francais",
    title: "Cyberattaque : plusieurs hôpitaux français touchés par un ransomware",
    summary: [
      "Au moins six hôpitaux publics ont été touchés par une cyberattaque de type ransomware dans la nuit de mercredi à jeudi. Les services d'urgence restent opérationnels.",
      "L'ANSSI a déclenché son cellule de crise et coordonne la réponse avec les établissements concernés. L'origine de l'attaque fait l'objet d'une enquête.",
      "Le ministre de la Santé a assuré qu'aucune donnée patient n'avait été exfiltrée à ce stade.",
    ],
    categorySlug: "cybersecurite",
    tagSlugs: [],
    sources: [
      { name: "Le Monde", url: "https://www.lemonde.fr" },
      { name: "France Info", url: "https://www.francetvinfo.fr" },
    ],
    publishedAt: "2026-07-03T20:15:00Z",
  },
];
