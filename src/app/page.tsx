import { ArticleCard } from "@/components/articles/article-card";
import { FamilyOverview } from "@/components/categories/family-overview";
import { TrendingTags } from "@/components/tags/trending-tags";
import { getAllArticles } from "@/lib/storage/articles";

export const revalidate = 60;

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          À la une
        </h1>
        <p className="mt-2 text-muted-foreground">
          L&apos;actualité française, synthétisée et objective.
        </p>
      </section>

      <FamilyOverview />

      <section aria-labelledby="feed-heading" className="mb-12">
        <h2 id="feed-heading" className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
          Derniers sujets
        </h2>
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} showSummary />
          ))}
        </div>
      </section>

      <TrendingTags />
    </div>
  );
}
