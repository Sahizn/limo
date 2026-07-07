import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  categories,
  getCategoriesByFamily,
  getFamilyBySlug,
} from "@/lib/data/categories";
import { getArticlesByCategory } from "@/lib/storage/articles";
import { buildTagMap } from "@/lib/storage/tag-map";
import { CategoryFavoriteHeader } from "@/components/favorites/category-favorite-header";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Catégorie introuvable" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const family = getFamilyBySlug(category.family);
  const [articles, tagLookup] = await Promise.all([
    getArticlesByCategory(slug),
    buildTagMap(),
  ]);
  const relatedCategories = getCategoriesByFamily(category.family).filter(
    (c) => c.slug !== slug
  );

  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        {family && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/famille/${family.slug}`} className="hover:text-foreground">
              {family.name}
            </Link>
          </>
        )}
      </nav>

      <header className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {category.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          </div>
          <CategoryFavoriteHeader
            categorySlug={category.slug}
            categoryName={category.name}
          />
        </div>
      </header>

      {articles.length > 0 ? (
        <div className="mb-12 flex flex-col gap-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              tagLookup={tagLookup}
              showSummary
            />
          ))}
        </div>
      ) : (
        <p className="mb-12 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Aucun article dans cette catégorie pour le moment. Consultez{" "}
          <Link href="/" className="text-accent hover:underline">
            l&apos;accueil
          </Link>{" "}
          ou une autre catégorie.
        </p>
      )}

      {relatedCategories.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
            Autres catégories · {family?.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
