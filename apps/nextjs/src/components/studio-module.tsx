import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand } from "~/config/brand";

export type StudioMetric = { label: string; value: string };
export type StudioInsight = { title: string; body: string };
export type StudioRow = { label: string; values: string[] };

type StudioModuleProps = {
  lang: string;
  eyebrow: string;
  title: string;
  lead: string;
  metrics: StudioMetric[];
  insights: StudioInsight[];
  prompt: string;
  shellModule?: string;
  table?: { columns: string[]; rows: StudioRow[] };
  children?: React.ReactNode;
};

/**
 * Thin mock-driven studio surface for research / finance / campaigns / plan.
 * Interactive shell remains the live playground; these pages hold the narrative.
 */
export function StudioModule({
  lang,
  eyebrow,
  title,
  lead,
  metrics,
  insights,
  prompt,
  shellModule,
  table,
  children,
}: StudioModuleProps) {
  const shellHref = shellModule
    ? `/${lang}/shell?module=${shellModule}`
    : `/${lang}/shell`;

  return (
    <div className="relative min-h-[80vh] py-14">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{lead}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-brand-gold/20 bg-card/80 p-5 dark:bg-brand-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 font-display text-3xl tracking-tight text-brand-orange">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {table ? (
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card/70 dark:bg-brand-ink/30">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Signal
                  </th>
                  {table.columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border/70">
                    <td className="px-4 py-3 font-medium">{row.label}</td>
                    {row.values.map((value, i) => (
                      <td key={`${row.label}-${i}`} className="px-4 py-3 text-muted-foreground">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="mt-10 space-y-4">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="rounded-2xl border border-border bg-card/70 p-6 dark:bg-brand-ink/30"
            >
              <h2 className="font-display text-xl tracking-tight">
                {insight.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{insight.body}</p>
            </article>
          ))}
        </div>

        {children}

        <div className="mt-10 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-orange">
            Assist prompt
          </p>
          <p className="mt-2 text-sm md:text-base">{prompt}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={shellHref}>
              <Button className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft">
                Open in shell
              </Button>
            </Link>
            <Link href={`/${lang}/playbook`}>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              >
                Operator playbook
              </Button>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {brand.parent} · mock-backed studio surface — wire live ADAPT data next
        </p>
      </div>
    </div>
  );
}
