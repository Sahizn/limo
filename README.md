# Limo

**L'info claire, en un coup d'œil.**

Limo est une plateforme d'actualité française qui synthétise l'information en articles concis et objectifs.

## Phase 1 — Fondations ✅

- Design sombre minimaliste (inspiré Apple)
- 28 catégories organisées en 7 familles
- Page d'accueil avec fil unique + navigation par familles
- Pages catégorie, famille, tag et article
- Système de tags avec métadonnées
- Recherche articles / catégories / tags

## Phase 2 — Moteur de contenu ✅

- Collecte automatique via **8 flux RSS** français (France Info, Le Monde, Les Échos, L'Équipe, BFMTV, Libération, Le Figaro)
- **Synthèse IA** via OpenAI (gpt-4o-mini) avec mode fallback sans clé API
- **Extraction et résolution des tags** (entités, normalisation, popularité)
- **Regroupement** des articles similaires de sources différentes
- Stockage JSON local (`data/store/`)
- Endpoint API `/api/ingest` pour déclencher l'ingestion

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Alimenter Limo avec de vrais articles

### 1. Configurer la clé OpenAI (recommandé)

```bash
cp .env.example .env.local
```

Ajoutez votre clé dans `.env.local` :

```
OPENAI_API_KEY=sk-...
```

### 2. Lancer l'ingestion

```bash
npm run ingest
```

Cela récupère les flux RSS, synthétise les articles et les publie sur Limo. Par défaut, 5 articles max par exécution.

```bash
npm run ingest 10   # jusqu'à 10 articles
```

### 3. Via l'API (développement)

```bash
curl -X POST http://localhost:3000/api/ingest
```

En production, protégez l'endpoint avec `CRON_SECRET` dans les headers.

## Phase 3 — Système de tags avancé ✅

- **Extraction d'entités** dédiée (IA + fallback heuristique)
- **Normalisation** : casse, accents, alias connus, similarité floue
- **Métadonnées enrichies** : description IA, `lastUsedAt`, popularité recalculée
- **Tags associés** (co-occurrence dans les articles)
- **Tendances** basées sur les 30 derniers jours
- Page **`/tags`** — exploration par type d'entité
- Commande **`npm run retag`** — retraiter les tags de tous les articles

```bash
npm run retag
```

## Phase 4 — Mise en ligne ✅

- Déployé sur **Vercel** : https://limo-ochre.vercel.app
- Stockage **Vercel Blob** en production (à activer dans le dashboard Vercel)
- **Cron** d'ingestion automatique : **toutes les heures** (5 articles max par passage)
- Plan Vercel **Pro** requis pour un cron horaire natif ; sur **Hobby** (1×/jour max), utilisez un service externe (voir ci-dessous)
- Variables d'environnement configurées : `OPENAI_API_KEY`, `CRON_SECRET`

### Stockage persistant (Vercel Blob)

Le store `limo-blob` est lié au projet en mode **OIDC** (`BLOB_STORE_ID`). Les fichiers JSON sont stockés en accès **private** sous `limo/store/`.

Pour initialiser le Blob depuis les données locales (nécessite OIDC activé pour Development, ou déploiement en prod) :

```bash
npm run seed-blob
```

## Prochaines phases

- **Phase 5** — Application mobile

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Vercel AI SDK + OpenAI
- RSS Parser

## Structure du moteur

```
Flux RSS → Regroupement par sujet → Synthèse IA → Tags → Publication
```

Sources citées sur chaque article. Transparence « Synthèse IA Limo » affichée.
