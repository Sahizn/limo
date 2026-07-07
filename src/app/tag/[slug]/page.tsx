import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { getArticlesByTag } from "@/lib/storage/articles";
import { getTagBySlug, getAllTags } from "@/lib/storage/tags";
import { buildTagMap } from "@/lib/storage/tag-map";
import {
  getRelatedTags,
  getTagArticleCount,
} from "@/lib/engine/tag-analytics";
import { tagTypeLabels } from "@/lib/types/tag";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag introuvable" };
  return {
    title: tag.name,
    description: tag.description,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const [articles, relatedTags, articleCount] = await Promise.all([
    getArticlesByTag(slug),
    getRelatedTags(slug, 6),
    getTagArticleCount(slug),
  ]);

  const tagLookup = await buildTagMap();

  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tags" className="hover:text-foreground">
          Tags
        </Link>
        <span className="mx-2">/</span>
        <span>{tag.name}</span>
      </nav>

      <header className="mb-10">
        <p className="text-sm text-accent">
          {tagTypeLabels[tag.type]}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {tag.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{tag.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <span>{articleCount} article{articleCount > 1 ? "s" : ""}</span>
          <span>
            Créé le {new Date(tag.createdAt).toLocaleDateString("fr-FR")}
          </span>
          <span>
            Actif le {new Date(tag.lastUsedAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
        {tag.alias.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Aussi connu sous : {tag.alias.join(" · ")}
          </p>
        )}
      </header>

      {relatedTags.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">
            Tags associés
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((related) => (
              <Link
                key={related.slug}
                href={`/tag/${related.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {related.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 ? (
        <section>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
            Articles
          </h2>
          <div className="flex flex-col gap-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                tagLookup={tagLookup}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          Aucun article lié à ce tag pour le moment.
        </p>
      )}
    </div>
  );
}
