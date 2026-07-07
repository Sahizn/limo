import type { Metadata } from "next";
import Link from "next/link";
import { SignInPrompt } from "@/components/auth/header-auth";
import { FavoritesPageClient } from "@/components/favorites/favorites-page-client";
import { getAllArticles } from "@/lib/storage/articles";
import { buildTagMap } from "@/lib/storage/tag-map";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Vos catégories d'actualité favorites sur Limo.",
};

export default async function FavorisPage() {
  const [articles, tagLookup] = await Promise.all([
    getAllArticles(),
    buildTagMap(),
  ]);

  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Mes favoris
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gardez uniquement les catégories qui vous intéressent — économie,
          politique, sport, et bien d&apos;autres.
        </p>
        <div className="mt-3">
          <SignInPrompt />
        </div>
      </header>

      <FavoritesPageClient articles={articles} tagLookup={tagLookup} />
    </div>
  );
}
