"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignIn, useClerk, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

import { hasClerkConfigured } from "~/lib/clerk-config";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict?: Dictionary;
  disabled?: boolean;
}

/** Post-login home until onboarding/venture routing is fully wired. */
function postLoginHref(lang: string) {
  return `/${lang}/dashboard`;
}

function ClerkSignIn({ lang }: { lang: string }) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const nextHref = postLoginHref(lang);

  React.useEffect(() => {
    if (isLoaded && user) {
      router.replace(nextHref);
    }
  }, [isLoaded, nextHref, router, user]);

  if (!isLoaded) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Loading private access…
      </p>
    );
  }

  if (user) {
    return (
      <div className="grid gap-3 text-center">
        <p className="text-sm text-foreground">Opening your workspace…</p>
        <p className="text-xs text-muted-foreground">
          Taking you to the overview. You can switch accounts from the avatar
          menu once you arrive.
        </p>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground",
          )}
          onClick={() => {
            void signOut({ redirectUrl: `/${lang}/login-clerk` });
          }}
        >
          Sign out instead
        </button>
      </div>
    );
  }

  return (
    <SignIn
      routing="path"
      path={`/${lang}/login-clerk`}
      signUpUrl={`/${lang}/register`}
      fallbackRedirectUrl={nextHref}
      forceRedirectUrl={nextHref}
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
