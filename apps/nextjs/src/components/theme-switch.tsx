"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@saasfly/ui";
import { Button } from "@saasfly/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";
import * as Icons from "@saasfly/ui/icons";

type ThemeMode = "light" | "dark" | "system";

const modes: {
  id: ThemeMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "light", label: "Light", icon: <Icons.Sun className="h-4 w-4" /> },
  { id: "dark", label: "Dark", icon: <Icons.Moon className="h-4 w-4" /> },
  { id: "system", label: "System", icon: <Icons.Laptop className="h-4 w-4" /> },
];

export function ThemeSwitch({
  className,
  align = "end",
  showLabel = false,
}: {
  className?: string;
  align?: "start" | "center" | "end";
  showLabel?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const active = (theme as ThemeMode | undefined) ?? "dark";
  const TriggerIcon =
    !mounted || active === "system"
      ? Icons.Laptop
      : resolvedTheme === "light"
        ? Icons.Sun
        : Icons.Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 gap-2 rounded-full border border-border/70 bg-background/40 px-2.5 backdrop-blur",
            className,
          )}
          aria-label="Color theme"
        >
          <TriggerIcon className="h-4 w-4 text-brand-orange" />
          {showLabel ? (
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {mounted ? active : "theme"}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[10rem]">
        {modes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => setTheme(mode.id)}
            className={cn(
              "gap-2",
              mounted && active === mode.id && "bg-muted text-foreground",
            )}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
