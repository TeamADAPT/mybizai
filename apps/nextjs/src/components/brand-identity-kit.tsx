"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand, brandHex, typography } from "~/config/brand";

const colorChoices = [
  { id: "cobalt", hex: brandHex.cobalt, label: "Cobalt" },
  { id: "orange", hex: brandHex.orange, label: "Dark Orange" },
  { id: "gold", hex: brandHex.gold, label: "Gold" },
  { id: "soft", hex: brandHex.cobaltSoft, label: "Cobalt Soft" },
  { id: "midnight", hex: brandHex.midnight, label: "Midnight" },
] as const;

const logoStyles = [
  {
    id: "vortex",
    title: "Vortex",
    note: "Interlocking swirl — matches the MyBizAI mark.",
  },
  {
    id: "wordmark",
    title: "Wordmark",
    note: "Instrument Serif display with gold hairline.",
  },
  {
    id: "monogram",
    title: "Monogram",
    note: "MB lockup for favicons and app chrome.",
  },
] as const;

export function BrandIdentityKit({ lang }: { lang: string }) {
  const [primary, setPrimary] = useState<(typeof colorChoices)[number]["id"]>(
    "cobalt",
  );
  const [logo, setLogo] = useState<(typeof logoStyles)[number]["id"]>("vortex");
  const [voice, setVoice] = useState(
    "Professional, trustworthy, and innovative — Fifth Avenue precision with autonomous warmth.",
  );

  const selected = colorChoices.find((c) => c.id === primary) ?? colorChoices[0];

  return (
    <div className="mx-auto max-w-3xl space-y-14">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Step-by-step · Brand Identity
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
          Brand Identity Kit
        </h1>
        <p className="mt-3 text-muted-foreground">
          Craft a cohesive system for your venture — colors, type, logo style,
          and voice. Defaults mirror {brand.name}.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Step 1: Brand colors
        </h2>
        <p className="text-sm text-muted-foreground">
          Primary sets the trust surface. Orange stays action; gold stays rare.
        </p>
        <div className="flex flex-wrap gap-4">
          {colorChoices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              aria-label={choice.label}
              onClick={() => setPrimary(choice.id)}
              className={
                primary === choice.id
                  ? "h-16 w-16 rounded-full ring-2 ring-brand-orange ring-offset-2 ring-offset-background scale-110 transition"
                  : "h-16 w-16 rounded-full ring-2 ring-transparent transition hover:scale-105"
              }
              style={{ backgroundColor: choice.hex }}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Selected · {selected.label} {selected.hex}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Step 2: Typography
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              Display
            </p>
            <p className="mt-3 font-display text-3xl">
              {typography.display.family}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {typography.display.role}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              Body
            </p>
            <p className="mt-3 text-2xl font-semibold">{typography.sans.family}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {typography.sans.role}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Step 3: Logo style
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {logoStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLogo(style.id)}
              className={
                logo === style.id
                  ? "rounded-2xl border border-brand-orange bg-brand-ink/50 p-5 text-left"
                  : "rounded-2xl border border-border bg-card/30 p-5 text-left hover:border-brand-gold/40"
              }
            >
              <p className="font-display text-xl">{style.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{style.note}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Step 4: Brand voice
        </h2>
        <textarea
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
        />
      </section>

      <section className="rounded-2xl border border-brand-gold/30 bg-brand-ink/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
          Consistency check
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {selected.label} + {logo} + Instrument Serif reads innovative and
          stable. Gold remains emphasis-only — matches the Architecture mock.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
            Export brand kit
          </Button>
          <Button variant="outline" className="rounded-full border-brand-gold/50 text-brand-gold" asChild>
            <Link href={`/${lang}/design`}>Open design foundation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
