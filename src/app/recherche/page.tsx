import type { Metadata } from "next";
import { SearchClient } from "@/components/search/search-client";
import { categories } from "@/lib/data/categories";
import { getAllArticles } from "@/lib/storage/articles";
import { getAllTags } from "@/lib/storage/tags";

export const metadata: Metadata = {
  title: "Rechercher",
  description: "Recherchez des articles, catégories et tags sur Limo.",
};

export const revalidate = 60;

export default async function SearchPage() {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Rechercher
        </h1>
        <p className="mt-2 text-muted-foreground">
          Articles, catégories et tags.
        </p>
      </header>

      <SearchClient articles={articles} categories={categories} tags={tags} />
    </div>
  );
}
