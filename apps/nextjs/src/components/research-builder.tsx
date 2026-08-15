"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";
import { useVentureLoop } from "~/hooks/use-venture-loop";

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
  const {
    research,
    lastEvent,
    pushResearchToPlan,
    runAssist,
    assistPending,
  } = useVentureLoop();
  const [matrix, setMatrix] = useState(() =>
    initialMatrix.map((cell) =>
      research.deepenedSignals.includes(cell.signal)
        ? {
            ...cell,
            deepened:
              deepenCopy[cell.id] ??
              "Deepen with ADAPT citations next.",
          }
        : cell,
    ),
  );
  const [activeId, setActiveId] = useState(initialMatrix[0]!.id);
  const [notes, setNotes] = useState(research.notes);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = matrix.find((c) => c.id === activeId) ?? matrix[0]!;
  const deepenedCount = useMemo(
    () => matrix.filter((c) => c.deepened).length,
    [matrix],
  );

  function deepenCell() {
    startTransition(() => {
      void (async () => {
        const fallback =
          deepenCopy[activeId] ?? "Deepen with ADAPT citations next.";
        const draft = await runAssist(
          "research.deepen",
          `${active.signal}: agency=${active.agency}; saas=${active.saas}; mybizai=${active.mybizai}. Notes: ${notes}`,
        );
        const text = draft.trim() || fallback;
        setMatrix((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, deepened: text } : c,
          ),
        );
        setStatus(`Deepened · ${active.signal}`);
      })();
    });
  }

  function sendToPlan() {
    startTransition(() => {
      const deepenedSignals = matrix
        .filter((c) => c.deepened)
        .map((c) => c.signal);
      pushResearchToPlan({ notes, deepenedSignals });
      setStatus(
        `Queued for plan · ${deepenedSignals.length}/${matrix.length} cells ready for market section`,
      );
    });
  }

  const banner = status ?? lastEvent;

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
            <table className="w-full min-w-[36rem] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 pb-3.5 pt-5 font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-muted-foreground dark:bg-brand-ink/95">
                    Signal
                  </th>
                  <th className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 pb-3.5 pt-5 font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-brand-gold dark:bg-brand-ink/95">
                    Agency
                  </th>
                  <th className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 pb-3.5 pt-5 font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-brand-gold dark:bg-brand-ink/95">
                    SaaS
                  </th>
                  <th className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 pb-3.5 pt-5 font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-brand-gold dark:bg-brand-ink/95">
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
                        ? "bg-brand-orange/10"
                        : "hover:bg-muted/40"
                    }
                  >
                    <td className="border-b border-border/70 px-4 py-3.5">
                      <button
                        type="button"
                        className="text-left font-medium hover:text-brand-orange"
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
                    <td className="border-b border-border/70 px-4 py-3.5 text-muted-foreground">
                      {row.agency}
                    </td>
                    <td className="border-b border-border/70 px-4 py-3.5 text-muted-foreground">
                      {row.saas}
                    </td>
                    <td className="border-b border-border/70 px-4 py-3.5 text-foreground">
                      {row.mybizai}
                    </td>
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
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 px-4 pb-4 pt-5 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-muted-foreground">
                Cells
              </p>
              <p className="mt-2.5 font-display text-3xl leading-none text-brand-orange">
                {matrix.length}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 px-4 pb-4 pt-5 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-muted-foreground">
                Deepened
              </p>
              <p className="mt-2.5 font-display text-3xl leading-none text-brand-orange">
                {deepenedCount}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 px-4 pb-4 pt-5 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase leading-normal tracking-[0.14em] text-muted-foreground">
                Focus
              </p>
              <p className="mt-2.5 font-display text-lg leading-snug tracking-tight">
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
                disabled={pending || assistPending}
              >
                {assistPending ? "Deepening…" : "Deepen cell"}
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
            {banner ? (
              <p className="mt-4 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
                {banner}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </StudioBuilderChrome>
  );
}
