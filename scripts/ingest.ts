#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { runIngestion } from "../src/lib/engine/pipeline";
import { hasOpenAIKey } from "../src/lib/engine/synthesize";

async function main() {
  const maxArticles = Number(process.argv[2]) || 5;

  console.log("🚀 Limo — Ingestion Phase 2");
  console.log(`   IA activée : ${hasOpenAIKey() ? "oui" : "non (mode fallback)"}`);
  console.log(`   Max articles : ${maxArticles}\n`);

  const result = await runIngestion({ maxArticles });

  console.log("📊 Résultat :");
  console.log(`   Flux récupérés : ${result.fetched}`);
  console.log(`   Traités        : ${result.processed}`);
  console.log(`   Publiés        : ${result.published}`);
  console.log(`   Ignorés        : ${result.skipped}`);

  if (result.articles.length > 0) {
    console.log("\n📰 Nouveaux articles :");
    for (const slug of result.articles) {
      console.log(`   • /article/${slug}`);
    }
  }

  if (result.errors.length > 0) {
    console.log("\n⚠️  Erreurs :");
    for (const err of result.errors) {
      console.log(`   • ${err}`);
    }
  }

  if (!hasOpenAIKey()) {
    console.log(
      "\n💡 Ajoutez OPENAI_API_KEY dans .env.local pour activer la synthèse IA."
    );
  }
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
