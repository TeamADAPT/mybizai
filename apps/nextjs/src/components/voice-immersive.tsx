"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "~/components/brand-logo";
import { VoiceAgent } from "~/components/voice-agent";
import { brand } from "~/config/brand";
import {
  JOURNEY_STEPS,
  type JourneySnapshot,
  type JourneyStepId,
} from "~/lib/voice-guide";

const emptyJourney: JourneySnapshot = {
  idea: null,
  research: null,
  plan: null,
  brand: null,
  venture: null,
};

export function VoiceImmersive({ lang }: { lang: string }) {
  const [filled, setFilled] = useState<JourneySnapshot>(emptyJourney);

  const onJourneyFill = useCallback((step: JourneyStepId, value: string) => {
    setFilled((prev) => ({ ...prev, [step]: value }));
  }, []);

  return (
    <div className="voice-immersive relative flex min-h-[100dvh] flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/voice/adapt-voice-presence.png"
          alt=""
          fill
          priority
          className="voice-immersive__art object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,40,0.35)_45%,rgba(7,8,40,0.88)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0658]/55 via-[#120a8f]/35 to-[#070828]/92" />
        <div className="voice-immersive__grain absolute inset-0 opacity-[0.35]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
        <BrandLogo href={`/${lang}`} size="md" showWordmark />
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}/voice`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white/80"
          >
            Back to studio
          </Link>
          <Link
            href={`/${lang}/shell`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white/80"
          >
            Workspace
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-4 text-center sm:px-8">
        <p className="voice-immersive__fade font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffb347]/90">
          {brand.parent}
        </p>
        <h1 className="voice-immersive__fade voice-immersive__fade--delay font-display mt-3 max-w-xl text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.95] tracking-tight text-white">
          {brand.name}
        </h1>
        <p className="voice-immersive__fade voice-immersive__fade--delay2 mx-auto mt-4 max-w-md text-base text-white/70 sm:text-lg">
          Just talk. We’ll shape your idea into a business — quietly filling in
          the details as you go.
        </p>

        <div className="mt-10 w-full max-w-lg">
          <VoiceAgent variant="immersive" onJourneyFill={onJourneyFill} />
        </div>
      </main>

      <footer className="relative z-10 px-5 pb-7 sm:px-8">
        <ol className="mx-auto flex max-w-xl items-start justify-between gap-2">
          {JOURNEY_STEPS.map((step, index) => {
            const value = filled[step.id];
            const active = Boolean(value);
            return (
              <li
                key={step.id}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span
                  className={
                    active
                      ? "voice-immersive__step-dot voice-immersive__step-dot--on"
                      : "voice-immersive__step-dot"
                  }
                  aria-hidden
                />
                <span
                  className={
                    active
                      ? "font-mono text-[9px] uppercase tracking-[0.14em] text-[#ffb347]"
                      : "font-mono text-[9px] uppercase tracking-[0.14em] text-white/35"
                  }
                >
                  {step.label}
                </span>
                <span
                  className={
                    active
                      ? "line-clamp-2 max-w-[5.5rem] text-[11px] leading-snug text-white/85"
                      : "line-clamp-2 max-w-[5.5rem] text-[11px] leading-snug text-white/25"
                  }
                >
                  {value ?? (index === 0 ? "Waiting…" : "—")}
                </span>
              </li>
            );
          })}
        </ol>
      </footer>
    </div>
  );
}
