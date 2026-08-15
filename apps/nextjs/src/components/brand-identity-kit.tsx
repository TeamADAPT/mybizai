"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand, brandHex, typography } from "~/config/brand";
import { useVentureLoop } from "~/hooks/use-venture-loop";

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
  const {
    brandKit,
    ventures,
    lastEvent,
    saveBrandKit,
    lockBrandToVenture,
    runAssist,
    assistPending,
  } = useVentureLoop();
  const [primary, setPrimary] = useState<(typeof colorChoices)[number]["id"]>(
    (colorChoices.find((c) => c.id === brandKit.primaryId)?.id ?? "cobalt") as
      (typeof colorChoices)[number]["id"],
  );
  const [logo, setLogo] = useState(brandKit.logoStyle);
  const [voice, setVoice] = useState(brandKit.voice);
  const [ventureId, setVentureId] = useState(
    brandKit.lockedToVentureId ??
      ventures.find((v) => v.status !== "archived")?.id ??
      "",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const nextPrimary =
      colorChoices.find((c) => c.id === brandKit.primaryId)?.id ?? "cobalt";
    setPrimary(nextPrimary);
    setLogo(brandKit.logoStyle);
    setVoice(brandKit.voice);
    if (brandKit.lockedToVentureId) {
      setVentureId(brandKit.lockedToVentureId);
    }
  }, [brandKit]);

  const selected =
    colorChoices.find((c) => c.id === primary) ?? colorChoices[0];
  const liveVentures = ventures.filter((v) => v.status !== "archived");

  function persistKit(lock: boolean) {
    startTransition(() => {
      void (async () => {
        saveBrandKit({
          primaryId: selected.id,
          primaryHex: selected.hex,
          primaryLabel: selected.label,
          logoStyle: logo,
          voice,
        });
        if (lock && ventureId) {
          lockBrandToVenture(ventureId);
          setStatus(`Saved + locked · kit attached to venture`);
        } else {
          setStatus("Saved · brand kit in shared loop store");
        }
      })();
    });
  }

  function exportKit() {
    persistKit(false);
    const payload = {
      brand: brand.name,
      parent: brand.parent,
      primary: { id: selected.id, hex: selected.hex, label: selected.label },
      palette: {
        cobalt: brandHex.cobalt,
        orange: brandHex.orange,
        gold: brandHex.gold,
        midnight: brandHex.midnight,
        chalk: brandHex.chalk,
      },
      typography: {
        display: typography.display.family,
        sans: typography.sans.family,
        mono: typography.mono.family,
      },
      logoStyle: logo,
      voice,
      lockedToVentureId: ventureId || null,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mybizai-brand-kit-${selected.id}-${logo}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded brand kit JSON · also saved to loop");
  }

  function checkVoice() {
    startTransition(() => {
      void (async () => {
        const draft = await runAssist("brand.voice", voice);
        setVoice(draft.slice(0, 280));
        setStatus("Assist · voice check applied — review, then save");
      })();
    });
  }

  const banner = status ?? lastEvent;

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
          and voice. Saves into the shared loop so Shell and Ventures stay in
          sync.
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
                  ? "h-16 w-16 scale-110 rounded-full ring-2 ring-brand-orange ring-offset-2 ring-offset-background transition"
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
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
          onClick={checkVoice}
          disabled={pending || assistPending}
        >
          {assistPending ? "Checking…" : "Assist · check voice"}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Step 5: Lock to venture
        </h2>
        <p className="text-sm text-muted-foreground">
          Attach this kit to a live venture so Shell Brand and Ventures stay
          aligned.
        </p>
        <select
          value={ventureId}
          onChange={(e) => setVentureId(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-brand-orange"
        >
          <option value="">Select a venture…</option>
          {liveVentures.map((venture) => (
            <option key={venture.id} value={venture.id}>
              {venture.name} · {venture.status}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-2xl border border-brand-gold/30 bg-brand-ink/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
          Consistency check
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {selected.label} + {logo} + Instrument Serif reads innovative and
          stable. Gold remains emphasis-only — matches the Architecture mock.
        </p>
        {banner ? (
          <p className="mt-4 text-sm text-brand-orange animate-fade-up">
            {banner}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
            onClick={() => persistKit(true)}
            disabled={pending || !ventureId}
          >
            Save + lock to venture
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-brand-gold/50 text-brand-gold"
            onClick={exportKit}
            disabled={pending}
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-brand-gold/50 text-brand-gold"
            asChild
          >
            <Link href={`/${lang}/design`}>Open design foundation</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href={`/${lang}/shell?module=brand`}>Preview in shell</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
