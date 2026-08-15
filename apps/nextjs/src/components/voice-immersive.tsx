"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLogo } from "~/components/brand-logo";
import { VoiceAgent } from "~/components/voice-agent";
import {
  JOURNEY_ROUTES,
  JOURNEY_STEPS,
  type JourneySnapshot,
  type JourneyStepId,
} from "~/lib/voice-guide";
import {
  enableVoiceMode,
  loadVoiceJourney,
  saveVoiceJourney,
} from "~/lib/voice-mode";

const emptyJourney: JourneySnapshot = {
  idea: null,
  research: null,
  plan: null,
  brand: null,
  venture: null,
};

export function VoiceImmersive({ lang }: { lang: string }) {
  const router = useRouter();
  const [filled, setFilled] = useState<JourneySnapshot>(emptyJourney);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setFilled({ ...emptyJourney, ...loadVoiceJourney() });
  }, []);

  const onJourneyFill = useCallback(
    (step: JourneyStepId, value: string) => {
      setFilled((prev) => {
        const next = { ...prev, [step]: value };
        saveVoiceJourney(next);
        return next;
      });
      enableVoiceMode(step);
      // Take them into the matching studio in voice mode.
      router.push(`/${lang}/${JOURNEY_ROUTES[step]}?voice=1`);
    },
    [lang, router],
  );

  return (
    <div className="voice-immersive relative flex min-h-[100dvh] overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/voice/adapt-voice-presence.png"
          alt=""
          fill
          priority
          className="voice-immersive__art object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,40,0.4)_50%,rgba(7,8,40,0.92)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0658]/50 via-[#120a8f]/30 to-[#070828]/95" />
        <div className="voice-immersive__grain absolute inset-0 opacity-[0.3]" />
      </div>

      {/* Compact circle control — closed by default */}
      <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-5">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#070828]/70 text-white shadow-lg shadow-black/30 backdrop-blur-md transition hover:border-[#ff8c00]/55"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="font-display text-lg leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>

        {menuOpen ? (
          <div className="mt-3 w-[13.5rem] rounded-2xl border border-white/15 bg-[#070828]/92 p-3 shadow-2xl backdrop-blur-md">
            <BrandLogo href={`/${lang}`} size="sm" showWordmark />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
              Journey
            </p>
            <nav className="mt-2 flex flex-col gap-1">
              {JOURNEY_STEPS.map((step) => {
                const value = filled[step.id];
                const done = Boolean(value);
                return (
                  <Link
                    key={step.id}
                    href={`/${lang}/${JOURNEY_ROUTES[step.id]}?voice=1`}
                    onClick={() => {
                      enableVoiceMode(step.id);
                      setMenuOpen(false);
                    }}
                    className={
                      done
                        ? "rounded-lg border border-[#ff8c00]/40 bg-[#ff8c00]/10 px-2.5 py-1.5 text-left"
                        : "rounded-lg border border-white/10 px-2.5 py-1.5 text-left hover:border-white/25"
                    }
                  >
                    <span
                      className={
                        done
                          ? "font-mono text-[9px] uppercase tracking-[0.12em] text-[#ffb347]"
                          : "font-mono text-[9px] uppercase tracking-[0.12em] text-white/40"
                      }
                    >
                      {step.label}
                      {done ? " · done" : ""}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => {
                  setChatOpen((open) => !open);
                  setMenuOpen(false);
                }}
                className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 hover:text-white"
              >
                {chatOpen ? "Hide chat" : "Written chat"}
              </button>
              <Link
                href={`/${lang}/voice`}
                className="rounded-full border border-white/15 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 hover:text-white"
              >
                Back to studio
              </Link>
              <Link
                href={`/${lang}/shell`}
                className="rounded-full border border-white/10 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 hover:text-white/70"
              >
                Workspace
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="voice-immersive__fade pointer-events-none absolute top-6 font-display text-3xl tracking-tight text-white/90 sm:top-8 sm:text-4xl">
          MyBizAI
        </p>
        <div className="relative flex w-full max-w-xl flex-col items-center justify-center">
          <VoiceAgent
            variant="immersive"
            onJourneyFill={onJourneyFill}
            chatOpen={chatOpen}
          />
        </div>
      </main>
    </div>
  );
}
