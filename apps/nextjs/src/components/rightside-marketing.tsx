"use client";

import Link from "next/link";

import { GlowingEffect } from "@saasfly/ui/glowing-effect";
import * as Icons from "@saasfly/ui/icons";

export function RightsideMarketing({
  dict,
  lang = "en",
}: {
  dict: Record<string, string> | undefined;
  lang?: string;
}) {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]"
        icon={<Icons.Rocket className="h-4 w-4 text-brand-orange" />}
        title={dict?.deploy_on_vercel_title ?? "Design"}
        description={
          dict?.deploy_on_vercel_desc ??
          "Lock cobalt, orange, and gold into every surface."
        }
        link={`/${lang}/design`}
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/7]"
        icon={<Icons.Cloud className="h-4 w-4 text-brand-orange" />}
        title={dict?.ship_on_cloudflare_title ?? "Execute"}
        description={
          dict?.ship_on_cloudflare_desc ??
          "Agents ship while you approve, intervene, or override."
        }
        link={`/${lang}/shell`}
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/7/3/13]"
        icon={<Icons.ThumbsUp className="h-4 w-4 text-brand-orange" />}
        title={dict?.showcase_title ?? "Private access"}
        description={
          dict?.showcase_desc ??
          "Fifth Avenue Intelligence Group — personal touch, autonomous scale."
        }
        link={`/${lang}/login-clerk`}
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  link?: string;
}

const GridItem = ({ area, icon, title, description, link }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-border p-2 md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <Link href={link ?? "#"}>
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-border/60 bg-brand-ink/40 p-6">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border border-brand-gold/30 p-2">
                {icon}
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-xl tracking-tight text-foreground md:text-2xl">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
};
