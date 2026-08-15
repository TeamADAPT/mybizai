"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type AgentStatus = "available" | "installed" | "wishlist";

type Agent = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  status: AgentStatus;
};

const initialAgents: Agent[] = [
  {
    id: "scout",
    name: "Research Scout",
    category: "Market research",
    blurb: "Maps TAM / whitespace and cites sources before deepen prompts.",
    status: "available",
  },
  {
    id: "steward",
    name: "Brand Steward",
    category: "Identity",
    blurb: "Keeps cobalt / orange / gold and voice locked across exports.",
    status: "installed",
  },
  {
    id: "runner",
    name: "Campaign Runner",
    category: "Marketing",
    blurb: "Drafts multi-channel briefs and waits for Approve before spend.",
    status: "available",
  },
  {
    id: "sentinel",
    name: "Finance Sentinel",
    category: "Projections",
    blurb: "Runs base / stretch / conservative with cash intervention flags.",
    status: "wishlist",
  },
  {
    id: "concierge",
    name: "Venture Concierge",
    category: "Operations",
    blurb: "Spins workspace ventures from approved plan sections.",
    status: "available",
  },
  {
    id: "guide",
    name: "Academy Guide",
    category: "Learning",
    blurb: "Pairs playbook steps with short tutorials for new operators.",
    status: "wishlist",
  },
];

export function MarketplaceBuilder({ lang }: { lang: string }) {
  const [agents, setAgents] = useState(initialAgents);
  const [filter, setFilter] = useState<"all" | AgentStatus>("all");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      filter === "all" ? agents : agents.filter((a) => a.status === filter),
    [agents, filter],
  );

  const counts = useMemo(() => {
    return {
      installed: agents.filter((a) => a.status === "installed").length,
      available: agents.filter((a) => a.status === "available").length,
      wishlist: agents.filter((a) => a.status === "wishlist").length,
    };
  }, [agents]);

  function install(id: string) {
    startTransition(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "installed" as const } : a,
        ),
      );
      const name = agents.find((a) => a.id === id)?.name ?? "Agent";
      setStatus(`Installed · ${name} ready for shell assist dock`);
    });
  }

  function wishlist(id: string) {
    startTransition(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "wishlist" as const } : a,
        ),
      );
      const name = agents.find((a) => a.id === id)?.name ?? "Agent";
      setStatus(`Wishlist · ${name}`);
    });
  }

  function uninstall(id: string) {
    startTransition(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "available" as const } : a,
        ),
      );
      setStatus("Removed from venture stack");
    });
  }

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Marketplace · Interactive"
      title="AI agent marketplace"
      lead="Install the skills ADAPT needs for a venture — curated for Fifth Avenue execution, not a plugin aisle."
      shellModule="dashboard"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["installed", "Installed"],
            ["available", "Available"],
            ["wishlist", "Wishlist"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={
              filter === id
                ? "rounded-full bg-brand-orange/15 px-4 py-1.5 text-sm font-medium text-brand-orange"
                : "rounded-full bg-muted/60 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Installed
          </p>
          <p className="mt-1 font-display text-3xl text-brand-orange">
            {counts.installed}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Available
          </p>
          <p className="mt-1 font-display text-3xl text-brand-orange">
            {counts.available}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Wishlist
          </p>
          <p className="mt-1 font-display text-3xl text-brand-orange">
            {counts.wishlist}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((agent) => (
          <article
            key={agent.id}
            className="flex flex-col rounded-2xl border border-brand-gold/20 bg-card/80 p-5 dark:bg-brand-ink/40"
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
            <div className="mt-5 flex flex-wrap gap-2">
              {agent.status !== "installed" ? (
                <Button
                  type="button"
                  className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                  onClick={() => install(agent.id)}
                  disabled={pending}
                >
                  <Icons.Check className="mr-2 h-4 w-4" />
                  Install
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                  onClick={() => uninstall(agent.id)}
                  disabled={pending}
                >
                  Remove
                </Button>
              )}
              {agent.status !== "wishlist" && agent.status !== "installed" ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => wishlist(agent.id)}
                  disabled={pending}
                >
                  Wishlist
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {status ? (
        <p className="mt-6 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
          {status}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/${lang}/shell`}>
          <Button
            variant="outline"
            className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
          >
            Open shell
          </Button>
        </Link>
        <Link href={`/${lang}/academy`}>
          <Button variant="ghost" className="rounded-full">
            Academy
          </Button>
        </Link>
      </div>
    </StudioBuilderChrome>
  );
}
