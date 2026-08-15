"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { buttonVariants } from "@saasfly/ui/button";
import { cn } from "@saasfly/ui";

import { hasClerkConfigured } from "~/lib/clerk-config";
import { LocaleChange } from "~/components/locale-change";
import { MainNav } from "~/components/main-nav";
import { DashboardNav } from "~/components/nav";
import { SiteFooter } from "~/components/site-footer";
import { ThemeSwitch } from "~/components/theme-switch";
import { UserAccountNav } from "~/components/user-account-nav";
import type { MainNavItem, SidebarNavItem } from "~/types";

type ServerUser = {
  name?: string | null;
  image?: string | null;
  email?: string | null;
};

type DashboardChromeProps = {
  lang: string;
  dict: {
    dropdown: Record<string, string>;
    common: Record<string, string>;
  };
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  serverUser?: ServerUser;
  children: React.ReactNode;
};

/**
 * Workspace chrome that trusts the Clerk browser session.
 * Development instances often omit the server "dev browser" cookie on
 * first party hosts (Railway), so middleware/RSC can look signed-out
 * while useUser() is signed-in — this gate follows the client session.
 */
export function DashboardChrome({
  lang,
  dict,
  mainNav,
  sidebarNav,
  serverUser,
  children,
}: DashboardChromeProps) {
  const router = useRouter();
  const clerkOn = hasClerkConfigured();
  const { isLoaded, user } = useUser();

  const resolvedUser = React.useMemo(() => {
    if (user) {
      return {
        name: user.fullName ?? user.firstName ?? user.username ?? null,
        image: user.imageUrl ?? null,
        email: user.primaryEmailAddress?.emailAddress ?? null,
      };
    }
    return serverUser;
  }, [serverUser, user]);

  React.useEffect(() => {
    if (!clerkOn) return;
    if (!isLoaded) return;
    if (!user && !serverUser) {
      router.replace(`/${lang}/login-clerk`);
    }
  }, [clerkOn, isLoaded, lang, router, serverUser, user]);

  if (clerkOn && !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Opening your workspace…
      </div>
    );
  }

  if (clerkOn && isLoaded && !user && !serverUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Private access required for the workspace.
        </p>
        <Link
          href={`/${lang}/login-clerk`}
          className={cn(
            buttonVariants(),
            "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!resolvedUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to open the MyBizAI workspace.
        </p>
        <Link
          href={`/${lang}/login-clerk`}
          className={cn(
            buttonVariants(),
            "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-40" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={mainNav} params={{ lang: `${lang}` }} />
          <div className="flex items-center space-x-3">
            <ThemeSwitch />
            <LocaleChange url={"/dashboard"} />
            <UserAccountNav
              user={resolvedUser}
              params={{ lang: `${lang}` }}
              dict={dict.dropdown}
            />
          </div>
        </div>
      </header>
      <div className="container relative z-10 grid flex-1 gap-8 py-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden w-[220px] flex-col md:flex">
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-ink/40 p-3">
            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              Workspace
            </p>
            <DashboardNav
              items={sidebarNav}
              params={{ lang: `${lang}` }}
            />
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter
        className="relative z-10 border-t border-border"
        params={{ lang: `${lang}` }}
        dict={dict.common}
      />
    </div>
  );
}
