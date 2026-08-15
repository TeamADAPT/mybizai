"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type CellId = string;

type MatrixCell = {
  id: CellId;
  signal: string;
  agency: string;
  saas: string;
  mybizai: string;
  deepened?: string;
};

const initialMatrix: MatrixCell[] = [
  {
    id: "execution",
    signal: "Execution",
    agency: "Human team",
    saas: "Self-serve tools",
    mybizai: "ADAPT agents",
  },
  {
    id: "touch",
    signal: "Personal touch",
    agency: "High",
    saas: "Low",
    mybizai: "Designed-in",
  },
  {
    id: "speed",
    signal: "Speed to plan",
    agency: "Weeks",
    saas: "Days",
    mybizai: "Hours",
  },
  {
    id: "gate",
    signal: "Approval gate",
    agency: "Email threads",
    saas: "None",
    mybizai: "Shell Approve",
  },
  {
    id: "cost",
    signal: "Cost shape",
    agency: "Retainer",
    saas: "Seat license",
    mybizai: "Private access + agents",
  },
];

const deepenCopy: Record<string, string> = {
  execution:
    "Operators buy outcomes. ADAPT’s edge is drafting + running under an Approve gate — not more dashboards.",
  touch:
    "Fifth Avenue tone is the differentiator vs cold SaaS. Keep gold for emphasis only; orange for action.",
  speed:
    "Whitespace opens when plan-to-campaign is same-day. Tie research cells into campaign briefs.",
  gate:
    "No spend without operator Approve. Document this in plan ops and campaign builder.",
  cost:
    "Price as private access tiers (Access / Architect / Fifth Avenue), not seat sprawl.",
};

export function ResearchBuilder({ lang }: { lang: string }) {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [activeId, setActiveId] = useState(initialMatrix[0]!.id);
  const [notes, setNotes] = useState(
    "Coastal SMB logistics — whitespace between agency retainers and generic SaaS.",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = matrix.find((c) => c.id === activeId) ?? matrix[0]!;
  const deepenedCount = useMemo(
    () => matrix.filter((c) => c.deepened).length,
    [matrix],
  );

  function deepenCell() {
    startTransition(() => {
      const text = deepenCopy[activeId] ?? "Deepen with ADAPT citations next.";
      setMatrix((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, deepened: text } : c,
        ),
      );
      setStatus(`Deepened · ${active.signal}`);
    });
  }

  function sendToPlan() {
    startTransition(() => {
      setStatus(
        `Queued for plan · ${deepenedCount}/${matrix.length} cells ready for market section`,
      );
    });
  }

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Research · Interactive"
      title="Market research"
      lead="Tap a competitive cell, deepen it with ADAPT notes, then push signal into the plan — decisions, not dashboards."
      shellModule="research"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card/80 dark:bg-brand-ink/40">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Signal
                  </th>
                  <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                    Agency
                  </th>
                  <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                    SaaS
                  </th>
                  <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                    MyBizAI
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.id === activeId
                        ? "border-b border-border bg-brand-orange/10"
                        : "border-b border-border/70 hover:bg-muted/40"
                    }
                  >
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="font-medium text-left hover:text-brand-orange"
                        onClick={() => {
                          setActiveId(row.id);
                          setStatus(null);
                        }}
                      >
                        {row.signal}
                        {row.deepened ? (
                          <span className="ml-2 font-mono text-[9px] uppercase text-brand-orange">
                            deep
                          </span>
                        ) : null}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.agency}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.saas}
                    </td>
                    <td className="px-3 py-2 text-foreground">{row.mybizai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="block space-y-2 rounded-2xl border border-border bg-card/80 p-4 dark:bg-brand-ink/40">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Operator notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none ring-brand-orange focus:ring-2"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Cells
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                {matrix.length}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Deepened
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                {deepenedCount}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Focus
              </p>
              <p className="mt-1 font-display text-lg tracking-tight">
                {active.signal}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
              Selected · {active.signal}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Agency: {active.agency} · SaaS: {active.saas} · MyBizAI:{" "}
              {active.mybizai}
            </p>
            {active.deepened ? (
              <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm animate-fade-up">
                {active.deepened}
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Not deepened yet — generate an ADAPT note for this cell.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                onClick={deepenCell}
                disabled={pending}
              >
                Deepen cell
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                onClick={sendToPlan}
                disabled={pending || deepenedCount === 0}
              >
                <Icons.Check className="mr-2 h-4 w-4" />
                Send to plan
              </Button>
              <Link href={`/${lang}/plan`}>
                <Button variant="ghost" className="rounded-full">
                  Open plan
                </Button>
              </Link>
              <Link href={`/${lang}/campaigns`}>
                <Button variant="ghost" className="rounded-full">
                  Campaigns
                </Button>
              </Link>
            </div>
            {status ? (
              <p className="mt-4 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
                {status}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </StudioBuilderChrome>
  );
}
