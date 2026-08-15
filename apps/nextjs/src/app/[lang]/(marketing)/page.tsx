import Link from "next/link";

import { BackgroundLines } from "@saasfly/ui/background-lines";
import { Button } from "@saasfly/ui/button";
import { TextGenerateEffect } from "@saasfly/ui/text-generate-effect";
import * as Icons from "@saasfly/ui/icons";

import { BrandCapabilities } from "~/components/brand-capabilities";
import { BrandLogo } from "~/components/brand-logo";
import { Comments } from "~/components/comments";
import { RightsideMarketing } from "~/components/rightside-marketing";
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
            <Link href={`/${lang}/shell`}>
              <Button
                variant="outline"
                className="h-12 rounded-full border-brand-gold/60 px-8 text-base text-brand-gold hover:bg-brand-gold/10"
              >
                Preview product shell
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="approach" className="container scroll-mt-24 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            How it moves
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            Brainstorm. Architect. Execute.
          </h2>
          <p className="mt-3 text-muted-foreground">
            One cobalt-dark workspace — research, brand, marketing, and
            operations without the agency overhead.
          </p>
        </div>
        <div className="mt-10">
          <BrandCapabilities lang={lang} />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border py-24">
        <div className="absolute inset-0 bg-hero-wash opacity-60" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <TextGenerateEffect
            words="Experience the Fifth Avenue agency approach, distilled into an autonomous platform."
            className="font-display !text-3xl !font-normal tracking-tight md:!text-5xl"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${lang}/design`}>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/60 text-brand-gold hover:bg-brand-gold/10"
              >
                Design foundation
              </Button>
            </Link>
            <Link href={`/${lang}/shell`}>
              <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
                Enter the shell
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            Pathways
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            Design. Execute. Access.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three doors into the platform — pick the surface that matches your
            next move.
          </p>
        </div>
        <div className="mt-10">
          <RightsideMarketing
            dict={dict.marketing.right_side}
            lang={lang}
          />
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            Operators
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            What operators are saying
          </h2>
          <p className="mt-3 text-muted-foreground">
            Founders and teams using autonomous execution with a personal touch.
          </p>
        </div>
        <div className="mt-10">
          <Comments />
        </div>
      </section>

      <section className="container py-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {brand.parent}
        </p>
        <p className="mt-3 font-display text-2xl tracking-tight md:text-3xl">
          Private access. Personal touch.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={`/${lang}/login-clerk`}>
            <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
              Request private access
            </Button>
          </Link>
          <Link href={`/${lang}/brand-kit`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/60 text-brand-gold hover:bg-brand-gold/10"
            >
              Build your brand kit
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
