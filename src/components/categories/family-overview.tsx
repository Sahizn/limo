import Link from "next/link";
import { families, getCategoriesByFamily } from "@/lib/data/categories";

export function FamilyOverview() {
  return (
    <section aria-labelledby="families-heading" className="mb-10">
      <h2 id="families-heading" className="sr-only">
        Explorer par famille
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {families.map((family) => {
          const cats = getCategoriesByFamily(family.slug);
          return (
            <Link
              key={family.slug}
              href={`/famille/${family.slug}`}
              className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-card-hover"
            >
              <h3 className="font-semibold group-hover:text-accent">
                {family.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{family.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {cats.length} catégories
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
