import { NextResponse } from "next/server";

import { getXaiApiKey, getXaiVoiceModel } from "~/lib/assist";

export const runtime = "nodejs";

/**
 * Mint a short-lived xAI ephemeral token for browser WebSocket voice.
 * Keeps XAI_API_KEY on the server — never ship it to the client.
 */
export async function POST() {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "XAI_API_KEY is not configured. Add it on Railway to enable voice.",
        configured: false,
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
        { error: "Failed to mint voice session token", configured: true },
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
        { error: "Voice session response missing token", configured: true },
        { status: 502 },
      );
    }

    return NextResponse.json({
      token,
      model: getXaiVoiceModel(),
      expiresAt: data.expires_at ?? null,
      voice: process.env.XAI_VOICE_ID?.trim() || "eve",
      wsUrl: `wss://api.x.ai/v1/realtime?model=${encodeURIComponent(getXaiVoiceModel())}`,
    });
  } catch (error) {
    console.error("[voice/session] mint failed", error);
    return NextResponse.json(
      { error: "Voice session request failed", configured: true },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(getXaiApiKey()),
    model: getXaiVoiceModel(),
    textModel: process.env.XAI_MODEL?.trim() || "grok-4.6",
  });
}
