import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Operator playbook",
  description: "How to run MyBizAI day to day",
};

const steps = [
  {
    title: "Request private access",
    body: "Enter through login-clerk. Sandbox billing keeps experiments free.",
    href: "login-clerk",
    cta: "Open access",
  },
  {
    title: "Lock the brand system",
    body: "Pick cobalt / orange / gold, type, logo style, and voice — then export JSON.",
    href: "brand-kit",
    cta: "Brand kit",
  },
  {
    title: "Drive the shell",
    body: "Switch modules, approve plans, and send assist-dock prompts.",
    href: "shell",
    cta: "Product shell",
  },
  {
    title: "Read the studio surfaces",
    body: "Research, plan, campaigns, and finance hold mock-backed narratives that deep-link into the shell.",
    href: "research",
    cta: "Market research",
  },
  {
    title: "Monitor the workspace",
    body: "Overview metrics, billing usage, and settings stay in dashboard chrome.",
    href: "dashboard",
    cta: "Workspace",
  },
];

const studios = [
  { href: "ideas", label: "Ideas" },
  { href: "research", label: "Research" },
  { href: "plan", label: "Plan" },
  { href: "campaigns", label: "Campaigns" },
  { href: "finance", label: "Finance" },
  { href: "marketplace", label: "Marketplace" },
  { href: "academy", label: "Academy" },
  { href: "onboarding", label: "Onboarding" },
];

export default function PlaybookPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh] py-14">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Operator playbook
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
          Run the agency loop
        </h1>
        <p className="mt-4 text-muted-foreground">
          A short path through MyBizAI from {brand.parent} — brainstorm,
          architect, execute without losing the brand.
        </p>

        <ol className="mt-12 space-y-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-brand-gold/25 bg-card/70 p-6 dark:bg-brand-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-orange">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">
                {step.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              <Link href={`/${lang}/${step.href}`} className="mt-4 inline-block">
                <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
                  {step.cta}
                </Button>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Studio doors
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {studios.map((studio) => (
              <Link key={studio.href} href={`/${lang}/${studio.href}`}>
                <Button
                  variant="outline"
                  className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                >
                  {studio.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/${lang}/design`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              Design foundation
            </Button>
          </Link>
          <Link href={`/${lang}/docs`}>
            <Button variant="ghost" className="rounded-full">
              Docs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
