import Link from "next/link";
import type { Article } from "@/lib/types/article";
import { getCategoryBySlug } from "@/lib/data/categories";
import { formatRelativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  tagMap?: Map<string, { name: string }>;
  showSummary?: boolean;
}

export function ArticleCard({ article, tagMap, showSummary = false }: ArticleCardProps) {
  const category = getCategoryBySlug(article.categorySlug);

  return (
    <article className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-card-hover sm:p-6">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="mb-3 flex items-center gap-2 text-sm">
          {article.isBreaking && (
            <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-breaking/15 px-2 py-0.5 text-xs font-medium text-breaking">
              <span className="h-1.5 w-1.5 rounded-full bg-breaking" />
              En ce moment
            </span>
          )}
          {category && (
            <span className="text-accent">{category.name}</span>
          )}
          <span className="text-muted">·</span>
          <time
            dateTime={article.publishedAt}
            className="text-muted"
          >
            {formatRelativeTime(new Date(article.publishedAt))}
          </time>
        </div>

        <h2 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-xl">
          {article.title}
        </h2>

        {showSummary && article.summary[0] && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.summary[0]}
          </p>
        )}
      </Link>

      {article.tagSlugs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tagSlugs.map((tagSlug) => {
            const tag = tagMap?.get(tagSlug);
            const label = tag?.name ?? tagSlug;
            return (
              <Link
                key={tagSlug}
                href={`/tag/${tagSlug}`}
                className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent-muted hover:text-accent"
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}
