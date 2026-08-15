"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type ScenarioId = "base" | "stretch" | "conservative";

type Assumptions = {
  monthlyRevenue: number;
  marketingSpend: number;
  agentCost: number;
  cashOnHand: number;
};

const scenarioPresets: Record<
  ScenarioId,
  { label: string; note: string; mult: Assumptions }
> = {
  base: {
    label: "Base",
    note: "Default ops — controlled agent lines, private-access ARR ramp.",
    mult: {
      monthlyRevenue: 1,
      marketingSpend: 1,
      agentCost: 1,
      cashOnHand: 1,
    },
  },
  stretch: {
    label: "Stretch",
    note: "Investor story — marketing +20%, agent concurrency +15%.",
    mult: {
      monthlyRevenue: 1.18,
      marketingSpend: 1.2,
      agentCost: 1.15,
      cashOnHand: 0.95,
    },
  },
  conservative: {
    label: "Conservative",
    note: "Protect runway — freeze new ventures, keep research warm.",
    mult: {
      monthlyRevenue: 0.85,
      marketingSpend: 0.7,
      agentCost: 0.8,
      cashOnHand: 1.05,
    },
  },
};

const baseAssumptions: Assumptions = {
  monthlyRevenue: 62000,
  marketingSpend: 12000,
  agentCost: 18000,
  cashOnHand: 672000,
};

function money(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

export function FinanceBuilder({ lang }: { lang: string }) {
  const [scenario, setScenario] = useState<ScenarioId>("base");
  const [assumptions, setAssumptions] = useState(baseAssumptions);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const scaled = useMemo(() => {
    const m = scenarioPresets[scenario].mult;
    return {
      monthlyRevenue: assumptions.monthlyRevenue * m.monthlyRevenue,
      marketingSpend: assumptions.marketingSpend * m.marketingSpend,
      agentCost: assumptions.agentCost * m.agentCost,
      cashOnHand: assumptions.cashOnHand * m.cashOnHand,
    };
  }, [assumptions, scenario]);

  const burn =
    scaled.marketingSpend + scaled.agentCost + 18000; /* ops overhead */
  const net = scaled.monthlyRevenue - burn;
  const runway =
    burn <= 0 ? 99 : Math.max(0, Math.floor(scaled.cashOnHand / burn));
  const intervention = scaled.cashOnHand < burn * 6;

  const months = useMemo(() => {
    let cash = scaled.cashOnHand;
    return Array.from({ length: 6 }, (_, i) => {
      cash = cash + net;
      return {
        label: `M${i + 1}`,
        cash: Math.max(0, cash),
        below: cash < burn * 3,
      };
    });
  }, [scaled.cashOnHand, net, burn]);

  function setField(key: keyof Assumptions, value: number) {
    setAssumptions((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  }

  function applyAgentBump(pct: number) {
    startTransition(() => {
      setAssumptions((prev) => ({
        ...prev,
        agentCost: Math.round(prev.agentCost * (1 + pct / 100)),
      }));
      setScenario("stretch");
      setStatus(`Agent costs +${pct}% · switched to stretch for review`);
    });
  }

  function lockScenario() {
    startTransition(() => {
      setStatus(
        `Locked · ${scenarioPresets[scenario].label} scenario ready for plan finance narrative`,
      );
    });
  }

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Finance · Interactive"
      title="Financial projections"
      lead="Tune assumptions, flip scenarios, and watch runway plus intervention flags — you stay above the math."
      shellModule="finance"
    >
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Scenario
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {(Object.keys(scenarioPresets) as ScenarioId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setScenario(id);
                    setStatus(null);
                  }}
                  className={
                    scenario === id
                      ? "rounded-xl bg-brand-orange/15 px-3 py-2 text-left text-sm font-medium text-brand-orange"
                      : "rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/60"
                  }
                >
                  {scenarioPresets[id].label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {scenarioPresets[scenario].note}
            </p>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Assumptions
            </p>
            {(
              [
                ["monthlyRevenue", "Monthly revenue"],
                ["marketingSpend", "Marketing spend"],
                ["agentCost", "Agent costs"],
                ["cashOnHand", "Cash on hand"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block space-y-1 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <input
                  type="number"
                  value={assumptions[key]}
                  onChange={(e) => setField(key, Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none ring-brand-orange focus:ring-2"
                />
              </label>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Runway
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                {runway} mo
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Monthly burn
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                {money(burn)}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Net / mo
              </p>
              <p className="mt-1 font-display text-3xl tracking-tight">
                {money(net)}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Intervention
              </p>
              <p
                className={
                  intervention
                    ? "mt-1 font-display text-2xl text-brand-orange"
                    : "mt-1 font-display text-2xl"
                }
              >
                {intervention ? "Watch cash" : "Healthy"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Cash trajectory · 6 months
            </p>
            <div className="mt-4 flex h-40 items-end gap-2">
              {months.map((m) => {
                const maxCash = Math.max(...months.map((x) => x.cash), 1);
                const h = Math.max(12, Math.round((m.cash / maxCash) * 140));
                return (
                  <div
                    key={m.label}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className={
                        m.below
                          ? "w-full rounded-t-md bg-brand-orange transition-[height] duration-500"
                          : "w-full rounded-t-md bg-brand-cobalt-soft/70 transition-[height] duration-500 dark:bg-brand-orange/45"
                      }
                      style={{ height: `${h}px` }}
                      title={money(m.cash)}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {intervention ? (
              <p className="mt-4 text-sm text-brand-orange">
                Cash dips below the 6-month comfort band in this scenario —
                intervene before approving spend in campaigns.
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Cash stays above the intervention threshold for this scenario.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              onClick={lockScenario}
              disabled={pending}
            >
              <Icons.Check className="mr-2 h-4 w-4" />
              Lock scenario
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              onClick={() => applyAgentBump(15)}
              disabled={pending}
            >
              Agent costs +15%
            </Button>
            <Link href={`/${lang}/plan`}>
              <Button variant="ghost" className="rounded-full">
                Push to plan
              </Button>
            </Link>
            <Link href={`/${lang}/campaigns`}>
              <Button variant="ghost" className="rounded-full">
                Check campaigns
              </Button>
            </Link>
          </div>

          {status ? (
            <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </StudioBuilderChrome>
  );
}
