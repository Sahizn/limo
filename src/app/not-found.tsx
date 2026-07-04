import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-semibold text-muted">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
