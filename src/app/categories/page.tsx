import type { Metadata } from "next";
import Link from "next/link";
import { categories, families, getCategoriesByFamily } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Toutes les catégories",
  description: "Explorez les 28 catégories d'actualité de Limo.",
};

export default function CategoriesPage() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Toutes les catégories
        </h1>
        <p className="mt-2 text-muted-foreground">
          28 catégories pour couvrir toute l&apos;actualité qui vous intéresse.
        </p>
      </header>

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
                  <Link
                    key={category.slug}
                    href={`/categorie/${category.slug}`}
                    className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
                  >
                    <h3 className="font-medium group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{category.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-center text-sm text-muted">
        {categories.length} catégories au total
      </p>
    </div>
  );
}
