"use client";

import Link from "next/link";

import { GlowingEffect } from "@saasfly/ui/glowing-effect";
import * as Icons from "@saasfly/ui/icons";

const pillars = [
  {
    title: "Brainstorm",
    body: "Prompt an idea. ADAPT co-plans industry, market, and positioning with you.",
    icon: Icons.Search,
    href: "shell",
  },
  {
    title: "Architect",
    body: "Approve the plan — brand, ops, marketing, and finance modules assemble as one system.",
    icon: Icons.Blocks,
    href: "shell",
  },
  {
    title: "Execute",
    body: "Agents ship the work while you monitor, intervene, or override from the dock.",
    icon: Icons.Rocket,
    href: "shell",
  },
] as const;

export function BrandCapabilities({ lang }: { lang: string }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <li key={pillar.title} className="min-h-[14rem] list-none">
            <Link
              href={`/${lang}/${pillar.href}`}
              className="relative block h-full rounded-2xl border border-brand-gold/25 bg-brand-ink/40 p-6 outline-none transition-colors hover:border-brand-orange/50 focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <GlowingEffect
                disabled={false}
                glow
                proximity={72}
                inactiveZone={0.01}
                borderWidth={2}
                spread={36}
              />
              <div className="relative z-10 flex h-full flex-col">
                <Icon className="h-6 w-6 text-brand-orange" />
                <h3 className="mt-5 font-display text-2xl tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
                <span className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-gold">
                  Open shell →
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
