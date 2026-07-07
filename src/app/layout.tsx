import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppProviders } from "@/components/providers/app-providers";
import { clerkAppearance, clerkLocalization } from "@/lib/clerk/appearance";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://limo-ochre.vercel.app"),
  title: {
    default: "Limo — L'info claire, en un coup d'œil",
    template: "%s · Limo",
  },
  description:
    "Limo synthétise l'actualité française en articles concis et objectifs. Lisible partout, en un clic.",
  keywords: ["actualité", "news", "France", "synthèse", "information"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Limo",
    title: "Limo — L'info claire, en un coup d'œil",
    description:
      "L'actualité française, synthétisée et objective. Lisible partout, en un clic.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Limo",
    description: "L'actualité française, synthétisée et objective.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('limo-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ClerkProvider
          localization={clerkLocalization}
          appearance={clerkAppearance}
        >
          <AppProviders>
            <Header />
            <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-3xl px-4 py-8 sm:px-6">
              {children}
            </main>
            <Footer />
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
