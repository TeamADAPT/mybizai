"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@saasfly/ui";
import { Input } from "@saasfly/ui/input";
import { toast } from "@saasfly/ui/use-toast";

interface DocsSearchProps extends React.HTMLAttributes<HTMLFormElement> {
  lang: string;
}

const destinations: { keys: string[]; path: string; label: string }[] = [
  { keys: ["design", "token", "color", "type", "font"], path: "design", label: "Design foundation" },
  { keys: ["shell", "product", "assist", "agent", "adapt"], path: "shell", label: "Product shell" },
  { keys: ["brand", "kit", "logo", "voice"], path: "brand-kit", label: "Brand Identity Kit" },
  { keys: ["price", "plan", "billing", "access", "architect"], path: "pricing", label: "Pricing" },
  { keys: ["login", "access", "sign"], path: "login-clerk", label: "Private access" },
  { keys: ["doc", "guide", "intro"], path: "docs", label: "Docs" },
];

export function DocsSearch({ className, lang, ...props }: DocsSearchProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const match = destinations.find((d) =>
      d.keys.some((key) => q.includes(key)),
    );

    if (match) {
      router.push(`/${lang}/${match.path}`);
      toast({
        title: "Opening",
        description: match.label,
      });
      return;
    }

    toast({
      title: "No match",
      description: "Try design, shell, brand, pricing, or access.",
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("relative w-full", className)}
      {...props}
    >
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search design, shell, brand…"
        className="h-9 w-full rounded-full border-brand-gold/30 bg-background/70 sm:w-72 sm:pr-12"
      />
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded-full border border-border px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
        enter
      </kbd>
    </form>
  );
}
