import type { Metadata } from "next";
import Link from "next/link";
import { SignInPrompt } from "@/components/auth/header-auth";
import { SavedArticlesPageClient } from "@/components/saved-articles/saved-articles-page-client";

export const metadata: Metadata = {
  title: "Articles enregistrés",
  description:
    "Retrouvez vos articles Limo enregistrés, conservés indéfiniment sur votre appareil.",
};

export default function EnregistresPage() {
  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Articles enregistrés
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gardez vos articles préférés personnellement. Le fil public n&apos;affiche
          que les publications des dernières 24 heures — vos enregistrements
          restent accessibles ici sans limite de temps.
        </p>
        <div className="mt-3">
          <SignInPrompt />
        </div>
      </header>

      <SavedArticlesPageClient />
    </div>
  );
}
