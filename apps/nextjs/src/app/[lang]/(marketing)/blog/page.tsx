import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import type { Locale } from "~/config/i18n-config";
import { brand } from "~/config/brand";

export const metadata = {
  title: "Insights",
  description: "MyBizAI notes on autonomous agency and brand systems",
};

export default function BlogPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <main className="relative min-h-[70vh] py-16">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-50" />
      <div className="container relative z-10 mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Insights
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Field notes from the agency loop
        </h1>
        <p className="mt-4 text-muted-foreground">
          Long-form posts are on the way. Meanwhile explore the living brand
          system and product shell from {brand.parent}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={`/${lang}/brand-kit`}>
            <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
              Brand Identity Kit
            </Button>
          </Link>
          <Link href={`/${lang}/shell`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/60 text-brand-gold hover:bg-brand-gold/10"
            >
              Product shell
            </Button>
          </Link>
          <Link href={`/${lang}/design`}>
            <Button variant="ghost" className="rounded-full">
              Design foundation
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
