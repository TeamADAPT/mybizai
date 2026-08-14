import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";

import { DashboardShell } from "~/components/shell";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
};

interface Subscription {
  plan: string | null;
  endsAt: Date | null;
}

export default async function BillingPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  return (
    <DashboardShell
      title={dict.business.billing.billing}
      description={dict.business.billing.content}
      className="space-y-4"
      headerAction={
        <Link href={`/${lang}/pricing`}>
          <Button
            variant="outline"
            className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
          >
            View plans
          </Button>
        </Link>
      }
    >
      <SubscriptionCard dict={dict.business.billing} lang={lang} />
      <UsageCard />
    </DashboardShell>
  );
}

function generateSubscriptionMessage(
  dict: Record<string, string>,
  subscription: Subscription,
): string {
  const content = String(dict.subscriptionInfo);
  if (subscription.plan && subscription.endsAt) {
    return content
      .replace("{plan}", subscription.plan)
      .replace("{date}", subscription.endsAt.toLocaleDateString());
  }
  return "";
}

async function SubscriptionCard({
  dict,
  lang,
}: {
  dict: Record<string, string>;
  lang: string;
}) {
  let subscription: Subscription | null = null;
  try {
    const { trpc } = await import("~/trpc/server");
    subscription = (await trpc.auth.mySubscription.query()) as Subscription;
  } catch {
    subscription = null;
  }

  const { SubscriptionForm } = await import("./subscription-form");
  const content = subscription
    ? generateSubscriptionMessage(dict, subscription)
    : "";

  return (
    <Card className="border-brand-gold/25 bg-brand-ink/40">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-light tracking-tight">
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {subscription?.plan ? (
          <p dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p>{dict.noSubscription}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <SubscriptionForm hasSubscription={!!subscription?.plan} dict={dict} />
        <Link
          href={`/${lang}/shell`}
          className="text-sm text-brand-gold hover:underline"
        >
          Open product shell
        </Link>
      </CardFooter>
    </Card>
  );
}

function UsageCard() {
  const rows = [
    { label: "Agent runs this month", value: "128" },
    { label: "Plans approved", value: "17" },
    { label: "Brand kit exports", value: "3" },
  ];

  return (
    <Card className="mt-4 border-border bg-card/40">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-light tracking-tight">
          Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-border/60 py-2 text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-mono text-brand-orange">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
