"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { cn } from "@/lib/utils";

interface FavoriteCategoryButtonProps {
  categorySlug: string;
  categoryName: string;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteCategoryButton({
  categorySlug,
  categoryName,
  size = "md",
  className,
}: FavoriteCategoryButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(categorySlug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(categorySlug);
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-colors",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        active
          ? "bg-accent/15 text-accent hover:bg-accent/25"
          : "bg-card text-muted hover:bg-card-hover hover:text-foreground",
        className
      )}
      aria-label={
        active
          ? `Retirer ${categoryName} des favoris`
          : `Ajouter ${categoryName} aux favoris`
      }
      aria-pressed={active}
    >
      <Star
        className={cn(size === "sm" ? "h-4 w-4" : "h-4 w-4", active && "fill-current")}
      />
    </button>
  );
}
