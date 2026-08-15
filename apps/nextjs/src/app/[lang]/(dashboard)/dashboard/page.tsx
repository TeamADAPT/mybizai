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
    title: "Ventures",
    href: "ventures",
    note: "Create, pause, archive workspaces",
  },
  {
    title: "Ideas",
    href: "ideas",
    note: "Brainstorm and keep venture seeds",
  },
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
    title: "Marketplace",
    href: "marketplace",
    note: "Install ADAPT agent skills",
  },
];

export default async function DashboardPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
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
            className="rounded-2xl border border-brand-gold/20 bg-brand-ink/40 p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              {card.label}
            </p>
            <p className="mt-3 font-display text-3xl tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
          {brand.name} modules
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={`/${lang}/${module.href}`}
              className="group rounded-2xl border border-border/80 bg-background/40 p-4 transition-colors hover:border-brand-orange/50 hover:bg-brand-orange/5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium text-foreground group-hover:text-brand-orange">
                  {module.title}
                </h2>
                <Icons.ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-orange" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{module.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
