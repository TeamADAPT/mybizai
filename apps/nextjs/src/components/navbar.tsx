"use client";

import React from "react";
import Link from "next/link";
import type { User } from "@saasfly/auth";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@saasfly/ui";

import { MainNav } from "./main-nav";
import { ClerkAuthNav } from "~/components/clerk-auth-nav";
import { LocaleChange } from "~/components/locale-change";
import { ThemeSwitch } from "~/components/theme-switch";
import { useSigninModal } from "~/hooks/use-signin-modal";

import useScroll from "~/hooks/use-scroll";
import type { MainNavItem } from "~/types";

interface NavBarProps {
  user: Pick<User, "name" | "image" | "email"> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
  params: {
    lang: string;
  };
  marketing: Record<string, string | object>;
  dropdown: Record<string, string>;
}

export function NavBar({
  user,
  items,
  children,
  rightElements,
  scroll = false,
  params: { lang },
  marketing,
  dropdown,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();
  const segment = useSelectedLayoutSegment();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center border-border bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items} params={{ lang: `${lang}` }} marketing={marketing}>
          {children}
        </MainNav>

        <div className="flex items-center space-x-3">
          {items?.length ? (
            <nav className="hidden gap-6 md:flex">
              {items?.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : (item.href.startsWith("http") ? item.href : `/${lang}${item.href}`)}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${segment}`)
                      ? "text-brand-orange font-semibold"
                      : "",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="hidden h-8 w-px bg-border sm:block" />

          {rightElements}

          <ThemeSwitch />
          <LocaleChange url={"/"} />
          <ClerkAuthNav
            lang={lang}
            marketing={marketing}
            dropdown={dropdown}
            fallbackUser={user}
            onOpenSignUp={signInModal.onOpen}
          />
        </div>
      </div>
    </header>
  );
}
