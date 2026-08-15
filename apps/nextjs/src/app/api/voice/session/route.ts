import { NextResponse } from "next/server";

import { getXaiApiKey, getXaiVoiceModel } from "~/lib/assist";
import { getProviderStatus, resolveVoiceProvider } from "~/lib/providers";

export const runtime = "nodejs";

type VoiceBody = {
  provider?: "xai" | "browser";
};

/**
 * Mint a short-lived xAI ephemeral token for browser WebSocket voice,
 * or describe the browser-voice fallback (Web Speech + /api/assist).
 */
export async function POST(req: Request) {
  let body: VoiceBody = {};
  try {
    body = (await req.json()) as VoiceBody;
  } catch {
    body = {};
  }

  const resolved = resolveVoiceProvider(body.provider ?? null);
  const status = getProviderStatus();

  if (resolved.id === "browser") {
    return NextResponse.json({
      provider: "browser",
      configured: true,
      mode: "browser-speech",
      assist: status.assist,
      note: "Browser mic + speechSynthesis; replies drafted via /api/assist.",
      alternatives: status.voice.alternatives,
    });
  }

  const apiKey = getXaiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        provider: "browser",
        error:
          "XAI_API_KEY is not configured. Falling back to browser voice, or set the key on Railway.",
        configured: false,
        alternatives: ["browser"],
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.x.ai/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_after: { seconds: 300 },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[voice/session]", res.status, detail.slice(0, 240));
      return NextResponse.json(
        {
          error: "Failed to mint voice session token",
          configured: true,
          provider: "xai",
          alternatives: status.voice.alternatives,
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      value?: string;
      client_secret?: string | { value?: string };
      expires_at?: number;
    };

    const token =
      data.value ??
      (typeof data.client_secret === "string"
        ? data.client_secret
        : data.client_secret?.value);

    if (!token) {
      return NextResponse.json(
        {
          error: "Voice session response missing token",
          configured: true,
          provider: "xai",
        },
        { status: 502 },
      );
    }

    const model = getXaiVoiceModel();
    return NextResponse.json({
      provider: "xai",
      token,
      model,
      expiresAt: data.expires_at ?? null,
      voice: process.env.XAI_VOICE_ID?.trim() || "eve",
      wsUrl: `wss://api.x.ai/v1/realtime?model=${encodeURIComponent(model)}`,
      alternatives: status.voice.alternatives,
      assist: status.assist,
    });
  } catch (error) {
    console.error("[voice/session] mint failed", error);
    return NextResponse.json(
      {
        error: "Voice session request failed",
        configured: true,
        provider: "xai",
        alternatives: status.voice.alternatives,
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json(getProviderStatus());
}
