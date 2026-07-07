import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales du site Limo.",
};

export default function MentionsLegalesPage() {
  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Mentions légales
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-medium text-foreground">Éditeur</h2>
          <p>
            Limo — plateforme d&apos;agrégation et de synthèse d&apos;actualité
            française. Site accessible à l&apos;adresse{" "}
            <a
              href="https://limo-ochre.vercel.app"
              className="text-accent hover:underline"
            >
              limo-ochre.vercel.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-foreground">Contenu</h2>
          <p>
            Les articles sont produits à partir de flux RSS publics. Les sources
            originales sont citées sur chaque page article. Limo ne se substitue
            pas aux médias sources.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-foreground">Contact</h2>
          <p>
            Pour toute question :{" "}
            <a
              href="mailto:contact@limo.news"
              className="text-accent hover:underline"
            >
              contact@limo.news
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
