#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { retagAllArticles } from "../src/lib/engine/retag";
import { hasOpenAIKey } from "../src/lib/engine/synthesize";

async function main() {
  console.log("🏷️  Limo — Retag Phase 3");
  console.log(`   IA activée : ${hasOpenAIKey() ? "oui" : "non (mode fallback)"}\n`);

  const result = await retagAllArticles();

  console.log("📊 Résultat :");
  console.log(`   Articles traités : ${result.processed}`);
  console.log(`   Articles mis à jour : ${result.updated}`);

  if (result.errors.length > 0) {
    console.log("\n⚠️  Erreurs :");
    for (const err of result.errors) {
      console.log(`   • ${err}`);
    }
  }
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
