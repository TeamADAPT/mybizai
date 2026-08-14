"use client";

import Link from "next/link";
import * as Icons from "@saasfly/ui/icons";

import { siteConfig } from "~/config/site";

export function GitHubStar() {
  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="MyBizAI GitHub"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand-gold/40 px-3 text-sm font-medium text-brand-gold transition hover:bg-brand-gold/10"
    >
      <Icons.GitHub className="h-4 w-4" />
      <span>GitHub</span>
    </Link>
  );
}
