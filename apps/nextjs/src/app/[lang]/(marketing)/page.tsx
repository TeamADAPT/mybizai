import Link from "next/link";

import { BackgroundLines } from "@saasfly/ui/background-lines";
import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { FeaturesGrid } from "~/components/features-grid";
import { Comments } from "~/components/comments";
import type { Locale } from "~/config/i18n-config";
import { brand } from "~/config/brand";
import { getDictionary } from "~/lib/get-dictionary";

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0 bg-hero-wash" />
        <div className="absolute inset-0 grain" />
        <BackgroundLines className="pointer-events-none absolute inset-0 h-full min-h-full w-full opacity-35 md:h-full">
          <span className="sr-only">atmosphere</span>
        </BackgroundLines>

        <div className="container relative z-10 flex min-h-[88vh] flex-col items-center justify-center py-20 text-center">
          <div className="animate-fade-up mb-8">
            <BrandLogo size="lg" spin />
          </div>

          <h1
            className="animate-fade-up max-w-4xl font-display text-4xl leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
            style={{ animationDelay: "90ms" }}
          >
            Your vision deserves a personal touch.
          </h1>

          <p
            className="animate-fade-up mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {brand.mission} {brand.tagline} with an AI partner that designs,
            builds, and scales.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "230ms" }}
          >
            <Link href={`/${lang}/login-clerk`}>
              <Button className="h-12 rounded-full bg-brand-orange px-8 text-base text-brand-midnight hover:bg-brand-orange-soft animate-cta-glow">
                Request private access
                <Icons.ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${lang}/design`}>
              <Button
                variant="outline"
                className="h-12 rounded-full border-brand-gold/60 px-8 text-base text-brand-gold hover:bg-brand-gold/10"
              >
                Explore design system
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            One autonomous platform
          </h2>
          <p className="mt-3 text-muted-foreground">
            From idea to execution — research, brand, marketing, and operations
            in a single cobalt-dark workspace.
          </p>
        </div>
        <div className="mt-10">
          <FeaturesGrid dict={dict.marketing.features_grid} />
        </div>
      </section>

      <section className="container py-16">
        <div className="flex flex-col items-center pb-16">
          <h2 className="mb-4 text-center font-display text-3xl tracking-tight md:text-5xl">
            {dict.marketing.people_comment.title}
          </h2>
          <p className="mb-8 text-muted-foreground">
            {dict.marketing.people_comment.desc}
          </p>
          <div className="w-full overflow-x-hidden">
            <Comments />
          </div>
        </div>
      </section>
    </>
  );
}
