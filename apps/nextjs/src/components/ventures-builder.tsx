"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type VentureStatus = "active" | "ready" | "paused" | "archived";

type Venture = {
  id: string;
  name: string;
  industry: string;
  status: VentureStatus;
  note: string;
  createdAt: string;
};

const seedVentures: Venture[] = [
  {
    id: "v1",
    name: "Fifth Avenue demo",
    industry: "Professional services",
    status: "ready",
    note: "Brand kit locked · plan approved · waiting on campaign spend gate",
    createdAt: "2026-08-10",
  },
  {
    id: "v2",
    name: "Coastal logistics pilot",
    industry: "Logistics",
    status: "active",
    note: "Research deepen complete · finance base scenario green",
    createdAt: "2026-08-12",
  },
];

const statusStyles: Record<VentureStatus, string> = {
  active: "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
  ready: "border-brand-gold/40 bg-brand-gold/10 text-brand-gold",
  paused: "border-border bg-muted/40 text-muted-foreground",
  archived: "border-border bg-muted/20 text-muted-foreground",
};

export function VenturesBuilder({ lang }: { lang: string }) {
  const [ventures, setVentures] = useState<Venture[]>(seedVentures);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Hospitality");
  const [note, setNote] = useState(
    "Seeded from Ideas · ADAPT will draft plan after you approve.",
  );
  const [showArchived, setShowArchived] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      ventures.filter((venture) =>
        showArchived
          ? venture.status === "archived"
          : venture.status !== "archived",
      ),
    [showArchived, ventures],
  );

  const counts = useMemo(() => {
    return {
      active: ventures.filter((v) => v.status === "active").length,
      ready: ventures.filter((v) => v.status === "ready").length,
      paused: ventures.filter((v) => v.status === "paused").length,
      archived: ventures.filter((v) => v.status === "archived").length,
    };
  }, [ventures]);

  function createVenture() {
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus("Name your venture before creating a workspace.");
      return;
    }
    startTransition(() => {
      const next: Venture = {
        id: `v-${Date.now()}`,
        name: trimmed,
        industry: industry.trim() || "General",
        status: "ready",
        note: note.trim() || "New venture workspace ready for ADAPT.",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setVentures((prev) => [next, ...prev]);
      setName("");
      setStatus(`Created · “${next.name}” ready for plan handoff`);
    });
  }

  function setVentureStatus(id: string, next: VentureStatus) {
    startTransition(() => {
      setVentures((prev) =>
        prev.map((venture) =>
          venture.id === id ? { ...venture, status: next } : venture,
        ),
      );
      const label =
        next === "archived"
          ? "Archived"
          : next === "active"
            ? "Activated"
            : next === "paused"
              ? "Paused"
              : "Marked ready";
      setStatus(`${label} · venture updated`);
    });
  }

  function approveHandoff(venture: Venture) {
    startTransition(() => {
      setVentures((prev) =>
        prev.map((item) =>
          item.id === venture.id ? { ...item, status: "active" } : item,
        ),
      );
      setStatus(
        `Approved · “${venture.name}” queued for ADAPT execute in the shell`,
      );
    });
  }

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Ventures · Interactive"
      title="Ventures"
      lead="Empty → create → archive. Each venture is its own ADAPT stack — shared intelligence, separate execution."
      shellModule="businesses"
    >
      <div className="grid gap-4 sm:grid-cols-4">
        {(
          [
            ["Active", counts.active],
            ["Ready", counts.ready],
            ["Paused", counts.paused],
            ["Archived", counts.archived],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              {showArchived ? "Archive" : "Live ventures"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-brand-gold/40 text-brand-gold"
              onClick={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? "Show live" : "Show archived"}
            </Button>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-gold/35 bg-card/50 px-6 py-12 text-center dark:bg-brand-ink/30">
              <p className="font-display text-2xl tracking-tight">
                {showArchived ? "Archive is empty" : "No ventures yet"}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {showArchived
                  ? "Archived workspaces will land here — history stays recoverable."
                  : "Start a business workspace and let ADAPT co-architect the plan."}
              </p>
              {!showArchived ? (
                <p className="mt-4 text-xs text-brand-gold">
                  Use the create panel → name it → Approve when the loop is ready.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((venture) => (
                <article
                  key={venture.id}
                  className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl tracking-tight">
                          {venture.name}
                        </h2>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${statusStyles[venture.status]}`}
                        >
                          {venture.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {venture.industry} · opened {venture.createdAt}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {venture.note}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {venture.status !== "archived" ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                          onClick={() => approveHandoff(venture)}
                          disabled={pending}
                        >
                          Approve for shell
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() =>
                            setVentureStatus(
                              venture.id,
                              venture.status === "paused" ? "ready" : "paused",
                            )
                          }
                          disabled={pending}
                        >
                          {venture.status === "paused" ? "Resume" : "Pause"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-muted-foreground"
                          onClick={() =>
                            setVentureStatus(venture.id, "archived")
                          }
                          disabled={pending}
                        >
                          Archive
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full border-brand-gold/50 text-brand-gold"
                        onClick={() => setVentureStatus(venture.id, "ready")}
                        disabled={pending}
                      >
                        Restore
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full border-brand-gold/40 text-brand-gold"
                      asChild
                    >
                      <Link href={`/${lang}/plan`}>Open plan</Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      asChild
                    >
                      <Link href={`/${lang}/ideas`}>From ideas</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {status ? (
            <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
              {status}
            </p>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-brand-gold/30 bg-card/80 p-5 dark:bg-brand-ink/50">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Create venture
            </p>
            <label className="mt-4 block space-y-2">
              <span className="text-xs text-muted-foreground">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Boutique hospitality OS"
                className="w-full rounded-full border border-border bg-background/80 px-4 py-2 text-sm outline-none ring-brand-orange focus:ring-2"
              />
            </label>
            <label className="mt-3 block space-y-2">
              <span className="text-xs text-muted-foreground">Industry</span>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-full border border-border bg-background/80 px-4 py-2 text-sm outline-none ring-brand-orange focus:ring-2"
              />
            </label>
            <label className="mt-3 block space-y-2">
              <span className="text-xs text-muted-foreground">Handoff note</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none ring-brand-orange focus:ring-2"
              />
            </label>
            <Button
              type="button"
              className="mt-4 w-full rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              onClick={createVenture}
              disabled={pending}
            >
              <Icons.Add className="mr-2 h-4 w-4" />
              New venture
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-5 dark:bg-brand-ink/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Core loop
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Ideas → Research → Plan</li>
              <li>Brand → Campaigns → Finance</li>
              <li>Approve in Shell → Venture</li>
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${lang}/shell?module=businesses`}
                className="text-sm text-brand-orange hover:underline"
              >
                Open ventures in shell
              </Link>
              <Link
                href={`/${lang}/onboarding`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                First-run checklist
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </StudioBuilderChrome>
  );
}
