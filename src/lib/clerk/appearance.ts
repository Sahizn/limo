import { frFR } from "@clerk/localizations";

export const clerkLocalization = frFR;

export const clerkAppearance = {
  variables: {
    colorPrimary: "#2997ff",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorBackground: "var(--card)",
    colorInputBackground: "var(--background)",
    colorInputText: "var(--foreground)",
    borderRadius: "1rem",
  },
  elements: {
    card: "shadow-none border border-border",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton:
      "border border-border bg-background text-foreground hover:bg-card-hover",
    formButtonPrimary: "bg-accent hover:bg-accent/90",
    footerActionLink: "text-accent hover:text-accent",
  },
};
