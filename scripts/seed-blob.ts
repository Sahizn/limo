#!/usr/bin/env tsx
/**
 * Copie les données locales vers Vercel Blob (première initialisation).
 * Usage : npx vercel env pull .env.local --yes && npm run seed-blob
 */
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env.production.local") });

import { writeJsonFile, isBlobStorageEnabled } from "../src/lib/storage/json";

async function main() {
  if (!isBlobStorageEnabled()) {
    console.error("❌ Blob non configuré. Lancez : npx vercel env pull .env.local --yes");
    process.exit(1);
  }

  const storeDir = resolve(process.cwd(), "data/store");
  const files = ["articles.json", "tags.json", "processed-urls.json"];

  for (const file of files) {
    const filePath = `${storeDir}/${file}`;
    try {
      const raw = readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      await writeJsonFile(file, data);
      console.log(`✅ ${file} uploadé`);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        console.log(`⏭️  ${file} ignoré (absent)`);
      } else {
        console.error(`❌ ${file} :`, error);
        throw error;
      }
    }
  }

  console.log("\n🎉 Données initialisées dans Vercel Blob.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
