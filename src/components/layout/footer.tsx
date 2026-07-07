import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">Limo</p>
            <p className="mt-1 text-sm text-muted">
              L&apos;info claire, en un coup d&apos;œil.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/categories" className="hover:text-foreground">
              Catégories
            </Link>
            <Link href="/tags" className="hover:text-foreground">
              Tags
            </Link>
            <Link href="/recherche" className="hover:text-foreground">
              Recherche
            </Link>
            <Link href="/enregistres" className="hover:text-foreground">
              Enregistrés
            </Link>
            <Link href="/favoris" className="hover:text-foreground">
              Favoris
            </Link>
            <Link href="/mentions-legales" className="hover:text-foreground">
              Mentions légales
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted">
          Sources citées sur chaque article
        </p>
      </div>
    </footer>
  );
}
