"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";
import {
  type LoopVentureStatus,
  useVentureLoop,
} from "~/hooks/use-venture-loop";

const statusStyles: Record<LoopVentureStatus, string> = {
  active: "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
  ready: "border-brand-gold/40 bg-brand-gold/10 text-brand-gold",
  paused: "border-border bg-muted/40 text-muted-foreground",
  archived: "border-border bg-muted/20 text-muted-foreground",
};

export function VenturesBuilder({ lang }: { lang: string }) {
  const {
    ventures,
    ideas,
    planVision,
    lastEvent,
    createVenture,
    setVentureStatus,
    approveVenture,
    runAssist,
    assistPending,
  } = useVentureLoop();
  const keptIdea = ideas.find((idea) => idea.kept);
  const [name, setName] = useState(keptIdea?.title ?? "");
  const [industry, setIndustry] = useState(keptIdea?.industry ?? "Hospitality");
  const [note, setNote] = useState(
    planVision
      ? `Seeded from plan vision · ${planVision.slice(0, 96)}`
      : "Seeded from Ideas · ADAPT will draft plan after you approve.",
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

  const counts = useMemo(
    () => ({
      active: ventures.filter((v) => v.status === "active").length,
      ready: ventures.filter((v) => v.status === "ready").length,
      paused: ventures.filter((v) => v.status === "paused").length,
      archived: ventures.filter((v) => v.status === "archived").length,
    }),
    [ventures],
  );

  function onCreate() {
    startTransition(() => {
      void (async () => {
        await runAssist("ventures.create", name || planVision);
        const created = createVenture({
          name,
          industry,
          note,
          seededFromIdeaId: keptIdea?.id,
        });
        if (created) {
          setName("");
          setStatus(`Created · “${created.name}” ready for plan handoff`);
        } else {
          setStatus(lastEvent);
        }
      })();
    });
  }

  const banner = status ?? lastEvent;

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Ventures · Interactive"
      title="Ventures"
      lead="Empty → create → archive. Shared with Ideas and Plan — the LLM will write into this same loop."
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
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((venture) => (
                <article
                  key={venture.id}
                  className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40"
                >
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    {venture.status !== "archived" ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                          onClick={() => {
                            startTransition(() => {
                              approveVenture(venture.id);
                              setStatus(null);
                            });
                          }}
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
                  </div>
                </article>
              ))}
            </div>
          )}

          {banner ? (
            <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
              {banner}
            </p>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-brand-gold/30 bg-card/80 p-5 dark:bg-brand-ink/50">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Create venture
            </p>
            {keptIdea ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Prefills from kept idea · {keptIdea.title}
              </p>
            ) : null}
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
              onClick={onCreate}
              disabled={pending || assistPending}
            >
              <Icons.Add className="mr-2 h-4 w-4" />
              {assistPending ? "Drafting…" : "New venture"}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-5 dark:bg-brand-ink/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Shared loop
            </p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-4">
              {planVision}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${lang}/ideas`}
                className="text-sm text-brand-orange hover:underline"
              >
                Back to ideas
              </Link>
              <Link
                href={`/${lang}/shell?module=businesses`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Open ventures in shell
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </StudioBuilderChrome>
  );
}
