"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

type ChannelId = "linkedin" | "email" | "landing";

type Channel = {
  id: ChannelId;
  label: string;
  enabled: boolean;
  spend: number;
  note: string;
};

const initialChannels: Channel[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    enabled: true,
    spend: 4500,
    note: "Operator warm intros · Fifth Avenue tone",
  },
  {
    id: "email",
    label: "Email",
    enabled: true,
    spend: 2800,
    note: "Gold-border private-access sequence",
  },
  {
    id: "landing",
    label: "Landing",
    enabled: true,
    spend: 4700,
    note: "Shell preview CTA · brand-kit locked",
  },
];

export function CampaignBuilder({ lang }: { lang: string }) {
  const [channels, setChannels] = useState(initialChannels);
  const [brief, setBrief] = useState(
    "Private-access launch for logistics operators — personal touch, approve-before-spend.",
  );
  const [approved, setApproved] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const total = useMemo(
    () =>
      channels
        .filter((c) => c.enabled)
        .reduce((sum, c) => sum + c.spend, 0),
    [channels],
  );

  const activeCount = channels.filter((c) => c.enabled).length;

  function toggleChannel(id: ChannelId) {
    setApproved(false);
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  }

  function setSpend(id: ChannelId, spend: number) {
    setApproved(false);
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, spend: Math.max(0, Math.min(50000, spend)) } : c,
      ),
    );
  }

  function bumpSocial(pct: number) {
    startTransition(() => {
      setApproved(false);
      setChannels((prev) =>
        prev.map((c) =>
          c.id === "linkedin"
            ? { ...c, spend: Math.round(c.spend * (1 + pct / 100)) }
            : c,
        ),
      );
      setStatus(`Budget updated · LinkedIn +${pct}%`);
    });
  }

  function approveBrief() {
    startTransition(() => {
      setApproved(true);
      setStatus(
        `Approved · $${total.toLocaleString()} across ${activeCount} channels — ADAPT may execute`,
      );
    });
  }

  function runCampaign() {
    if (!approved) {
      setStatus("Blocked · approve the brief before any spend");
      return;
    }
    startTransition(() => {
      setStatus(
        `Queued · campaign running with brand-kit voice across ${activeCount} channels`,
      );
    });
  }

  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Campaigns · Interactive"
      title="Campaign architect"
      lead="Shape channels and budget. Nothing spends until you approve the brief — then ADAPT executes."
      shellModule="marketing"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40 md:p-6">
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              Campaign brief
            </span>
            <textarea
              value={brief}
              onChange={(e) => {
                setApproved(false);
                setBrief(e.target.value);
              }}
              rows={4}
              className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm leading-relaxed outline-none ring-brand-orange focus:ring-2"
            />
          </label>

          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Channels
            </p>
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="rounded-xl border border-border bg-background/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleChannel(channel.id)}
                    className={
                      channel.enabled
                        ? "rounded-full bg-brand-orange/15 px-3 py-1 text-sm font-medium text-brand-orange"
                        : "rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    }
                  >
                    {channel.enabled ? "On" : "Off"} · {channel.label}
                  </button>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={channel.spend}
                      disabled={!channel.enabled}
                      onChange={(e) =>
                        setSpend(channel.id, Number(e.target.value) || 0)
                      }
                      className="w-28 rounded-lg border border-border bg-background px-3 py-1.5 text-right outline-none ring-brand-orange focus:ring-2 disabled:opacity-40"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {channel.note}
                </p>
                {channel.enabled ? (
                  <input
                    type="range"
                    min={0}
                    max={12000}
                    step={100}
                    value={channel.spend}
                    onChange={(e) =>
                      setSpend(channel.id, Number(e.target.value))
                    }
                    className="mt-3 w-full accent-[hsl(var(--brand-orange))]"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Channels
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Budget
              </p>
              <p className="mt-1 font-display text-3xl text-brand-orange">
                ${total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gold/20 bg-card/80 p-4 dark:bg-brand-ink/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Gate
              </p>
              <p className="mt-1 font-display text-2xl tracking-tight">
                {approved ? "Approved" : "Draft"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-5 dark:bg-brand-ink/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
              Approval gate
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              ADAPT will not spend or publish until an operator approves this
              brief. Editing channels or budget resets the gate.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
                onClick={approveBrief}
                disabled={pending || activeCount === 0}
              >
                <Icons.Check className="mr-2 h-4 w-4" />
                Approve brief
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                onClick={runCampaign}
                disabled={pending}
              >
                Run campaign
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => bumpSocial(20)}
                disabled={pending}
              >
                LinkedIn +20%
              </Button>
            </div>
            {status ? (
              <p className="mt-4 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-orange animate-fade-up">
                {status}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/${lang}/brand-kit`}>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              >
                Brand kit
              </Button>
            </Link>
            <Link href={`/${lang}/plan`}>
              <Button variant="ghost" className="rounded-full">
                Business plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StudioBuilderChrome>
  );
}
