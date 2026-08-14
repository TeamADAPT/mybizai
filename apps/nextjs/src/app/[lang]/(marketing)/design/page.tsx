import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { BrandLogo } from "~/components/brand-logo";
import { ThemeSwitch } from "~/components/theme-switch";
import {
  brand,
  brandHex,
  paletteSuggestions,
  typography,
  wireframes,
} from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Design Foundation",
  description: "MyBizAI colors, type, and wireframes",
};

function Swatch({
  hex,
  label,
  note,
}: {
  hex: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="min-w-0">
      <div
        className="aspect-[4/3] w-full rounded-xl border border-border shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 font-medium text-sm">{label}</p>
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
        {hex}
      </p>
      {note ? (
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      ) : null}
    </div>
  );
}

function WireframeFrame({
  title,
  purpose,
  regions,
}: {
  title: string;
  purpose: string;
  regions: string[];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card/40">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{purpose}</p>
      </div>
      <div className="space-y-2 bg-brand-midnight/40 p-5 dark:bg-black/20">
        {regions.map((region, i) => (
          <div
            key={region}
            className="rounded-lg border border-dashed border-brand-gold/40 bg-background/30 px-3 py-3 text-sm text-muted-foreground"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="mr-2 font-mono text-[10px] text-brand-orange">
              {String(i + 1).padStart(2, "0")}
            </span>
            {region}
          </div>
        ))}
      </div>
    </article>
  );
}

export default function DesignFoundationPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh]">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="pointer-events-none absolute inset-0 grain" />

      <div className="container relative z-10 space-y-20 py-14 md:py-20">
        <header className="animate-fade-up max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-gold">
            Design foundation · v0.1
          </p>
          <h1 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Colors, type, and wireframes for {brand.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Anchored to Ultramarine{" "}
            <span className="font-mono text-foreground">{brandHex.cobalt}</span>{" "}
            and Dark Orange{" "}
            <span className="font-mono text-foreground">{brandHex.orange}</span>,
            with gold used sparingly for high-signal moments — matching the
            logo&apos;s cobalt / orange vortex.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ThemeSwitch showLabel />
            <Button
              asChild
              className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft animate-cta-glow"
            >
              <Link href={`/${lang}`}>Preview marketing surface</Link>
            </Button>
          </div>
        </header>

        <section className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div>
            <h2 className="font-display text-3xl tracking-tight">Core anchors</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Locked from your references. Cobalt is trust and depth; orange is
              motion and action; gold is rare emphasis (active borders, private
              access).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <Swatch hex={brandHex.cobalt} label="Cobalt" note="Ultramarine base" />
            <Swatch hex={brandHex.cobaltSoft} label="Cobalt Soft" note="Dark UI fills" />
            <Swatch hex={brandHex.orange} label="Dark Orange" note="Primary CTA" />
            <Swatch hex={brandHex.gold} label="Gold" note="Emphasis / borders" />
            <Swatch hex={brandHex.midnight} label="Midnight" note="Dark canvas" />
            <Swatch hex={brandHex.chalk} label="Chalk" note="Light canvas" />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              Palette suggestions
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Three directions to play with. <strong>A · Vortex</strong> is wired
              as the default dark theme; light mode follows <strong>C · Dawn</strong>.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {paletteSuggestions.map((palette) => (
              <article
                key={palette.id}
                className="rounded-2xl border border-border bg-card/50 p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl">{palette.name}</h3>
                  <span className="font-mono text-xs text-brand-orange">
                    {palette.id}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{palette.note}</p>
                <div className="mt-4 flex h-16 overflow-hidden rounded-xl border border-border">
                  {Object.entries(palette.swatches).map(([key, hex]) => (
                    <div
                      key={key}
                      className="flex-1"
                      style={{ backgroundColor: hex }}
                      title={`${key}: ${hex}`}
                    />
                  ))}
                </div>
                <ul className="mt-3 space-y-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {Object.entries(palette.swatches).map(([key, hex]) => (
                    <li key={key} className="flex justify-between gap-2">
                      <span>{key}</span>
                      <span>{hex}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="font-display text-3xl tracking-tight">Typography</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Serif for brand authority (Architecture / Vision mocks); geometric
              sans for product UI — not Inter.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.values(typography).map((face) => (
              <div
                key={face.family}
                className="rounded-2xl border border-border bg-card/40 p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-gold">
                  {face.role.split(",")[0]}
                </p>
                <p
                  className={
                    face.family === "Instrument Serif"
                      ? "mt-3 font-display text-4xl"
                      : face.family === "IBM Plex Mono"
                        ? "mt-3 font-mono text-2xl"
                        : "mt-3 text-3xl font-semibold"
                  }
                >
                  {face.family}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{face.role}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-hero-wash p-8 md:p-12">
            <BrandLogo size="lg" spin />
            <p className="mt-8 font-display text-4xl leading-[1.15] tracking-tight md:text-5xl">
              Your vision deserves a personal touch.
            </p>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Experience the Fifth Avenue agency approach, distilled into an
              autonomous platform that designs, builds, and scales your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full bg-brand-orange px-6 text-brand-midnight hover:bg-brand-orange-soft">
                Request private access
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/70 text-brand-gold hover:bg-brand-gold/10"
              >
                View the system
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="font-display text-3xl tracking-tight">Wireframes</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Structural intent before component polish — one job per section,
              brand-first hero, dark product shell.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {wireframes.map((wf) => (
              <WireframeFrame key={wf.id} {...wf} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/30 p-6 md:p-8">
          <h2 className="font-display text-3xl tracking-tight">Token usage</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <pre className="overflow-x-auto rounded-xl bg-brand-midnight p-4 font-mono text-xs text-brand-orange-soft">
              {[
                "/* Tailwind */",
                "bg-brand-orange text-brand-midnight",
                "text-brand-gold border-brand-gold/60",
                "bg-brand-cobalt font-display",
                "",
                "/* Theme */",
                'defaultTheme="dark"',
                "enableSystem  → Light | Dark | System",
              ].join("\n")}
            </pre>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                CSS variables live in{" "}
                <code className="font-mono text-foreground">globals.css</code>.
                Brand metadata in{" "}
                <code className="font-mono text-foreground">config/brand.ts</code>.
              </p>
              <p>
                Next: swap the SVG mark for the production 3D logo asset, then
                restyle marketing + dashboard chrome against these wireframes
                with motion-heavy UI primitives already in{" "}
                <code className="font-mono text-foreground">@saasfly/ui</code>.
              </p>
              <p className="text-xs">
                Parent: {brand.parent} · Tagline: {brand.tagline}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
