import Link from "next/link";
import { Search } from "lucide-react";
import { families } from "@/lib/data/categories";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Limo
          </Link>
          <Link
            href="/recherche"
            className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Rechercher</span>
          </Link>
        </div>

        <nav
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 scrollbar-none sm:-mx-6 sm:px-6"
          aria-label="Familles de catégories"
        >
          <Link
            href="/"
            className="shrink-0 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white"
          >
            À la une
          </Link>
          {families.map((family) => (
            <Link
              key={family.slug}
              href={`/famille/${family.slug}`}
              className="shrink-0 rounded-full bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
            >
              {family.name}
            </Link>
          ))}
          <Link
            href="/tags"
            className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            Tags
          </Link>
          <Link
            href="/categories"
            className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            Toutes
          </Link>
        </nav>
      </div>
    </header>
  );
}
