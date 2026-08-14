import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions, getCurrentUser } from "@saasfly/auth";
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

export default async function DashboardPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login-clerk");
  }
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

      <div className="grid gap-4 md:grid-cols-3">
        {overview.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-brand-gold/25 bg-brand-ink/40 p-5"
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

      <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
        <h2 className="font-display text-2xl tracking-tight">
          Welcome back{user.name ? `, ${user.name}` : ""}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {brand.mission} Jump into Brand kit, Marketing, or Finance from the
          shell — or continue approvals from the assist dock.
        </p>
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
        </div>
      </div>
    </DashboardShell>
  );
}
