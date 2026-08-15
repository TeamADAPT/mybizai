import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Agent marketplace",
  description: "MyBizAI AI agent marketplace",
};

const agents = [
  {
    name: "Research Scout",
    category: "Market research",
    blurb: "Maps TAM / whitespace and cites sources before you approve deepen prompts.",
    status: "Featured",
  },
  {
    name: "Brand Steward",
    category: "Identity",
    blurb: "Keeps cobalt / orange / gold and voice locked across kit export and campaigns.",
    status: "Installed",
  },
  {
    name: "Campaign Runner",
    category: "Marketing",
    blurb: "Drafts multi-channel briefs and waits for Approve before spending.",
    status: "New",
  },
  {
    name: "Finance Sentinel",
    category: "Projections",
    blurb: "Runs base / stretch / conservative with cash intervention flags.",
    status: "Featured",
  },
  {
    name: "Venture Concierge",
    category: "Operations",
    blurb: "Spins workspace ventures from approved plan sections.",
    status: "Wishlist",
  },
  {
    name: "Academy Guide",
    category: "Learning",
    blurb: "Pairs playbook steps with short tutorials for new operators.",
    status: "New",
  },
];

export default function MarketplacePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh] py-14">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Studio · Marketplace
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
          AI agent marketplace
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Skills ADAPT can install into a venture — curated for Fifth Avenue
          execution, not a generic plugin aisle.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <article
              key={agent.name}
              className="flex flex-col rounded-2xl border border-brand-gold/20 bg-card/70 p-5 dark:bg-brand-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
                {agent.status}
              </p>
              <h2 className="mt-2 font-display text-xl tracking-tight">
                {agent.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {agent.category}
              </p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">
                {agent.blurb}
              </p>
              <Button
                className="mt-5 w-full rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                disabled
              >
                Install (soon)
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${lang}/shell`}>
            <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
              Open shell
            </Button>
          </Link>
          <Link href={`/${lang}/playbook`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              Playbook
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {brand.parent} · marketplace stub from stitch mocks — wire install next
        </p>
      </div>
    </div>
  );
}
