"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";
import { useVentureLoop } from "~/hooks/use-venture-loop";

type SectionStatus = "draft" | "needs_you" | "approved";

type Section = {
  id: string;
  title: string;
  body: string;
  suggestion: string;
  status: SectionStatus;
};

const baseSections: Section[] = [
  {
    id: "vision",
    title: "Vision",
    body: "Fifth Avenue agency gravity distilled into an autonomous platform — personal touch, ADAPT execution.",
    suggestion:
      "Lead with “private access” and operator-above-agents language; avoid generic SaaS feature lists.",
    status: "approved",
  },
  {
    id: "market",
    title: "Market analysis",
    body: "Whitespace between agency retainers and generic SaaS for coastal SMB logistics operators.",
    suggestion:
      "Cite the research studio matrix: Execution · Personal touch · Speed · Approval gate.",
    status: "needs_you",
  },
  {
    id: "gtm",
    title: "Go-to-market",
    body: "Warm list → gold-border invite → shell preview. LinkedIn + email + landing share one brand kit.",
    suggestion:
      "Pull channel budgets from the campaign builder once the brief is approved.",
    status: "draft",
  },
  {
    id: "ops",
    title: "Operations",
    body: "One cobalt workspace per venture. Agents draft; operators approve before spend or publish.",
    suggestion:
      "Name the assist-dock as the intervention surface — never bury overrides.",
    status: "draft",
  },
  {
    id: "finance",
    title: "Financial narrative",
    body: "Base runway with controlled agent cost lines; stretch only for investor conversations.",
    suggestion:
      "Sync numbers from the finance builder scenario that matches this plan’s risk posture.",
    status: "needs_you",
  },
];

const statusLabel: Record<SectionStatus, string> = {
  draft: "Draft",
  needs_you: "Needs you",
  approved: "Approved",
};

