/**
 * Swappable ADAPT providers — flip with Railway env, no UI rewrite.
 *
 * ASSIST_PROVIDER: auto | xai | openai | local
 * VOICE_PROVIDER:  auto | xai | browser
 *
 * - xai text: grok-4.6 via XAI_API_KEY (same key Grok Build / console use)
 * - xai voice: grok-voice realtime + ephemeral tokens
 * - browser voice: Web Speech API mic/TTS + /api/assist for the brain
 *   (works without Voice API spend; still uses assist provider for replies)
 *
 * Grok Build itself is a coding agent (CLI/ACP), not an in-app voice API.
 * Keep it for repo work; use these providers for the product surface.
 */

export type AssistProviderId = "auto" | "xai" | "openai" | "local";
export type VoiceProviderId = "auto" | "xai" | "browser";

export type ProviderStatus = {
  assist: {
    requested: AssistProviderId;
    active: "xai" | "openai" | "local";
    model: string | null;
    xaiConfigured: boolean;
    openaiConfigured: boolean;
  };
  voice: {
    requested: VoiceProviderId;
    active: "xai" | "browser";
    xaiConfigured: boolean;
    model: string | null;
    voiceId: string | null;
    alternatives: Array<"xai" | "browser">;
  };
};

function normalizeAssist(raw?: string | null): AssistProviderId {
  const value = (raw ?? "auto").trim().toLowerCase();
  if (value === "xai" || value === "openai" || value === "local" || value === "auto") {
    return value;
  }
  return "auto";
}

function normalizeVoice(raw?: string | null): VoiceProviderId {
  const value = (raw ?? "auto").trim().toLowerCase();
  if (value === "xai" || value === "browser" || value === "auto") {
    return value;
  }
  return "auto";
}

export function getAssistProviderPreference(): AssistProviderId {
  return normalizeAssist(process.env.ASSIST_PROVIDER);
}

export function getVoiceProviderPreference(): VoiceProviderId {
  return normalizeVoice(process.env.VOICE_PROVIDER);
}

export function hasXaiKey(): boolean {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function resolveAssistProvider(): {
  id: "xai" | "openai" | "local";
  model: string | null;
} {
  const requested = getAssistProviderPreference();
  const xai = process.env.XAI_API_KEY?.trim();
  const openai = process.env.OPENAI_API_KEY?.trim();

  if (requested === "local") {
    return { id: "local", model: null };
  }
  if (requested === "xai") {
    return xai
      ? { id: "xai", model: process.env.XAI_MODEL?.trim() || "grok-4.6" }
      : { id: "local", model: null };
  }
  if (requested === "openai") {
    return openai
      ? {
          id: "openai",
          model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
        }
      : { id: "local", model: null };
  }
  // auto
  if (xai) {
    return { id: "xai", model: process.env.XAI_MODEL?.trim() || "grok-4.6" };
  }
  if (openai) {
    return {
      id: "openai",
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    };
  }
  return { id: "local", model: null };
}

export function resolveVoiceProvider(
  override?: "xai" | "browser" | null,
): {
  id: "xai" | "browser";
  model: string | null;
  voiceId: string | null;
} {
  if (override === "browser") {
    return { id: "browser", model: null, voiceId: null };
  }
  if (override === "xai") {
    return {
      id: hasXaiKey() ? "xai" : "browser",
      model: hasXaiKey()
        ? process.env.XAI_VOICE_MODEL?.trim() || "grok-voice-latest"
        : null,
      voiceId: hasXaiKey()
        ? process.env.XAI_VOICE_ID?.trim() || "eve"
        : null,
    };
  }

  const requested = getVoiceProviderPreference();
  if (requested === "browser") {
    return { id: "browser", model: null, voiceId: null };
  }
  if (requested === "xai" || requested === "auto") {
    if (hasXaiKey()) {
      return {
        id: "xai",
        model: process.env.XAI_VOICE_MODEL?.trim() || "grok-voice-latest",
        voiceId: process.env.XAI_VOICE_ID?.trim() || "eve",
      };
    }
  }
  return { id: "browser", model: null, voiceId: null };
}

export function getProviderStatus(): ProviderStatus {
  const assistResolved = resolveAssistProvider();
  const voiceResolved = resolveVoiceProvider();
  return {
    assist: {
      requested: getAssistProviderPreference(),
      active: assistResolved.id,
      model: assistResolved.model,
      xaiConfigured: hasXaiKey(),
      openaiConfigured: hasOpenAIKey(),
    },
    voice: {
      requested: getVoiceProviderPreference(),
      active: voiceResolved.id,
      xaiConfigured: hasXaiKey(),
      model: voiceResolved.model,
      voiceId: voiceResolved.voiceId,
      alternatives: hasXaiKey() ? ["xai", "browser"] : ["browser"],
    },
  };
}
