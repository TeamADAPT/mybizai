"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type Idea = {
  id: string;
  title: string;
  industry: string;
  angle: string;
  kept: boolean;
};

const seeds: Idea[] = [
  {
    id: "1",
    title: "Boutique hospitality OS",
    industry: "Hospitality",
    angle: "Private-access ops for multi-property hosts with ADAPT concierges.",
    kept: false,
  },
  {
    id: "2",
    title: "Coastal SMB logistics desk",
    industry: "Logistics",
    angle: "Agency-grade routing plans that execute after Approve.",
    kept: true,
  },
  {
    id: "3",
    title: "Founder brand studio",
    industry: "Professional services",
    angle: "Cobalt/orange kits + campaign gate for solo operators.",
    kept: false,
  },
];

export function IdeasBuilder({ lang }: { lang: string }) {
  const [ideas, setIdeas] = useState(seeds);
  const [prompt, setPrompt] = useState(
    "Spin three venture ideas for operators who want personal touch + autonomy.",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function generate() {
    startTransition(() => {
      const next: Idea = {
        id: String(Date.now()),
        title: "Adaptive retail pop-up stack",
        industry: "Retail",
        angle:
          "Short-run brand kits and campaign bursts with finance runway guardrails.",
        kept: false,
      };
      setIdeas((prev) => [next, ...prev]);
      setStatus("Generated · new idea from assist prompt");
    });
  }

  function toggleKeep(id: string) {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, kept: !idea.kept } : idea,
      ),
    );
  }

  function sendToPlan(idea: Idea) {
    startTransition(() => {
      setStatus(`Queued for plan · “${idea.title}” as venture vision seed`);
    });
  }

  const kept = ideas.filter((i) => i.kept).length;

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Ideas · Interactive"
      title="Idea generation"
      lead="Brainstorm with ADAPT, keep the ones with Fifth Avenue legs, then seed the business plan."
      shellModule="businesses"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <label className="block space-y-2 rounded-2xl border border-border bg-card/80 p-4 dark:bg-brand-ink/40">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Assist prompt
            </span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none ring-brand-orange focus:ring-2"
            />
            <Button
              type="button"
              className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              onClick={generate}
              disabled={pending}
            >
              Generate ideas
            </Button>
          </label>

          <div className="space-y-3">
            {ideas.map((idea) => (
              <article
                key={idea.id}
                className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
                      {idea.industry}
                    </p>
                    <h2 className="mt-1 font-display text-xl tracking-tight">
                      {idea.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {idea.angle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleKeep(idea.id)}
                    className={
                      idea.kept
                        ? "rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-medium text-brand-orange"
                        : "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                    }
                  >
                    {idea.kept ? "Kept" : "Keep"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                    onClick={() => sendToPlan(idea)}
                    disabled={pending}
                  >
                    <Icons.Check className="mr-2 h-4 w-4" />
                    Seed plan
                  </Button>
                  <Link href={`/${lang}/research`}>
                    <Button variant="ghost" className="rounded-full">
                      Pressure-test in research
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40 h-fit">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Kept ideas
          </p>
          <p className="font-display text-4xl text-brand-orange">{kept}</p>
          <p className="text-sm text-muted-foreground">
            Kept ideas become vision seeds in the plan builder. Discard the rest
            without guilt — ADAPT can regenerate.
          </p>
          <Link href={`/${lang}/plan`}>
            <Button className="w-full rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
              Open plan builder
            </Button>
          </Link>
          <Link href={`/${lang}/onboarding`}>
            <Button
              variant="outline"
              className="w-full rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              First-run checklist
            </Button>
          </Link>
          {status ? (
            <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-2 text-sm text-brand-orange animate-fade-up">
              {status}
            </p>
          ) : null}
        </aside>
      </div>
    </StudioBuilderChrome>
  );
}
