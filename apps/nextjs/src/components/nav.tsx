"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@saasfly/ui";
import * as Icons from "@saasfly/ui/icons";

import type { SidebarNavItem } from "~/types";

interface DashboardNavProps {
  items: SidebarNavItem[];
  params: {
    lang: string;
  };
}

const iconMapObj = new Map([
  ["overview", Icons.Dashboard],
  ["modules", Icons.Dashboard],
  ["brand", Icons.Page],
  ["research", Icons.Search],
  ["billing", Icons.Billing],
  ["settings", Icons.Settings],
]);

export function DashboardNav({ items, params: { lang } }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-1">
      {items.map((item, index) => {
        const Icon = iconMapObj.get(item.id) ?? Icons.ArrowRight;
        const href = item.disabled ? "/" : `/${lang}` + item.href;
        const active =
          path === href ||
          path === `/${lang}${item.href}` ||
          (item.href !== "/dashboard/" && path?.includes(item.href));
        return (
          item.href && (
            <Link key={index} href={href}>
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-orange/15 text-brand-orange"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
