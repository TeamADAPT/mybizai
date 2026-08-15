"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@saasfly/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";
import * as Icons from "@saasfly/ui/icons";

import { i18n, localeMap } from "~/config/i18n-config";

export function LocaleChange({ url }: { url: string }) {
  const router = useRouter();

  function onClick(locale: string) {
    router.push(`/${locale}/` + url);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0 text-muted-foreground hover:text-brand-gold"
        >
          <Icons.Languages />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-brand-gold/20">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onClick(locale)}
            className="focus:bg-brand-orange/10 focus:text-brand-orange"
          >
            <span>{localeMap[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
