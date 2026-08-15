import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Onboarding complete",
  description: "MyBizAI first-run checklist",
};

const nextSteps = [
  {
    title: "Create your first venture",
    body: "Empty → name it → approve for the shell when the loop is ready.",
    href: "ventures",
    cta: "Ventures",
  },
  {
    title: "Lock the brand kit",
    body: "Cobalt / orange / gold, type, voice — then export JSON.",
    href: "brand-kit",
    cta: "Brand kit",
  },
  {
    title: "Preview the shell",
    body: "Switch modules, approve a plan, send an assist prompt.",
    href: "shell",
    cta: "Product shell",
  },
];

export default function OnboardingPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center">
          <BrandLogo href={`/${lang}`} size="md" spin />
        </div>
        <div className="mt-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-orange/40 bg-brand-orange/10 text-brand-orange animate-fade-up">
            <Icons.Rocket className="h-7 w-7" />
          </div>
        </div>
        <h1
          className="mt-6 font-display text-4xl tracking-tight animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          You&apos;re cleared for private access
        </h1>
        <p
          className="mt-3 text-muted-foreground animate-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          First-run checklist from {brand.parent} — stay above the agents, keep
          the personal touch.
        </p>

        <div
          className="mt-10 space-y-4 text-left animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {nextSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-brand-gold/25 bg-card/80 p-5 dark:bg-brand-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-orange">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 font-display text-xl tracking-tight">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              <Link href={`/${lang}/${step.href}`} className="mt-3 inline-block">
                <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
                  {step.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${lang}/academy`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              Academy
            </Button>
          </Link>
          <Link href={`/${lang}/playbook`}>
            <Button variant="ghost" className="rounded-full">
              Playbook
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
