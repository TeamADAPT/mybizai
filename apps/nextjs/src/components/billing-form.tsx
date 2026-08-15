"use client";

import * as React from "react";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { toast } from "@saasfly/ui/use-toast";

import { formatDate } from "~/lib/utils";
import { UserSubscriptionPlan } from "~/types";

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan & {
    isCanceled: boolean;
  };
}

export function BillingForm({
  subscriptionPlan,
  className,
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsLoading(!isLoading);

    const response = await fetch("/api/users/stripe");

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }

    const session = await response.json();
    if (session) {
      window.location.href = session.url;
    }
  }

  return (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <div className="rounded-2xl border border-brand-gold/25 bg-card/70 p-5 dark:bg-brand-ink/40 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              Subscription
            </p>
            <h3 className="font-display text-2xl font-light tracking-tight">
              {subscriptionPlan?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {subscriptionPlan?.description}
            </p>
            {subscriptionPlan?.isPaid ? (
              <p className="pt-1 text-xs text-muted-foreground">
                {subscriptionPlan?.isCanceled
                  ? "Cancels on "
                  : "Renews on "}
                {formatDate(subscriptionPlan?.stripeCurrentPeriodEnd)}.
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className={cn(
              buttonVariants(),
              "shrink-0 rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
            )}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {subscriptionPlan?.isPaid
              ? "Manage subscription"
              : "Upgrade plan"}
          </button>
        </div>
      </div>
    </form>
  );
}
