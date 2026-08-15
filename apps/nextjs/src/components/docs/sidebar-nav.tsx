"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@saasfly/ui";

import type { SidebarNavItem } from "~/types";

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
}

function langFromPath(pathname: string | null) {
  const match = pathname?.match(/^\/([a-z]{2})(?:\/|$)/);
  return match?.[1] ?? "en";
}

function withLang(href: string, lang: string) {
  if (href.startsWith("http") || href.startsWith(`/${lang}`)) return href;
  return `/${lang}${href.startsWith("/") ? "" : "/"}${href}`;
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname();
  const lang = langFromPath(pathname);

  return items.length ? (
    <div className="w-full">
      {items.map((item) => (
        <div key={item.href + item.title} className={cn("pb-8")}>
          <h4 className="mb-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
            {item.title}
          </h4>
          {item.items ? (
            <DocsSidebarNavItems
              items={item.items}
              pathname={pathname}
              lang={lang}
            />
          ) : null}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
  lang: string;
}

export function DocsSidebarNavItems({
  items,
  pathname,
  lang,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => {
        const href = item.href ? withLang(item.href, lang) : "#";
        const active =
          pathname === href ||
          (item.href && pathname?.endsWith(item.href));
        return !item.disabled && item.href ? (
          <Link
            key={item.title + item.href}
            href={href}
            className={cn(
              "flex w-full items-center rounded-lg px-2 py-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange",
              active && "bg-brand-orange/15 font-medium text-brand-orange",
            )}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={item.title + item.href}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60"
          >
            {item.title}
          </span>
        );
      })}
    </div>
  ) : null;
}
