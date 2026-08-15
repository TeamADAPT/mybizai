import { NextResponse } from "next/server";

import {
  isAssistKind,
  runServerAssist,
  type AssistKind,
} from "~/lib/assist";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const kind =
    body && typeof body === "object" && "kind" in body
      ? (body as { kind: unknown }).kind
      : null;
  const prompt =
    body && typeof body === "object" && "prompt" in body
      ? (body as { prompt: unknown }).prompt
      : "";

  if (!isAssistKind(kind)) {
    return NextResponse.json(
      { error: "Unknown assist kind" },
      { status: 400 },
    );
  }

  if (typeof prompt !== "string") {
    return NextResponse.json(
      { error: "Prompt must be a string" },
      { status: 400 },
    );
  }

  const result = await runServerAssist(kind as AssistKind, prompt);
  return NextResponse.json(result);
}
