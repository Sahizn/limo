import Link from "next/link";
import { getTrendingTagsWithStats } from "@/lib/engine/tag-analytics";

export async function TrendingTags() {
  const trending = await getTrendingTagsWithStats(8);

  if (trending.length === 0) return null;

  return (
    <section aria-labelledby="trending-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="trending-heading"
          className="text-sm font-medium uppercase tracking-wider text-muted"
        >
          Tendances
        </h2>
        <Link
          href="/tags"
          className="text-sm text-accent hover:underline"
        >
          Tous les tags
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {trending.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tag/${tag.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {tag.name}
            {tag.recentCount > 0 && (
              <span className="rounded-full bg-accent/20 px-1.5 text-xs text-accent">
                {tag.recentCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
