import Link from "next/link";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { brand } from "~/config/brand";

type BrandAuthFrameProps = {
  lang: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  cornerHref?: string;
  cornerLabel?: string;
  footer?: React.ReactNode;
  spinLogo?: boolean;
};

/**
 * Shared private-access chrome for login / register / Clerk.
 */
export function BrandAuthFrame({
  lang,
  title,
  subtitle,
  children,
  backHref,
  backLabel,
  cornerHref,
  cornerLabel,
  footer,
  spinLogo = true,
}: BrandAuthFrameProps) {
  return (
    <div className="relative container flex min-h-screen w-screen flex-col items-center justify-center py-16">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-70" />
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 z-10 text-muted-foreground md:left-8 md:top-8",
          )}
        >
          <Icons.ChevronLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Link>
      ) : null}
      {cornerHref && cornerLabel ? (
        <Link
          href={cornerHref}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 z-10 text-muted-foreground md:right-8 md:top-8",
          )}
        >
          {cornerLabel}
        </Link>
      ) : null}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center space-y-8 rounded-2xl border border-brand-gold/30 bg-card/80 p-8 shadow-sm backdrop-blur dark:bg-brand-ink/50">
        <div className="flex flex-col items-center space-y-3 text-center">
          <BrandLogo href={`/${lang}`} size="md" spin={spinLogo} />
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {brand.parent} · {subtitle}
          </p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
