import React from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import type { Locale } from "~/config/i18n-config";
import { brand } from "~/config/brand";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
  title: "Workspace",
};

const overview = [
  {
    label: "Plans awaiting approval",
    value: "3",
    hint: "Review in the assist dock",
  },
  {
    label: "Agents running",
    value: "12",
    hint: "2 need guidance",
  },
  {
    label: "Weekly ARR delta",
    value: "+2.4%",
    hint: "Across active workspaces",
  },
];

const modules = [
  {
    title: "Brand Identity",
    href: "brand-kit",
    note: "Colors, type, logo, voice",
  },
  {
    title: "Market Research",
    href: "research",
    note: "Competitive whitespace + deepen prompts",
  },
  {
    title: "Campaigns",
    href: "campaigns",
    note: "Multi-channel briefs with Approve gate",
  },
  {
    title: "Financial Projections",
    href: "finance",
    note: "Base / stretch / conservative",
  },
  {
    title: "Academy",
    href: "academy",
    note: "Operator lessons tied to the playbook",
  },
  {
    title: "Onboarding",
    href: "onboarding",
    note: "First-run checklist after access",
  },
];

export default async function DashboardPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  // Do not server-redirect here — Clerk Development on Railway often
  // omits the server session while the client is signed in, which caused
  // a login↔dashboard flash loop. DashboardChrome gates access.
  const dict = await getDictionary(lang);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Overview"
        text={dict.common.dashboard.title_text}
      >
        <Link href={`/${lang}/shell`}>
          <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
            Open product shell
            <Icons.ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </DashboardHeader>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {overview.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-brand-gold/25 bg-card/80 p-5 dark:bg-brand-ink/40"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              {card.label}
            </p>
            <p className="mt-3 font-display text-4xl tracking-tight">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-brand-gold/30 bg-card/50 p-6 dark:bg-brand-ink/20">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-orange">
          Ventures
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">
          No ventures yet
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {dict.business.k8s.no_cluster_content}
        </p>
        <Link href={`/${lang}/onboarding`} className="mt-4 inline-block">
          <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
            Start first-run checklist
          </Button>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/70 p-6 dark:bg-card/40">
        <h2 className="font-display text-2xl tracking-tight">
          Welcome back{user.name ? `, ${user.name}` : ""}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {brand.mission} Jump into Brand kit, Research, or Finance — or
          continue approvals from the assist dock.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              href={`/${lang}/${mod.href}`}
              className="rounded-2xl border border-border bg-card/80 p-4 transition hover:border-brand-orange/50 dark:bg-brand-ink/30"
            >
              <p className="font-display text-lg tracking-tight">{mod.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{mod.note}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${lang}/brand-kit`}>
            <Button
              variant="outline"
              className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
            >
              Brand identity kit
            </Button>
          </Link>
          <Link href={`/${lang}/design`}>
            <Button variant="ghost" className="rounded-full">
              Design tokens
            </Button>
          </Link>
          <Link href={`/${lang}/pricing`}>
            <Button variant="ghost" className="rounded-full">
              Plans
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
