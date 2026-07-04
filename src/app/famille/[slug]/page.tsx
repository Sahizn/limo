import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  families,
  getCategoriesByFamily,
  getFamilyBySlug,
} from "@/lib/data/categories";
import { getAllArticles } from "@/lib/storage/articles";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const family = getFamilyBySlug(slug);
  if (!family) return { title: "Famille introuvable" };
  return {
    title: family.name,
    description: family.description,
  };
}

export default async function FamilyPage({ params }: PageProps) {
  const { slug } = await params;
  const family = getFamilyBySlug(slug);
  if (!family) notFound();

  const familyCategories = getCategoriesByFamily(family.slug);
  const categorySlugs = new Set(familyCategories.map((c) => c.slug));
  const allArticles = await getAllArticles();
  const articles = allArticles.filter((a) => categorySlugs.has(a.categorySlug));

  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {family.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{family.description}</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Catégories
        </h2>
        <div className="flex flex-wrap gap-2">
          {familyCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorie/${category.slug}`}
              className="rounded-full bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card-hover hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 ? (
        <section>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
            Articles récents
          </h2>
          <div className="flex flex-col gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} showSummary />
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          Aucun article dans cette famille pour le moment.
        </p>
      )}
    </div>
  );
}
