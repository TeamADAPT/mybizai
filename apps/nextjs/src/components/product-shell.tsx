"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import { TextGenerateEffect } from "@saasfly/ui/text-generate-effect";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { ThemeSwitch } from "~/components/theme-switch";
import { brand } from "~/config/brand";

const modules = [
  { id: "dashboard", label: "Dashboard" },
  { id: "businesses", label: "My Businesses" },
  { id: "research", label: "Market Research" },
  { id: "brand", label: "Brand Identity" },
  { id: "marketing", label: "Marketing Plan" },
  { id: "finance", label: "Financial Projections" },
] as const;

const canvases: Record<
  (typeof modules)[number]["id"],
  { title: string; lead: string; bullets: string[] }
> = {
  dashboard: {
    title: "Autonomous logistics overview",
    lead: "Live status across agents, approvals, and revenue loops.",
    bullets: [
      "3 plans awaiting your approval",
      "12 agents running · 2 need guidance",
      "Weekly ARR delta tracking +2.4%",
    ],
  },
  businesses: {
    title: "Businesses in flight",
    lead: "Each venture gets its own ADAPT stack — shared intelligence, separate execution.",
    bullets: [
      "Fifth Avenue demo · Brand kit ready",
      "Logistics pilot · Ops agents active",
      "Archive / pause without losing history",
    ],
  },
  research: {
    title: "Market research",
    lead: "Competitive maps and demand signals, distilled for decision — not dashboards for their own sake.",
    bullets: [
      "Segment heat · coastal SMB logistics",
      "Competitor whitespace · agency vs SaaS",
      "Prompt to deepen any cell",
    ],
  },
  brand: {
    title: "Brand identity kit",
    lead: "Cobalt, orange, gold — locked tokens with consistency checks.",
    bullets: [
      "Primary · Ultramarine #120a8f",
      "Action · Dark Orange #ff8c00",
      "Emphasis · Gold #d4af37",
    ],
  },
  marketing: {
    title: "Campaign architect",
    lead: "Multi-channel plans that execute after you approve the brief.",
    bullets: [
      "Private-access launch sequence",
      "LinkedIn + email + landing sync",
      "Budget reallocation via prompt",
    ],
  },
  finance: {
    title: "Financial projections",
    lead: "Scenario runs with intervention points — you stay above the math.",
    bullets: [
      "Base / stretch / conservative",
      "Cash runway with agent cost lines",
      "Export for investors when ready",
    ],
  },
};

export function ProductShell({ lang }: { lang: string }) {
  const [active, setActive] =
    useState<(typeof modules)[number]["id"]>("brand");
  const canvas = canvases[active];

  return (
    <div className="min-h-[85vh] rounded-2xl border border-border bg-brand-midnight/80 text-foreground shadow-2xl shadow-brand-cobalt/20 overflow-hidden">
      <div className="flex min-h-[85vh] flex-col md:flex-row">
        <aside className="flex w-full flex-col border-b border-border md:w-60 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 border-b border-border px-4 py-4">
            <BrandLogo href={`/${lang}`} size="sm" showWordmark />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 py-3 md:flex-col md:overflow-visible">
            {modules.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActive(mod.id)}
                className={
                  active === mod.id
                    ? "whitespace-nowrap rounded-lg bg-brand-orange/15 px-3 py-2 text-left text-sm font-medium text-brand-orange"
                    : "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                }
              >
                {mod.label}
              </button>
            ))}
          </nav>
          <p className="mt-auto hidden px-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold/70 md:block">
            Wireframe · product shell
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gold">
                {brand.parent}
              </p>
              <h1 className="font-display text-xl tracking-tight md:text-2xl">
                {canvas.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-brand-gold/40 text-xs text-brand-gold sm:flex">
                NC
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-8 px-4 py-8 md:px-8">
            <p className="max-w-2xl text-muted-foreground">{canvas.lead}</p>
            <ul className="space-y-3">
              {canvas.bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-border/60 py-3 text-sm"
                >
                  <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
                Approve plan
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                asChild
              >
                <Link href={`/${lang}/design`}>Design tokens</Link>
              </Button>
            </div>
          </main>

          <footer className="border-t border-border bg-brand-ink/80 px-4 py-3 md:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                  AI assist dock
                </p>
                <TextGenerateEffect
                  words="Increase social ad budget 20% and re-run the logistics campaign scenario."
                  className="!mt-1 text-left text-sm font-normal"
                />
              </div>
              <Button
                size="sm"
                className="shrink-0 rounded-full bg-brand-cobalt-soft text-white hover:bg-brand-cobalt"
              >
                Send prompt
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
