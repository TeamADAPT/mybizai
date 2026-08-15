import { Card, CardContent, CardHeader, CardTitle } from "@saasfly/ui/card";

import { DashboardShell } from "~/components/shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Billing"
      description="Manage your MyBizAI subscription"
      className="space-y-4"
    >
      <LoadingCard title="Subscription" />
      <LoadingCard title="Usage" />
    </DashboardShell>
  );
}

function LoadingCard(props: { title: string }) {
  return (
    <Card className="mt-4 border-brand-gold/25 bg-brand-ink/40">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-light tracking-tight">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 animate-pulse rounded-xl bg-muted/60" />
      </CardContent>
    </Card>
  );
}
