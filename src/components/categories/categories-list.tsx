"use client";

import Link from "next/link";
import { FavoriteCategoryButton } from "@/components/favorites/favorite-category-button";
import { categories, families, getCategoriesByFamily } from "@/lib/data/categories";

export function CategoriesList() {
  return (
    <div className="space-y-12">
      {families.map((family) => {
        const familyCategories = getCategoriesByFamily(family.slug);
        return (
          <section key={family.slug}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">
                <Link
                  href={`/famille/${family.slug}`}
                  className="hover:text-accent"
                >
                  {family.name}
                </Link>
              </h2>
              <span className="text-sm text-muted">
                {familyCategories.length} catégories
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {familyCategories.map((category) => (
                <div
                  key={category.slug}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
                >
                  <Link
                    href={`/categorie/${category.slug}`}
                    className="min-w-0 flex-1"
                  >
                    <h3 className="font-medium group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{category.description}</p>
                  </Link>
                  <FavoriteCategoryButton
                    categorySlug={category.slug}
                    categoryName={category.name}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-sm text-muted">
        {categories.length} catégories au total
      </p>
    </div>
  );
}
