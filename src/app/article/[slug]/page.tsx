import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SaveArticleButton } from "@/components/saved-articles/save-article-button";
import { getArticleBySlug, getArticleSlugs } from "@/lib/storage/articles";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getTagBySlug } from "@/lib/storage/tags";
import { formatRelativeTime } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.summary[0],
    openGraph: {
      title: article.title,
      description: article.summary[0],
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategoryBySlug(article.categorySlug);
  const articleTags = await Promise.all(
    article.tagSlugs.map((tagSlug) => getTagBySlug(tagSlug))
  );

  return (
    <article>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/categorie/${category.slug}`}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <header className="mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {article.isBreaking && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-breaking/15 px-2.5 py-1 text-xs font-medium text-breaking">
                <span className="h-1.5 w-1.5 rounded-full bg-breaking" />
                En ce moment
              </span>
            )}
            <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {article.title}
            </h1>
          </div>
          <SaveArticleButton article={article} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {category && (
            <Link
              href={`/categorie/${category.slug}`}
              className="text-accent hover:underline"
            >
              {category.name}
            </Link>
          )}
          <span>·</span>
          <time dateTime={article.publishedAt}>
            {formatRelativeTime(new Date(article.publishedAt))}
          </time>
        </div>
      </header>

      <div className="space-y-4 text-base leading-relaxed text-foreground/90">
        {article.summary.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {article.tagSlugs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {articleTags.map((tag) => {
              if (!tag) return null;
              return (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {tag.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Sources
        </h2>
        <ul className="space-y-3">
          {article.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent transition-colors hover:underline"
              >
                {source.name}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Pour l&apos;article complet, consultez la source originale.
        </p>
      </section>
    </article>
  );
}
