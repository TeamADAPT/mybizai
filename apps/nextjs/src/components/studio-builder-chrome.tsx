"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand } from "~/config/brand";
import { isVoiceMode } from "~/lib/voice-mode";

type StudioBuilderChromeProps = {
  lang: string;
  eyebrow: string;
  title: string;
  lead: string;
  shellModule: string;
  children: React.ReactNode;
};

/** Shared header + shell link around interactive studio builders. */
export function StudioBuilderChrome({
  lang,
  eyebrow,
  title,
  lead,
  shellModule,
  children,
}: StudioBuilderChromeProps) {
  const [voiceMode, setVoiceMode] = useState(false);

  useEffect(() => {
    const fromQuery =
      new URLSearchParams(window.location.search).get("voice") === "1";
    setVoiceMode(fromQuery || isVoiceMode());
  }, []);

  return (
    <div
      className={
        voiceMode
          ? "voice-mode-studio relative min-h-[80vh] py-10 md:py-14"
          : "relative min-h-[80vh] py-10 md:py-14"
      }
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {voiceMode ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-orange">
                Voice mode · {eyebrow}
              </p>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 font-display text-3xl tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground">{lead}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {voiceMode ? (
              <Link href={`/${lang}/voice/presence`}>
                <Button
                  variant="outline"
                  className="rounded-full border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10"
                >
                  Presence
                </Button>
              </Link>
            ) : null}
            <Link href={`/${lang}/shell?module=${shellModule}`}>
              <Button
                variant="outline"
                className="rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
              >
                Open in shell
              </Button>
            </Link>
            <Link href={`/${lang}/playbook`}>
              <Button variant="ghost" className="rounded-full">
                Playbook
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">{children}</div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {brand.parent} · interactive builder — ADAPT execute after you approve
        </p>
      </div>
    </div>
  );
}
