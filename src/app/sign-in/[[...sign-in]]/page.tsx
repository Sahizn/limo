import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default function SignInPage() {
  return (
    <div>
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="mt-2 text-muted-foreground">
          Google, Apple, X ou numéro de téléphone — un compte pour vos favoris
          Limo.
        </p>
      </header>

      <div className="flex justify-center">
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
}
