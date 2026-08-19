"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "~/components/brand-logo";
import { useVoiceRuntimeOptional } from "~/components/voice-runtime";
import {
  JOURNEY_ROUTES,
  JOURNEY_STEPS,
  type JourneySnapshot,
} from "~/lib/voice-guide";
import {
  enableVoiceMode,
  loadVoiceJourney,
} from "~/lib/voice-mode";

const emptyJourney: JourneySnapshot = {
  idea: null,
  research: null,
  plan: null,
  brand: null,
  venture: null,
};

/**
 * Presence chrome only — Nova orb + socket live in VoiceRuntimeProvider.
 */
export function VoiceImmersive({ lang }: { lang: string }) {
  const runtime = useVoiceRuntimeOptional();
  const [filled, setFilled] = useState<JourneySnapshot>(emptyJourney);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setFilled({ ...emptyJourney, ...loadVoiceJourney() });
  }, []);

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

      <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-5">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#070828]/70 text-white shadow-lg shadow-black/30 backdrop-blur-md transition hover:border-[#ff8c00]/55"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="font-display text-xl leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute inset-0 z-40 flex flex-col bg-[#070828]/96 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
            <BrandLogo href={`/${lang}`} size="md" showWordmark />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:border-[#ff8c00]/55"
              aria-label="Close menu"
            >
              <span className="font-display text-xl leading-none">×</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 pb-10 sm:px-12 lg:px-20">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">
              Journey
            </p>
            <nav className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
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
                        ? "rounded-2xl border border-[#ff8c00]/45 bg-[#ff8c00]/10 px-5 py-4 text-left transition hover:bg-[#ff8c00]/15 sm:px-6 sm:py-5"
                        : "rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/30 hover:bg-white/[0.06] sm:px-6 sm:py-5"
                    }
                  >
                    <span
                      className={
                        done
                          ? "font-display text-2xl tracking-tight text-[#ffb347] sm:text-3xl"
                          : "font-display text-2xl tracking-tight text-white sm:text-3xl"
                      }
                    >
                      {step.label}
                    </span>
                    <span
                      className={
                        done
                          ? "mt-1 block font-mono text-xs uppercase tracking-[0.16em] text-[#ffb347]/80"
                          : "mt-1 block font-mono text-xs uppercase tracking-[0.16em] text-white/35"
                      }
                    >
                      {done ? "Captured · open studio" : "Open studio"}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  runtime?.setChatOpen(!runtime.chatOpen);
                  setMenuOpen(false);
                }}
                className="rounded-full border border-white/20 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white/75 hover:text-white"
              >
                {runtime?.chatOpen ? "Hide chat" : "Written chat"}
              </button>
              <Link
                href={`/${lang}/voice`}
                className="rounded-full border border-white/20 px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-white/75 hover:text-white"
              >
                Back to studio
              </Link>
              <Link
                href={`/${lang}/shell`}
                className="rounded-full border border-white/10 px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-white/45 hover:text-white/70"
              >
                Workspace
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="voice-immersive__fade pointer-events-none absolute top-6 font-display text-3xl tracking-tight text-white/90 sm:top-8 sm:text-4xl">
          MyBizAI
        </p>
        {/* Nova orb is rendered by VoiceRuntimeProvider (persistent socket). */}
      </main>
    </div>
  );
}
