"use client";

import { FavoriteCategoryButton } from "@/components/favorites/favorite-category-button";

interface CategoryFavoriteHeaderProps {
  categorySlug: string;
  categoryName: string;
}

export function CategoryFavoriteHeader({
  categorySlug,
  categoryName,
}: CategoryFavoriteHeaderProps) {
  return (
    <FavoriteCategoryButton
      categorySlug={categorySlug}
      categoryName={categoryName}
    />
  );
}
