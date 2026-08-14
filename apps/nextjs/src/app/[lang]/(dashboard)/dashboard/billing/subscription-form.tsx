"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

export function SubscriptionForm(props: {
  hasSubscription: boolean;
  dict: Record<string, string>;
}) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "en";

  return (
    <Link
      href={`/${lang}/pricing`}
      className={cn(
        buttonVariants(),
        "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
      )}
    >
      {props.hasSubscription
        ? props.dict.manage_subscription
        : props.dict.upgrade}
    </Link>
  );
}
