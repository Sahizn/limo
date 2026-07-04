import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Limo — L'info claire, en un coup d'œil",
    template: "%s · Limo",
  },
  description:
    "Limo synthétise l'actualité française en articles concis et objectifs. Lisible partout, en un clic.",
  keywords: ["actualité", "news", "France", "synthèse", "information"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-3xl px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
