"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function HeaderAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="h-9 w-16 animate-pulse rounded-full bg-card" aria-hidden />
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="redirect" forceRedirectUrl="/">
        <button
          type="button"
          className="rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
        >
          Connexion
        </button>
      </SignInButton>
    );
  }

  return <UserButton />;
}

export function SignInPrompt() {
  return (
    <p className="text-sm text-muted-foreground">
      <Link href="/sign-in" className="text-accent hover:underline">
        Connectez-vous
      </Link>{" "}
      pour synchroniser vos favoris et articles enregistrés sur tous vos
      appareils.
    </p>
  );
}
