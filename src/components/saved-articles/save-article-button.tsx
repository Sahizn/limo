"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useSavedArticles } from "@/components/saved-articles/saved-articles-provider";
import type { Article } from "@/lib/types/article";
import { cn } from "@/lib/utils";

interface SaveArticleButtonProps {
  article: Article;
  size?: "sm" | "md";
  className?: string;
}

export function SaveArticleButton({
  article,
  size = "md",
  className,
}: SaveArticleButtonProps) {
  const { isSaved, saveArticle, removeArticle, remainingSlots, isPremium, limit } =
    useSavedArticles();
  const [message, setMessage] = useState<string | null>(null);

  const saved = isSaved(article.slug);

  function handleClick() {
    if (saved) {
      removeArticle(article.slug);
      setMessage("Article retiré de vos enregistrements.");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    const result = saveArticle(article);
    if (result.ok) {
      setMessage("Article enregistré.");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    if (result.reason === "limit") {
      setMessage(
        isPremium
          ? "Impossible d'enregistrer cet article."
          : `Limite gratuite atteinte (${limit} articles). Premium bientôt disponible.`
      );
      setTimeout(() => setMessage(null), 4000);
    }
  }

  const atLimit = !saved && !isPremium && remainingSlots === 0;

  return (
    <div className={cn("inline-flex flex-col items-end gap-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={atLimit}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border transition-colors",
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          saved
            ? "border-accent bg-accent/15 text-accent hover:bg-accent/25"
            : atLimit
              ? "cursor-not-allowed border-border bg-card text-muted opacity-60"
              : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
        )}
        aria-label={
          saved ? "Retirer des enregistrements" : "Enregistrer cet article"
        }
        aria-pressed={saved}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        {saved ? "Enregistré" : "Enregistrer"}
      </button>
      {message && (
        <span className="max-w-xs text-right text-xs text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  );
}
