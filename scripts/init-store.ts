import { seedArticles } from "@/lib/data/seed-articles";
import { seedTags } from "@/lib/data/seed-tags";

// Initialize seed data in store (run once at build)
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const storeDir = join(process.cwd(), "data", "store");

if (!existsSync(storeDir)) {
  mkdirSync(storeDir, { recursive: true });
}

if (!existsSync(join(storeDir, "articles.json"))) {
  writeFileSync(join(storeDir, "articles.json"), JSON.stringify(seedArticles, null, 2));
}

if (!existsSync(join(storeDir, "tags.json"))) {
  writeFileSync(join(storeDir, "tags.json"), JSON.stringify(seedTags, null, 2));
}

if (!existsSync(join(storeDir, "processed-urls.json"))) {
  writeFileSync(join(storeDir, "processed-urls.json"), "[]");
}

console.log("Store initialisé.");
