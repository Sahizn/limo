import type { Metadata } from "next";
import Link from "next/link";
import { CategoriesList } from "@/components/categories/categories-list";

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
          Appuyez sur l&apos;étoile pour ajouter une catégorie à vos{" "}
          <Link href="/favoris" className="text-accent hover:underline">
            favoris
          </Link>
          .
        </p>
      </header>

      <CategoriesList />
    </div>
  );
}
