"use client";

import React from "react";
import Link from "next/link";

import * as Icons from "@saasfly/ui/icons";
import { BrandLogo } from "~/components/brand-logo";
import { MobileNav } from "~/components/mobile-nav";

import type { MainNavItem } from "~/types";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  params: {
    lang: string;
  };
  marketing?: Record<string, string | object>;
}

export function MainNav({ items, children, params: { lang } }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const handleMenuItemClick = () => {
    toggleMenu();
  };
  return (
    <div className="flex gap-6 md:gap-10">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <BrandLogo href={`/${lang}`} size="sm" />
        </div>
        <Link
          href={`/${lang}/design`}
          className="hidden text-xs font-medium uppercase tracking-[0.16em] text-brand-gold/90 transition-colors hover:text-brand-gold md:inline-flex"
        >
          Design
        </Link>
        <Link
          href={`/${lang}/shell`}
          className="hidden text-xs font-medium uppercase tracking-[0.16em] text-brand-orange/90 transition-colors hover:text-brand-orange md:inline-flex"
        >
          Shell
        </Link>
      </div>

      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.Close /> : <BrandLogo showWordmark={false} size="sm" />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav
          items={items}
          menuItemClick={handleMenuItemClick}
          lang={lang}
        >
          {children}
        </MobileNav>
      )}
    </div>
  );
}
