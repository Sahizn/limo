"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArticleCard } from "@/components/articles/article-card";
import { FavoriteCategoryButton } from "@/components/favorites/favorite-category-button";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { categories, families, getCategoriesByFamily } from "@/lib/data/categories";
import type { TagLookup } from "@/lib/storage/tag-map";
import type { Article } from "@/lib/types/article";

interface FavoritesPageClientProps {
  articles: Article[];
  tagLookup: TagLookup;
}

export function FavoritesPageClient({
  articles,
  tagLookup,
}: FavoritesPageClientProps) {
  const { favorites } = useFavorites();

  const favoriteCategories = useMemo(
    () => categories.filter((category) => favorites.includes(category.slug)),
    [favorites]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const favoriteArticles = useMemo(
    () => articles.filter((article) => favoriteSet.has(article.categorySlug)),
    [articles, favoriteSet]
  );

  if (favoriteCategories.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Vous n&apos;avez pas encore de catégories favorites.
        </p>
        <p className="mt-2 text-sm text-muted">
          Parcourez les catégories et appuyez sur l&apos;étoile pour les ajouter.
        </p>
        <Link
          href="/categories"
          className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Explorer les catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Vos catégories ({favoriteCategories.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {favoriteCategories.map((category) => {
            const family = families.find((item) => item.slug === category.family);
            return (
              <div
                key={category.slug}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/categorie/${category.slug}`}
                    className="font-medium hover:text-accent"
                  >
                    {category.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{category.description}</p>
                  {family && (
                    <p className="mt-2 text-xs text-muted-foreground">{family.name}</p>
                  )}
                </div>
                <FavoriteCategoryButton
                  categorySlug={category.slug}
                  categoryName={category.name}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Articles de vos favoris
        </h2>
        {favoriteArticles.length > 0 ? (
          <div className="flex flex-col gap-4">
            {favoriteArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                tagLookup={tagLookup}
                showSummary
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
            Aucun article récent dans vos catégories favorites.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Ajouter d&apos;autres catégories
        </h2>
        <div className="space-y-8">
          {families.map((family) => {
            const familyCategories = getCategoriesByFamily(family.slug).filter(
              (category) => !favoriteSet.has(category.slug)
            );
            if (familyCategories.length === 0) return null;

            return (
              <div key={family.slug}>
                <h3 className="mb-3 font-medium">{family.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {familyCategories.map((category) => (
                    <div
                      key={category.slug}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-card pl-3 pr-1 py-1"
                    >
                      <Link
                        href={`/categorie/${category.slug}`}
                        className="text-sm hover:text-accent"
                      >
                        {category.name}
                      </Link>
                      <FavoriteCategoryButton
                        categorySlug={category.slug}
                        categoryName={category.name}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
