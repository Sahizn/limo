import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/storage/tags";
import { getTrendingTagsWithStats } from "@/lib/engine/tag-analytics";
import { tagTypeLabels, type TagType } from "@/lib/types/tag";
import { tagTypeOrder } from "@/lib/data/known-entities";

export const metadata: Metadata = {
  title: "Tags",
  description: "Explorez les sujets et entités qui font l'actualité sur Limo.",
};

export const revalidate = 60;

export default async function TagsPage() {
  const [allTags, trending] = await Promise.all([
    getAllTags(),
    getTrendingTagsWithStats(12),
  ]);

  const tagsByType = tagTypeOrder.reduce(
    (acc, type) => {
      acc[type] = allTags
        .filter((t) => t.type === type)
        .sort((a, b) => b.popularity - a.popularity);
      return acc;
    },
    {} as Record<TagType, typeof allTags>
  );

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Tags
        </h1>
        <p className="mt-2 text-muted-foreground">
          Personnes, lieux, entreprises et sujets qui structurent l&apos;actualité.
        </p>
      </header>

      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
            En ce moment
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {trending.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
              >
                <div>
                  <p className="font-medium group-hover:text-accent">{tag.name}</p>
                  <p className="text-xs text-muted">{tagTypeLabels[tag.type]}</p>
                </div>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                  {tag.recentCount} récent{tag.recentCount > 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-12">
        {tagTypeOrder.map((type) => {
          const typeTags = tagsByType[type];
          if (typeTags.length === 0) return null;

          return (
            <section key={type}>
              <h2 className="mb-4 text-lg font-semibold">
                {tagTypeLabels[type]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {typeTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {tag.name}
                    <span className="ml-1.5 text-xs text-muted">
                      {tag.popularity}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-center text-sm text-muted">
        {allTags.length} tags au total
      </p>
    </div>
  );
}
