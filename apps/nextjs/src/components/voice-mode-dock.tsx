"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useVoiceRuntimeOptional } from "~/components/voice-runtime";
import {
  JOURNEY_ROUTES,
  JOURNEY_STEPS,
  type JourneySnapshot,
} from "~/lib/voice-guide";
import {
  disableVoiceMode,
  enableVoiceMode,
  isVoiceMode,
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
 * Mid-right Nova button. Socket lives in VoiceRuntimeProvider — no second agent.
 */
export function VoiceModeDock({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const runtime = useVoiceRuntimeOptional();
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filled, setFilled] = useState<JourneySnapshot>(emptyJourney);

  const onPresence = pathname?.includes("/voice/presence");
  const speaking = runtime?.voiceStatus === "speaking";
  const live =
    runtime?.voiceStatus === "listening" ||
    runtime?.voiceStatus === "speaking" ||
    runtime?.voiceStatus === "connecting";

  useEffect(() => {
    const fromQuery = searchParams?.get("voice") === "1";
    const fromStore = isVoiceMode();
    setActive(fromQuery || fromStore);
    if (fromQuery) enableVoiceMode();
    setFilled({ ...emptyJourney, ...loadVoiceJourney() });
  }, [pathname, searchParams]);

  if (onPresence || !active) return null;

  return (
    <>
      <div className="fixed right-4 top-[48%] z-[70] flex -translate-y-1/2 flex-col items-end gap-2 sm:right-6">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className={
            speaking
              ? "voice-mode-dock voice-mode-dock--speak flex h-14 min-w-[5.5rem] items-center justify-center rounded-full border border-[#ff8c00]/80 bg-[#120a8f]/92 px-5 text-white shadow-lg shadow-[#ff8c00]/30 backdrop-blur-md"
              : live
                ? "voice-mode-dock flex h-14 min-w-[5.5rem] items-center justify-center rounded-full border border-[#ffb347]/55 bg-[#120a8f]/88 px-5 text-white shadow-lg shadow-black/30 backdrop-blur-md"
                : "voice-mode-dock flex h-14 min-w-[5.5rem] items-center justify-center rounded-full border border-white/25 bg-[#120a8f]/85 px-5 text-white shadow-lg shadow-black/30 backdrop-blur-md"
          }
          aria-label={expanded ? "Collapse Nova" : "Open Nova"}
          title="Nova"
        >
          <span className="font-display text-base tracking-tight">Nova</span>
        </button>
        {speaking ? (
          <p className="rounded-full bg-[#070828]/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ffb347]">
            Speaking
          </p>
        ) : live ? (
          <p className="rounded-full bg-[#070828]/65 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
            Listening
          </p>
        ) : null}

        {expanded ? (
          <div className="w-[min(100vw-2rem,17rem)] rounded-2xl border border-white/15 bg-[#070828]/92 p-3 text-white shadow-2xl backdrop-blur-md">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#ffb347]">
              Nova
            </p>
            <p className="mt-1 text-xs text-white/60">
              Nova is guiding this studio. Keep talking — or reopen presence.
            </p>
            {runtime?.guestName ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                With {runtime.guestName}
              </p>
            ) : null}
            <ul className="mt-3 space-y-1">
              {JOURNEY_STEPS.map((step) => {
                const done = Boolean(filled[step.id]);
                return (
                  <li key={step.id}>
                    <Link
                      href={`/${lang}/${JOURNEY_ROUTES[step.id]}?voice=1`}
                      className={
                        done
                          ? "block rounded-lg px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#ffb347] hover:bg-white/5"
                          : "block rounded-lg px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 hover:bg-white/5 hover:text-white/60"
                      }
                    >
                      {step.label}
                      {done ? " · done" : ""}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={`/${lang}/voice/presence`}
                className="rounded-full border border-white/20 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 hover:text-white"
              >
                Back to presence
              </Link>
              <button
                type="button"
                onClick={() => {
                  disableVoiceMode();
                  setActive(false);
                  setExpanded(false);
                  const url = new URL(window.location.href);
                  url.searchParams.delete("voice");
                  router.replace(url.pathname + url.search);
                }}
                className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 hover:text-white/70"
              >
                Exit voice mode
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
