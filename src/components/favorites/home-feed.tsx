"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArticleCard } from "@/components/articles/article-card";
import { FavoriteCategoryButton } from "@/components/favorites/favorite-category-button";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { categories } from "@/lib/data/categories";
import type { TagLookup } from "@/lib/storage/tag-map";
import type { Article } from "@/lib/types/article";
import { cn } from "@/lib/utils";

interface HomeFeedProps {
  articles: Article[];
  tagLookup: TagLookup;
}

export function HomeFeed({ articles, tagLookup }: HomeFeedProps) {
  const { favorites, favoritesOnly, setFavoritesOnly } = useFavorites();

  const favoriteCategories = useMemo(
    () => categories.filter((category) => favorites.includes(category.slug)),
    [favorites]
  );

  const visibleArticles = useMemo(() => {
    if (!favoritesOnly) return articles;
    if (favorites.length === 0) return [];
    const favoriteSet = new Set(favorites);
    return articles.filter((article) => favoriteSet.has(article.categorySlug));
  }, [articles, favorites, favoritesOnly]);

  return (
    <>
      <section className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-medium">Vos catégories favorites</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Personnalisez Limo en gardant seulement ce qui vous intéresse.
            </p>
          </div>
          <div className="flex rounded-full border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setFavoritesOnly(false)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                !favoritesOnly
                  ? "bg-accent font-medium text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tout voir
            </button>
            <button
              type="button"
              onClick={() => setFavoritesOnly(true)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                favoritesOnly
                  ? "bg-accent font-medium text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mes favoris
            </button>
          </div>
        </div>

        {favoriteCategories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {favoriteCategories.map((category) => (
              <div
                key={category.slug}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background pl-3 pr-1 py-1"
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
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune catégorie favorite pour le moment. Ajoutez-en depuis{" "}
            <Link href="/categories" className="text-accent hover:underline">
              les catégories
            </Link>{" "}
            ou la page{" "}
            <Link href="/favoris" className="text-accent hover:underline">
              Favoris
            </Link>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="feed-heading" className="mb-12">
        <h2
          id="feed-heading"
          className="mb-6 text-sm font-medium uppercase tracking-wider text-muted"
        >
          {favoritesOnly ? "Vos derniers sujets" : "Derniers sujets"}
        </h2>
        <div className="flex flex-col gap-4">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                tagLookup={tagLookup}
                showSummary
              />
            ))
          ) : favoritesOnly ? (
            <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              {favorites.length === 0
                ? "Ajoutez des catégories à vos favoris pour filtrer votre fil."
                : "Aucun article récent dans vos catégories favorites."}
            </p>
          ) : (
            <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              Aucun article récent pour le moment. Revenez bientôt.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
