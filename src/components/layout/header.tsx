import Link from "next/link";
import { Search } from "lucide-react";
import { HeaderAuth } from "@/components/auth/header-auth";
import { HeaderNav } from "@/components/layout/header-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Limo
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <HeaderAuth />
            <Link
              href="/recherche"
              className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Rechercher</span>
            </Link>
          </div>
        </div>

        <HeaderNav />
      </div>
    </header>
  );
}
