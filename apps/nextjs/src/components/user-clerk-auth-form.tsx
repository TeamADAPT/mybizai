"use client";

import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

import { hasClerkConfigured } from "~/lib/clerk-config";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict?: Dictionary;
  disabled?: boolean;
}

function ClerkSignIn({ lang }: { lang: string }) {
  const { user } = useUser();
  if (user) {
    redirect(`/${lang}/dashboard`);
  }

  return (
    <SignIn withSignUp={false} fallbackRedirectUrl={`/${lang}/dashboard`} />
  );
}

export function UserClerkAuthForm({
  className,
  lang,
  ...props
}: UserAuthFormProps) {
  if (!hasClerkConfigured()) {
    return (
      <div className={cn("grid gap-4 text-center", className)} {...props}>
        <p className="text-sm text-muted-foreground">
          Private access sign-in is almost ready. Preview the product shell
          while Clerk keys are connected on staging.
        </p>
        <Link
          href={`/${lang}/shell`}
          className={cn(
            buttonVariants(),
            "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
          )}
        >
          Preview product shell
        </Link>
        <Link
          href={`/${lang}/playbook`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-full border-brand-gold/50 text-brand-gold",
          )}
        >
          Operator playbook
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <ClerkSignIn lang={lang} />
    </div>
  );
}
