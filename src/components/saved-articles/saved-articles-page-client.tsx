"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SaveArticleButton } from "@/components/saved-articles/save-article-button";
import { useSavedArticles } from "@/components/saved-articles/saved-articles-provider";
import { getCategoryBySlug } from "@/lib/data/categories";
import { formatRelativeTime } from "@/lib/utils";

function formatSavedDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function SavedArticlesPageClient() {
  const { savedArticles, limit, isPremium, remainingSlots } = useSavedArticles();

  if (savedArticles.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Vous n&apos;avez pas encore d&apos;article enregistré.
        </p>
        <p className="mt-2 text-sm text-muted">
          Appuyez sur « Enregistrer » sur un article pour le garder
          indéfiniment, même après sa disparition du fil (24 h).
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Voir l&apos;actualité
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {isPremium ? (
          <p>Enregistrements illimités — abonnement Premium actif.</p>
        ) : (
          <p>
            {savedArticles.length} / {limit} articles enregistrés
            {remainingSlots > 0
              ? ` — encore ${remainingSlots} place${remainingSlots > 1 ? "s" : ""} disponible${remainingSlots > 1 ? "s" : ""}`
              : " — limite gratuite atteinte"}
            . Premium bientôt : enregistrements illimités.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {savedArticles.map(({ article, savedAt }) => {
          const category = getCategoryBySlug(article.categorySlug);
          return (
            <article
              key={article.slug}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-xs text-muted">
                  Enregistré le {formatSavedDate(savedAt)} · publié{" "}
                  {formatRelativeTime(new Date(article.publishedAt))}
                </div>
                <SaveArticleButton article={article} size="sm" />
              </div>

              {category && (
                <p className="mb-2 text-sm text-accent">{category.name}</p>
              )}

              <h2 className="text-xl font-semibold leading-snug tracking-tight">
                {article.title}
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/90">
                {article.summary.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4">
                <div className="flex flex-wrap gap-3">
                  {article.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                    >
                      {source.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
