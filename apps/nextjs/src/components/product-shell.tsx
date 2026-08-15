"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import { TextGenerateEffect } from "@saasfly/ui/text-generate-effect";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { ThemeSwitch } from "~/components/theme-switch";
import { VoiceAgent } from "~/components/voice-agent";
import { brand } from "~/config/brand";

const modules = [
  { id: "dashboard", label: "Dashboard" },
  { id: "businesses", label: "My Businesses" },
  { id: "research", label: "Market Research" },
  { id: "brand", label: "Brand Identity" },
  { id: "marketing", label: "Marketing Plan" },
  { id: "finance", label: "Financial Projections" },
] as const;

type ModuleId = (typeof modules)[number]["id"];

const studioRoutes: Partial<Record<ModuleId, string>> = {
  research: "research",
  brand: "brand-kit",
  marketing: "campaigns",
  finance: "finance",
  businesses: "plan",
};

type Canvas = {
  title: string;
  lead: string;
  metrics: { label: string; value: string }[];
  bullets: string[];
  prompt: string;
};

const canvases: Record<ModuleId, Canvas> = {
  dashboard: {
    title: "Autonomous logistics overview",
    lead: "Live status across agents, approvals, and revenue loops.",
    metrics: [
      { label: "Awaiting approval", value: "3" },
      { label: "Agents running", value: "12" },
      { label: "ARR delta", value: "+2.4%" },
    ],
    bullets: [
      "Assist dock queued · logistics campaign brief",
      "2 agents need guidance on inventory routing",
      "Private-access pipeline healthy",
    ],
    prompt: "Summarize what needs my approval before end of day.",
  },
  businesses: {
    title: "Businesses in flight",
    lead: "Each venture gets its own ADAPT stack — shared intelligence, separate execution.",
    metrics: [
      { label: "Active", value: "2" },
      { label: "Ready", value: "1" },
      { label: "Paused", value: "0" },
    ],
    bullets: [
      "Fifth Avenue demo · Brand kit ready",
      "Logistics pilot · Ops agents active",
      "Archive / pause without losing history",
    ],
    prompt: "Spin up a third venture focused on boutique hospitality.",
  },
  research: {
    title: "Market research",
    lead: "Competitive maps and demand signals, distilled for decision — not dashboards for their own sake.",
    metrics: [
      { label: "Segments", value: "8" },
      { label: "Whitespace", value: "3" },
      { label: "Confidence", value: "High" },
    ],
    bullets: [
      "Segment heat · coastal SMB logistics",
      "Competitor whitespace · agency vs SaaS",
      "Prompt to deepen any cell",
    ],
    prompt: "Deepen competitor whitespace for agency vs SaaS.",
  },
  brand: {
    title: "Brand identity kit",
    lead: "Cobalt, orange, gold — locked tokens with consistency checks.",
    metrics: [
      { label: "Primary", value: "#120a8f" },
      { label: "Action", value: "#ff8c00" },
      { label: "Emphasis", value: "#d4af37" },
    ],
    bullets: [
      "Instrument Serif display · Manrope UI",
      "Gold emphasis only — never primary fill",
      "Export kit when the system feels locked",
    ],
    prompt: "Check brand voice against Fifth Avenue hospitality tone.",
  },
  marketing: {
    title: "Campaign architect",
    lead: "Multi-channel plans that execute after you approve the brief.",
    metrics: [
      { label: "Channels", value: "3" },
      { label: "Budget", value: "$12k" },
      { label: "Status", value: "Draft" },
    ],
    bullets: [
      "Private-access launch sequence",
      "LinkedIn + email + landing sync",
      "Budget reallocation via prompt",
    ],
    prompt: "Increase social ad budget 20% and re-run the logistics campaign.",
  },
  finance: {
    title: "Financial projections",
    lead: "Scenario runs with intervention points — you stay above the math.",
    metrics: [
      { label: "Runway", value: "14 mo" },
      { label: "Burn", value: "$48k" },
      { label: "Scenario", value: "Base" },
    ],
    bullets: [
      "Base / stretch / conservative",
      "Cash runway with agent cost lines",
      "Export for investors when ready",
    ],
    prompt: "Show stretch scenario with agent costs +15%.",
  },
};

const moduleIds = modules.map((m) => m.id);

function resolveModule(id?: string | null): ModuleId {
  if (id && (moduleIds as readonly string[]).includes(id)) {
    return id as ModuleId;
  }
  return "brand";
}

export function ProductShell({
  lang,
  initialModule,
}: {
  lang: string;
  initialModule?: string | null;
}) {
  const start = resolveModule(initialModule);
  const [active, setActive] = useState<ModuleId>(start);
  const [status, setStatus] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(canvases[start].prompt);
  const [pending, startTransition] = useTransition();
  const canvas = canvases[active];

  function selectModule(id: ModuleId) {
    setActive(id);
    setPrompt(canvases[id].prompt);
    setStatus(null);
  }

  function approvePlan() {
    startTransition(() => {
      setStatus(`Approved · ${canvas.title} queued for ADAPT execute.`);
    });
  }

  function sendPrompt() {
    startTransition(() => {
      setStatus(`Prompt sent · “${prompt.slice(0, 72)}${prompt.length > 72 ? "…" : ""}”`);
    });
  }

  return (
    <div className="min-h-[85vh] overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-xl shadow-brand-cobalt/10 dark:bg-brand-midnight/80 dark:shadow-2xl dark:shadow-brand-cobalt/20">
      <div className="flex min-h-[85vh] flex-col md:flex-row">
        <aside className="flex w-full flex-col border-b border-border bg-muted/30 md:w-60 md:border-b-0 md:border-r dark:bg-transparent">
          <div className="flex items-center gap-2 border-b border-border px-4 py-4">
            <BrandLogo href={`/${lang}`} size="sm" showWordmark />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 py-3 md:flex-col md:overflow-visible">
            {modules.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => selectModule(mod.id)}
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
            Interactive · product shell
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

            <div className="grid gap-3 sm:grid-cols-3">
              {canvas.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-brand-gold/20 bg-card/90 p-4 dark:bg-brand-ink/50"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                    {m.label}
                  </p>
                  <p className="mt-2 font-display text-3xl tracking-tight">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

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

            {status ? (
              <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange">
                {status}
              </p>
            ) : null}

            {active === "dashboard" ? <VoiceAgent compact /> : null}

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                onClick={approvePlan}
                disabled={pending}
              >
                Approve plan
              </Button>
              {studioRoutes[active] ? (
                <Button
                  variant="outline"
                  className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                  asChild
                >
                  <Link href={`/${lang}/${studioRoutes[active]}`}>
                    Open studio
                  </Link>
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                asChild
              >
                <Link href={`/${lang}/voice`}>Voice agent</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                asChild
              >
                <Link href={`/${lang}/brand-kit`}>Open brand kit</Link>
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                asChild
              >
                <Link href={`/${lang}/design`}>Design tokens</Link>
              </Button>
            </div>
          </main>

          <footer className="border-t border-border bg-brand-ink/80 px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                  AI assist dock
                </p>
                <TextGenerateEffect
                  key={active}
                  words={canvas.prompt}
                  className="!mt-0 text-left text-sm font-normal"
                />
                <label className="sr-only" htmlFor="assist-prompt">
                  Prompt
                </label>
                <input
                  id="assist-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-full border border-border bg-background/60 px-4 py-2 text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <Button
                size="sm"
                className="shrink-0 rounded-full bg-brand-cobalt-soft text-white hover:bg-brand-cobalt"
                onClick={sendPrompt}
                disabled={pending || !prompt.trim()}
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
