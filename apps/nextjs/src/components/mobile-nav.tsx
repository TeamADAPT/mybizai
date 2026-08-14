import * as React from "react";
import Link from "next/link";

import { cn } from "@saasfly/ui";

import { BrandLogo } from "~/components/brand-logo";
import { useLockBody } from "~/hooks/use-lock-body";
import type { MainNavItem } from "~/types";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
  menuItemClick?: () => void;
  lang?: string;
}

export function MobileNav({
  items,
  children,
  menuItemClick,
  lang = "en",
}: MobileNavProps) {
  useLockBody();
  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-2xl border border-brand-gold/25 bg-brand-ink/95 p-4 text-foreground shadow-md backdrop-blur">
        <BrandLogo href={`/${lang}`} size="sm" />
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => {
            const href = item.disabled
              ? "#"
              : item.href.startsWith("http")
                ? item.href
                : `/${lang}${item.href}`;
            return (
              <Link
                key={index}
                href={href}
                className={cn(
                  "flex w-full items-center rounded-lg p-2 text-sm font-medium transition-colors hover:bg-brand-orange/10 hover:text-brand-orange",
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
                onClick={menuItemClick}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="grid gap-2 border-t border-border pt-3">
          <Link
            href={`/${lang}/login-clerk`}
            className="rounded-full border border-brand-gold/40 px-3 py-2 text-center text-sm text-brand-gold"
            onClick={menuItemClick}
          >
            Login
          </Link>
          <Link
            href={`/${lang}/login-clerk`}
            className="rounded-full bg-brand-orange px-3 py-2 text-center text-sm font-medium text-brand-midnight"
            onClick={menuItemClick}
          >
            Request access
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
