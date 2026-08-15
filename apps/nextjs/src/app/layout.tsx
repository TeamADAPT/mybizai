import { ClerkProvider } from "@clerk/nextjs";
import {
  IBM_Plex_Mono as FontMono,
  Instrument_Serif as FontDisplay,
  Manrope as FontSans,
} from "next/font/google";

import "~/styles/globals.css";

import { NextDevtoolsProvider } from "@next-devtools/core";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { cn } from "@saasfly/ui";
import { Toaster } from "@saasfly/ui/toaster";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { brand } from "~/config/brand";
import { i18n } from "~/config/i18n-config";
import { hasClerkConfigured } from "~/lib/clerk-config";
import { siteConfig } from "~/config/site";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = FontDisplay({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "MyBizAI",
    "ADAPT",
    "Autonomous business",
    "AI agents",
    "Fifth Avenue Intelligence Group",
  ],
  authors: [
    {
      name: brand.parent,
    },
  ],
  creator: brand.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/images/brand/mybizai-mark.svg",
    shortcut: "/images/brand/mybizai-mark.svg",
    apple: "/images/brand/mybizai-mark.svg",
  },
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextDevtoolsProvider>{children}</NextDevtoolsProvider>
      <Analytics />
      <SpeedInsights />
      <Toaster />
      <TailwindIndicator />
    </ThemeProvider>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable,
        )}
      >
        {hasClerkConfigured() ? <ClerkProvider>{app}</ClerkProvider> : app}
      </body>
    </html>
  );
}
