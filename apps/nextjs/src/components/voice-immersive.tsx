"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "~/components/brand-logo";
import { VoiceAgent } from "~/components/voice-agent";
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

const STEP_HREF: Record<JourneyStepId, string> = {
  idea: "ideas",
  research: "research",
  plan: "plan",
  brand: "brand-kit",
  venture: "ventures",
};

export function VoiceImmersive({ lang }: { lang: string }) {
  const [filled, setFilled] = useState<JourneySnapshot>(emptyJourney);
  const [chatOpen, setChatOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(true);

  const onJourneyFill = useCallback((step: JourneyStepId, value: string) => {
    setFilled((prev) => ({ ...prev, [step]: value }));
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

      {/* Left rail */}
      <aside
        className={
          railOpen
            ? "relative z-20 flex w-[min(100%,15.5rem)] shrink-0 flex-col border-r border-white/10 bg-[#070828]/55 px-3 py-5 backdrop-blur-md sm:px-4"
            : "relative z-20 flex w-12 shrink-0 flex-col items-center border-r border-white/10 bg-[#070828]/55 py-5 backdrop-blur-md"
        }
      >
        <button
          type="button"
          onClick={() => setRailOpen((open) => !open)}
          className="mb-5 self-start font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 hover:text-white/75"
          aria-label={railOpen ? "Collapse menu" : "Expand menu"}
        >
          {railOpen ? "Hide" : "Menu"}
        </button>

        {railOpen ? (
          <>
            <BrandLogo href={`/${lang}`} size="sm" showWordmark />

            <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
              Journey
            </p>
            <nav className="mt-3 flex flex-col gap-1.5">
              {JOURNEY_STEPS.map((step) => {
                const value = filled[step.id];
                const done = Boolean(value);
                return (
                  <Link
                    key={step.id}
                    href={`/${lang}/${STEP_HREF[step.id]}`}
                    className={
                      done
                        ? "rounded-xl border border-[#ff8c00]/45 bg-[#ff8c00]/10 px-3 py-2 text-left transition hover:bg-[#ff8c00]/15"
                        : "rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
                    }
                  >
                    <span
                      className={
                        done
                          ? "font-mono text-[9px] uppercase tracking-[0.14em] text-[#ffb347]"
                          : "font-mono text-[9px] uppercase tracking-[0.14em] text-white/40"
                      }
                    >
                      {step.label}
                      {done ? " · done" : ""}
                    </span>
                    <span
                      className={
                        done
                          ? "mt-1 line-clamp-2 block text-[11px] leading-snug text-white/85"
                          : "mt-1 line-clamp-2 block text-[11px] leading-snug text-white/25"
                      }
                    >
                      {value ?? "Not yet"}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-2 pt-8">
              <button
                type="button"
                onClick={() => setChatOpen((open) => !open)}
                className={
                  chatOpen
                    ? "rounded-full border border-[#ff8c00]/50 bg-[#ff8c00]/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ffb347]"
                    : "rounded-full border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 hover:border-white/35 hover:text-white/85"
                }
              >
                {chatOpen ? "Hide chat" : "Written chat"}
              </button>
              <Link
                href={`/${lang}/voice`}
                className="rounded-full border border-white/15 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 hover:border-white/35 hover:text-white/85"
              >
                Back to studio
              </Link>
              <Link
                href={`/${lang}/shell`}
                className="rounded-full border border-white/10 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 hover:text-white/70"
              >
                Workspace
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-auto flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setChatOpen((open) => !open)}
              className="h-8 w-8 rounded-full border border-white/20 text-[10px] text-white/60"
              aria-label="Written chat"
              title="Written chat"
            >
              Aa
            </button>
            <Link
              href={`/${lang}/voice`}
              className="h-8 w-8 rounded-full border border-white/20 text-center text-[10px] leading-8 text-white/60"
              title="Back to studio"
            >
              ←
            </Link>
          </div>
        )}
      </aside>

      {/* Center: brand whisper + orb only */}
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
