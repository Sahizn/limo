"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Article } from "@/lib/types/article";
import type { Category } from "@/lib/data/categories";
import type { Tag } from "@/lib/types/tag";

interface SearchClientProps {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
}

export function SearchClient({ articles, categories, tags }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { articles: [], categories: [], tags: [] };

    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const matchedArticles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.some((s) => s.toLowerCase().includes(q))
    );

    const matchedCategories = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );

    const matchedTags = tags.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.alias.some((a) => a.toLowerCase().includes(q))
    );

    return {
      articles: matchedArticles,
      categories: matchedCategories,
      tags: matchedTags,
    };
  }, [query, articles, categories, tags]);

  const hasResults =
    results.articles.length > 0 ||
    results.categories.length > 0 ||
    results.tags.length > 0;

  return (
    <div>
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex. OpenAI, retraites, Bretagne..."
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          autoFocus
        />
      </div>

      {!query.trim() && (
        <p className="text-center text-sm text-muted">
          Tapez un mot-clé pour commencer.
        </p>
      )}

      {query.trim() && !hasResults && (
        <p className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
          Aucun résultat pour « {query} ».
        </p>
      )}

      {results.articles.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
            Articles ({results.articles.length})
          </h2>
          <ul className="space-y-3">
            {results.articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/article/${article.slug}`}
                  className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
                >
                  <span className="font-medium hover:text-accent">
                    {article.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.categories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
            Catégories ({results.categories.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {results.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.tags.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
            Tags ({results.tags.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {results.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
