"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const dashboardHref = `/${lang}/dashboard`;

  React.useEffect(() => {
    if (isLoaded && user) {
      router.replace(dashboardHref);
    }
  }, [dashboardHref, isLoaded, router, user]);

  if (!isLoaded) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Loading private access…
      </p>
    );
  }

  if (user) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Signed in — opening your dashboard…
      </p>
    );
  }

  return (
    <SignIn
      routing="path"
      path={`/${lang}/login-clerk`}
      signUpUrl={`/${lang}/register`}
      fallbackRedirectUrl={dashboardHref}
      forceRedirectUrl={dashboardHref}
    />
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
