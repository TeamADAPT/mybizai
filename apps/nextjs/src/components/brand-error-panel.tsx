"use client";

import Link from "next/link";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";

type BrandErrorPanelProps = {
  title?: string;
  detail?: string;
  lang?: string;
  onRetry?: () => void;
};

/**
 * Offline / route error panel (inspired by mocks/mybizai_error_offline).
 */
export function BrandErrorPanel({
  title = "Something went wrong",
  detail = "We could not reach this surface. Check your connection or try again.",
  lang = "en",
  onRetry,
}: BrandErrorPanelProps) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-50" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center">
          <BrandLogo href={`/${lang}`} size="md" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
            <Icons.Warning className="h-8 w-8" aria-hidden />
          </div>
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          <p className="max-w-md text-muted-foreground">{detail}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {onRetry ? (
              <Button
                onClick={onRetry}
                className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
              >
                Retry
              </Button>
            ) : null}
            <Link href={`/${lang}`}>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              >
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
