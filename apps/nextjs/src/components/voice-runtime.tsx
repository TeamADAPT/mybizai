"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  VoiceAgent,
  type VoiceAgentPresentation,
  type VoiceStatus,
} from "~/components/voice-agent";
import {
  type PresencePhase,
  type StudioId,
  studioHref,
} from "~/lib/voice-guide";
import {
  enableVoiceMode,
  isVoiceMode,
  loadVoiceJourney,
  saveVoiceJourney,
} from "~/lib/voice-mode";
import { type Locale } from "~/config/i18n-config";

type VoiceRuntimeValue = {
  guestName: string | null;
  presencePhase: PresencePhase;
  sessionLive: boolean;
  voiceStatus: VoiceStatus;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  setPresencePhase: (phase: PresencePhase) => void;
};

const VoiceRuntimeContext = createContext<VoiceRuntimeValue | null>(null);

export function useVoiceRuntime(): VoiceRuntimeValue {
  const value = useContext(VoiceRuntimeContext);
  if (!value) {
    throw new Error("useVoiceRuntime must be used within VoiceRuntimeProvider");
  }
  return value;
}

/** Optional — presence chrome may render outside provider during SSR edge cases. */
export function useVoiceRuntimeOptional(): VoiceRuntimeValue | null {
  return useContext(VoiceRuntimeContext);
}

function resolvePresentation(
  pathname: string,
  guideActive: boolean,
): VoiceAgentPresentation {
  if (pathname.includes("/voice/presence")) return "presence";
  // Operator studio page mounts its own agent — keep the guide session hidden.
  if (/\/voice\/?$/.test(pathname)) return "hidden";
  if (guideActive) return "dock";
  return "hidden";
}

export function VoiceRuntimeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as Locale | undefined) ?? "en";

  const [guestName, setGuestName] = useState<string | null>(null);
  const [presencePhase, setPresencePhase] = useState<PresencePhase>("name");
  const [sessionLive, setSessionLive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [guideActive, setGuideActive] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams?.get("voice") === "1";
    if (fromQuery) enableVoiceMode();
    setGuideActive(fromQuery || isVoiceMode());
  }, [pathname, searchParams]);

  const presentation = useMemo(
    () => resolvePresentation(pathname, guideActive),
    [pathname, guideActive],
  );

  useEffect(() => {
    if (presentation === "presence") {
      setPresencePhase((current) =>
        current === "building" ? "name" : current,
      );
    }
  }, [presentation]);

  const handleJourney = useCallback(
    (studio: StudioId, value: string) => {
      const prior = loadVoiceJourney();
      const next = { ...prior, [studio]: value };
      saveVoiceJourney(next);
      enableVoiceMode(studio);
      setGuideActive(true);
      setPresencePhase("building");
      setChatOpen(false);
      router.push(studioHref(lang, studio));
    },
    [lang, router],
  );

  const value = useMemo(
    () => ({
      guestName,
      presencePhase,
      sessionLive,
      voiceStatus,
      chatOpen,
      setChatOpen,
      setPresencePhase,
    }),
    [guestName, presencePhase, sessionLive, voiceStatus, chatOpen],
  );

  return (
    <VoiceRuntimeContext.Provider value={value}>
      {children}
      <VoiceAgent
        lang={lang}
        presentation={presentation}
        presencePhase={presencePhase}
        chatOpen={chatOpen}
        onPresencePhase={setPresencePhase}
        onGuestName={setGuestName}
        onSessionLive={setSessionLive}
        onStatusChange={setVoiceStatus}
        onJourney={handleJourney}
      />
    </VoiceRuntimeContext.Provider>
  );
}
