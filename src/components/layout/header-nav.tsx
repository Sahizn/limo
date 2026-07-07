"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { families } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean, variant: "pill" | "outline" = "pill") {
  if (variant === "pill") {
    return cn(
      "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors",
      active
        ? "bg-accent font-medium text-white"
        : "bg-card text-muted-foreground hover:bg-card-hover hover:text-foreground"
    );
  }

  return cn(
    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
    active
      ? "border-accent font-medium text-accent"
      : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
  );
}

export function HeaderNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isFavoris = pathname === "/favoris";
  const isEnregistres = pathname === "/enregistres";
  const isTags = pathname.startsWith("/tags") || pathname.startsWith("/tag/");
  const isCategories =
    pathname.startsWith("/categories") || pathname.startsWith("/categorie/");

  return (
    <nav
      className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 scrollbar-none sm:-mx-6 sm:px-6"
      aria-label="Familles de catégories"
    >
      <Link href="/" className={navLinkClass(isHome)}>
        À la une
      </Link>
      <Link href="/favoris" className={navLinkClass(isFavoris, "outline")}>
        Favoris
      </Link>
      <Link href="/enregistres" className={navLinkClass(isEnregistres, "outline")}>
        Enregistrés
      </Link>
      {families.map((family) => (
        <Link
          key={family.slug}
          href={`/famille/${family.slug}`}
          className={navLinkClass(pathname.startsWith(`/famille/${family.slug}`))}
        >
          {family.name}
        </Link>
      ))}
      <Link href="/tags" className={navLinkClass(isTags, "outline")}>
        Tags
      </Link>
      <Link href="/categories" className={navLinkClass(isCategories, "outline")}>
        Toutes
      </Link>
    </nav>
  );
}
