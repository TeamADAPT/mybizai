const MODE_KEY = "mybizai.voiceMode";
const STEP_KEY = "mybizai.voiceStep";
const JOURNEY_KEY = "mybizai.voiceJourney";

export type VoiceJourneyMap = Partial<
  Record<"idea" | "research" | "plan" | "brand" | "venture", string>
>;

export function isVoiceMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function enableVoiceMode(step?: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MODE_KEY, "1");
    if (step) sessionStorage.setItem(STEP_KEY, step);
  } catch {
    /* private mode */
  }
}

export function disableVoiceMode() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(MODE_KEY);
    sessionStorage.removeItem(STEP_KEY);
  } catch {
    /* ignore */
  }
}

export function getVoiceStep(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STEP_KEY);
  } catch {
    return null;
  }
}

export function saveVoiceJourney(journey: VoiceJourneyMap) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
  } catch {
    /* ignore */
  }
}

export function loadVoiceJourney(): VoiceJourneyMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(JOURNEY_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VoiceJourneyMap;
  } catch {
    return {};
  }
}
