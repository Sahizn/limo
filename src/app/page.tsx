import { FamilyOverview } from "@/components/categories/family-overview";
import { HomeExtras } from "@/components/favorites/home-extras";
import { HomeFeed } from "@/components/favorites/home-feed";
import { TrendingTags } from "@/components/tags/trending-tags";
import { getAllArticles } from "@/lib/storage/articles";
import { buildTagMap } from "@/lib/storage/tag-map";

export const revalidate = 60;

export default async function HomePage() {
  const [articles, tagLookup] = await Promise.all([getAllArticles(), buildTagMap()]);

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          À la une
        </h1>
        <p className="mt-2 text-muted-foreground">
          L&apos;actualité française des dernières 24 heures, synthétisée et
          objective.
        </p>
      </section>

      <HomeFeed articles={articles} tagLookup={tagLookup} />

      <HomeExtras>
        <FamilyOverview />
        <TrendingTags />
      </HomeExtras>
    </div>
  );
}
