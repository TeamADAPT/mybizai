import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  Users,
} from "lucide-react";

import { Button } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";

import { BrandLogo } from "~/components/brand-logo";
import { ThemeSwitch } from "~/components/theme-switch";
import { brand } from "~/config/brand";

const stats = [
  {
    title: "Private access requests",
    value: "48",
    hint: "+12 this week",
    icon: Users,
  },
  {
    title: "Active workspaces",
    value: "19",
    hint: "Architect + Fifth Avenue",
    icon: Activity,
  },
  {
    title: "MRR (sandbox)",
    value: "$6.4k",
    hint: "Not charged in test mode",
    icon: CreditCard,
  },
];

const queue = [
  { name: "Elena M.", plan: "Architect", status: "Awaiting walkthrough" },
  { name: "Marcus T.", plan: "Fifth Avenue", status: "Brand kit exported" },
  { name: "Priya S.", plan: "Access", status: "Shell previewed" },
];

export default function Dashboard() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-40" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo href="/en" size="sm" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold sm:inline">
              Operator console
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link href="/en/shell">
              <Button
                size="sm"
                className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              >
                Open shell
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container relative z-10 flex-1 space-y-8 py-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            {brand.parent}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">
            Operator overview
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor access requests, sandbox billing, and workspace health —
            cobalt chrome, orange action.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-brand-gold/25 bg-brand-ink/40"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-brand-orange" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card/40">
          <CardHeader>
            <CardTitle className="font-display text-2xl font-light tracking-tight">
              Access queue
            </CardTitle>
            <CardDescription>
              Recent private-access activity across MyBizAI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {queue.map((row) => (
              <div
                key={row.name}
                className="flex flex-col gap-1 border-b border-border/60 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.status}</p>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-gold">
                  {row.plan}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
