"use client";

import * as React from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

import { hasClerkConfigured } from "~/lib/clerk-config";
import { UserAccountNav } from "~/components/user-account-nav";

type ClerkAuthNavProps = {
  lang: string;
  marketing: Record<string, string | object>;
  dropdown: Record<string, string>;
  fallbackUser?:
    | {
        name?: string | null;
        image?: string | null;
        email?: string | null;
      }
    | undefined;
  onOpenSignUp?: () => void;
};

function GuestButtons({
  lang,
  loginLabel,
  signupLabel,
  onOpenSignUp,
}: {
  lang: string;
  loginLabel: string;
  signupLabel: string;
  onOpenSignUp?: () => void;
}) {
  return (
    <>
      <Link href={`/${lang}/login-clerk`}>
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10",
          )}
        >
          {loginLabel}
        </span>
      </Link>
      <button
        type="button"
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-full bg-brand-orange px-4 text-brand-midnight hover:bg-brand-orange-soft",
        )}
        onClick={() => {
          if (onOpenSignUp) {
            onOpenSignUp();
            return;
          }
          window.location.href = `/${lang}/login-clerk`;
        }}
      >
        {signupLabel}
      </button>
    </>
  );
}

function ClerkAuthNavSession(props: ClerkAuthNavProps) {
  const { lang, marketing, dropdown, fallbackUser, onOpenSignUp } = props;
  const { isLoaded, user } = useUser();
  const loginLabel =
    typeof marketing.login === "string" ? marketing.login : "Log in";
  const signupLabel =
    typeof marketing.signup === "string" ? marketing.signup : "Request access";

  if (!isLoaded && (fallbackUser?.email || fallbackUser?.name)) {
    return (
      <UserAccountNav
        user={{
          name: fallbackUser.name ?? null,
          image: fallbackUser.image ?? null,
          email: fallbackUser.email ?? null,
        }}
        params={{ lang }}
        dict={dropdown}
      />
    );
  }

  if (!isLoaded) {
    return (
      <span className="text-xs text-muted-foreground">Checking access…</span>
    );
  }

  if (user) {
    return (
      <UserAccountNav
        user={{
          name: user.fullName ?? user.firstName ?? user.username ?? null,
          image: user.imageUrl ?? null,
          email: user.primaryEmailAddress?.emailAddress ?? null,
        }}
        params={{ lang }}
        dict={dropdown}
      />
    );
  }

  return (
    <GuestButtons
      lang={lang}
      loginLabel={loginLabel}
      signupLabel={signupLabel}
      onOpenSignUp={onOpenSignUp}
    />
  );
}

/**
 * Marketing / docs nav auth controls driven by the live Clerk session.
 */
export function ClerkAuthNav(props: ClerkAuthNavProps) {
  const { lang, marketing, fallbackUser, onOpenSignUp, dropdown } = props;
  const loginLabel =
    typeof marketing.login === "string" ? marketing.login : "Log in";
  const signupLabel =
    typeof marketing.signup === "string" ? marketing.signup : "Request access";

  if (!hasClerkConfigured()) {
    if (fallbackUser?.email || fallbackUser?.name) {
      return (
        <UserAccountNav
          user={{
            name: fallbackUser.name ?? null,
            image: fallbackUser.image ?? null,
            email: fallbackUser.email ?? null,
          }}
          params={{ lang }}
          dict={dropdown}
        />
      );
    }

    return (
      <GuestButtons
        lang={lang}
        loginLabel={loginLabel}
        signupLabel={signupLabel}
        onOpenSignUp={onOpenSignUp}
      />
    );
  }

  return <ClerkAuthNavSession {...props} />;
}

type SignedInAuthPanelProps = {
  lang: string;
  className?: string;
};

function SignedInAuthPanelInner({ lang, className }: SignedInAuthPanelProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [busy, setBusy] = React.useState<"out" | "switch" | null>(null);
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null;
  const label = user?.fullName ?? user?.firstName ?? email ?? "your account";

  const leave = async (mode: "out" | "switch") => {
    setBusy(mode);
    try {
      await signOut({ redirectUrl: `/${lang}/login-clerk` });
    } catch (error) {
      console.error("Sign out failed:", error);
      setBusy(null);
    }
  };

  return (
    <div className={cn("grid gap-4 text-center", className)}>
      <div className="space-y-1">
        <p className="text-sm text-foreground">Signed in as {label}</p>
        {email && label !== email ? (
          <p className="text-xs text-muted-foreground">{email}</p>
        ) : null}
      </div>
      <Link
        href={`/${lang}/dashboard`}
        className={cn(
          buttonVariants(),
          "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
        )}
      >
        Continue to workspace
      </Link>
      <button
        type="button"
        disabled={busy !== null}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "rounded-full border-brand-gold/50 text-brand-gold",
        )}
        onClick={() => void leave("switch")}
      >
        {busy === "switch" ? "Switching…" : "Use a different account"}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-muted-foreground",
        )}
        onClick={() => void leave("out")}
      >
        {busy === "out" ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}

/** Shown on login when a Clerk session already exists. */
export function SignedInAuthPanel(props: SignedInAuthPanelProps) {
  if (!hasClerkConfigured()) {
    return null;
  }
  return <SignedInAuthPanelInner {...props} />;
}