export function PlanBuilder({ lang }: { lang: string }) {
  const { planVision, setPlanVision, lastEvent, runAssist, assistPending } =
    useVentureLoop();
  const [sections, setSections] = useState(baseSections);
  const [activeId, setActiveId] = useState(baseSections[1]!.id);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === "vision"
          ? {
              ...section,
              body: planVision,
              status:
                section.status === "approved" ? "needs_you" : section.status,
            }
          : section,
      ),
    );
  }, [planVision]);

  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const active = sections[activeIndex] ?? sections[0]!;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < sections.length - 1 && activeIndex >= 0;

  const approvedSections = useMemo(
    () => sections.filter((s) => s.status === "approved"),
    [sections],
  );
  const remainingSections = useMemo(
    () => sections.filter((s) => s.status !== "approved"),
    [sections],
  );
  const progress = useMemo(() => {
    return Math.round((approvedSections.length / sections.length) * 100);
  }, [approvedSections.length, sections.length]);

  function goToSection(id: string, note?: string) {
    setActiveId(id);
    setStatus(note ?? null);
  }

  function goPrev() {
    if (!canGoPrev) return;
    const prev = sections[activeIndex - 1];
    if (prev) goToSection(prev.id);
  }

  function goNext() {
    if (!canGoNext) return;
    const next = sections[activeIndex + 1];
    if (next) goToSection(next.id);
  }

  function updateBody(value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
              ...s,
              body: value,
              status: s.status === "approved" ? "needs_you" : s.status,
            }
          : s,
      ),
    );
    if (activeId === "vision") {
      setPlanVision(value);
    }
  }

  function applySuggestion() {
    startTransition(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                body: `${s.body.trim()}\n\nADAPT note: ${s.suggestion}`,
                status: "needs_you",
              }
            : s,
        ),
      );
      setStatus(`Suggestion applied · ${active.title}`);
    });
  }

  function approveSection() {
    startTransition(() => {
      const updated = sections.map((s) =>
        s.id === activeId ? { ...s, status: "approved" as const } : s,
      );
      setSections(updated);
      if (activeId === "vision") {
        setPlanVision(active.body);
      }

      const fromIndex = updated.findIndex((s) => s.id === activeId);
      const nextOpen =
        updated.find(
          (s, index) => index > fromIndex && s.status !== "approved",
        ) ?? updated.find((s) => s.status !== "approved");

      if (nextOpen) {
        setActiveId(nextOpen.id);
        setStatus(
          `Approved · ${active.title} · advancing to ${nextOpen.title}`,
        );
      } else {
        setStatus("Approved · every section locked — ready for venture handoff");
      }
    });
  }

  function generateSection() {
    startTransition(() => {
      void (async () => {
        const draft = await runAssist(
          "plan.deepen",
          `${active.title}: ${active.body}`,
        );
        setSections((prev) =>
          prev.map((s) =>
            s.id === activeId
              ? {
                  ...s,
                  body: `${s.body.trim()}\n\n${draft}`,
                  status: "needs_you",
                }
              : s,
          ),
        );
        setStatus(`Generated · ${active.title} awaits your edit`);
      })();
    });
  }

  const banner = status ?? lastEvent;

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Plan · Interactive"
      title="Business plan editor"
      lead="ADAPT drafts each section. You edit, apply suggestions, and approve before anything becomes a venture. Vision stays synced with Ideas."
      shellModule="businesses"
    >
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_240px]">
        <aside className="space-y-1 rounded-2xl border border-border bg-card/80 p-3 dark:bg-brand-ink/40">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Sections
          </p>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => goToSection(section.id)}
              className={
                section.id === activeId
                  ? "flex w-full items-center justify-between rounded-lg bg-brand-orange/15 px-3 py-2 text-left text-sm font-medium text-brand-orange"
                  : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }
            >
              <span>{section.title}</span>
              <span className="font-mono text-[9px] uppercase tracking-wider opacity-80">
                {statusLabel[section.status]}
              </span>
            </button>
          ))}
        </aside>

        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Section {activeIndex + 1} of {sections.length}
              </p>
              <h2 className="font-display text-2xl tracking-tight">
                {active.title}
              </h2>
            </div>
            <span className="rounded-full border border-brand-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              {statusLabel[active.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={goPrev}
              disabled={!canGoPrev}
            >
              <Icons.ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={goNext}
              disabled={!canGoNext}
            >
              Next
              <Icons.ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Operator narrative</span>
            <textarea
              value={active.body}
              onChange={(e) => updateBody(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm leading-relaxed outline-none ring-brand-orange focus:ring-2"
            />
          </label>

          <div className="rounded-xl border border-dashed border-brand-gold/35 bg-muted/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
              ADAPT suggestion
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {active.suggestion}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="mt-3 h-8 rounded-full px-3 text-brand-gold"
              onClick={applySuggestion}
              disabled={pending}
            >
              Use this suggestion
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              onClick={approveSection}
              disabled={pending || active.status === "approved"}
            >
              <Icons.Check className="mr-2 h-4 w-4" />
              Approve section
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              onClick={generateSection}
              disabled={pending || assistPending}
            >
              {assistPending ? "Drafting…" : "Generate deepen"}
            </Button>
            <Link href={`/${lang}/ventures`}>
              <Button variant="ghost" className="rounded-full">
                Hand off to ventures
              </Button>
            </Link>
            <Link href={`/${lang}/research`}>
              <Button variant="ghost" className="rounded-full">
                Open research
              </Button>
            </Link>
          </div>

          {banner ? (
            <p className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
              {banner}
            </p>
          ) : null}
        </div>

        <aside className="space-y-5 rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Plan progress
            </p>
            <p className="mt-2 font-display text-3xl tracking-tight text-brand-orange">
              {progress}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-orange transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-3 py-2 text-left transition-colors hover:border-brand-orange/60"
                onClick={() => {
                  const target = approvedSections[0];
                  if (target) {
                    goToSection(
                      target.id,
                      `Jump · approved · ${target.title}`,
                    );
                  }
                }}
                disabled={approvedSections.length === 0}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-brand-orange">
                  Done
                </p>
                <p className="text-sm font-medium text-foreground">
                  {approvedSections.length}
                </p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-left transition-colors hover:border-brand-gold/50"
                onClick={() => {
                  const target = remainingSections[0];
                  if (target) {
                    goToSection(
                      target.id,
                      `Jump · remaining · ${target.title}`,
                    );
                  }
                }}
                disabled={remainingSections.length === 0}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Left
                </p>
                <p className="text-sm font-medium text-foreground">
                  {remainingSections.length}
                </p>
              </button>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Checklist
            </p>
            <ul className="mt-3 space-y-1">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                const isDone = section.status === "approved";
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() =>
                        goToSection(
                          section.id,
                          `Opened · ${section.title} · ${statusLabel[section.status]}`,
                        )
                      }
                      className={
                        isActive
                          ? "flex w-full items-start gap-2 rounded-lg bg-brand-orange/15 px-2 py-2 text-left text-sm text-brand-orange"
                          : "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                      }
                    >
                      <Icons.Check
                        className={
                          isDone
                            ? "mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
                            : "mt-0.5 h-4 w-4 shrink-0 text-border"
                        }
                      />
                      <span className={isDone ? "text-foreground" : undefined}>
                        {section.title}
                        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider opacity-70">
                          {statusLabel[section.status]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <Link href={`/${lang}/ventures`}>
            <Button
              variant="outline"
              className="w-full rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              Create venture from plan
            </Button>
          </Link>
        </aside>
      </div>
    </StudioBuilderChrome>
  );
}
