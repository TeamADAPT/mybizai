"use client";

import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { brand } from "~/config/brand";

export default function LoginPage() {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState(false);

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative z-10 mx-auto w-full max-w-md rounded-2xl border border-brand-gold/30 bg-brand-ink/60 p-8 backdrop-blur">
        <div className="mb-8 flex flex-col items-center space-y-3 text-center">
          <BrandLogo href="/en" size="md" spin />
          <h1 className="font-display text-3xl tracking-tight">
            Operator access
          </h1>
          <p className="text-sm text-muted-foreground">
            {brand.parent} · admin console
          </p>
        </div>
        <button
          type="button"
          className={cn(
            buttonVariants(),
            "w-full rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
          )}
          onClick={() => {
            setIsGitHubLoading(true);
            signIn("github", {
              redirect: true,
              callbackUrl: "/admin/dashboard",
            }).catch((error) => {
              console.error("GitHub signIn error:", error);
              setIsGitHubLoading(false);
            });
          }}
          disabled={isGitHubLoading}
        >
          {isGitHubLoading ? (
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.GitHub className="mr-2 h-4 w-4" />
          )}
          Continue with GitHub
        </button>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/en" className="text-brand-gold hover:underline">
            Back to MyBizAI
          </Link>
        </p>
      </div>
    </div>
  );
}
