import {
  getProviderStatus,
  resolveAssistProvider,
} from "~/lib/providers";

export const assistKinds = [
  "ideas.generate",
  "plan.deepen",
  "ventures.create",
  "shell.approve",
  "research.deepen",
  "brand.voice",
] as const;

export type AssistKind = (typeof assistKinds)[number];

export type AssistSource = "model" | "local";

export type AssistResponse = {
  draft: string;
  source: AssistSource;
  provider?: string;
  model?: string;
};

export function isAssistKind(value: unknown): value is AssistKind {
  return (
    typeof value === "string" &&
    (assistKinds as readonly string[]).includes(value)
  );
}

export function localAssistDraft(kind: AssistKind, prompt: string): string {
  const clipped = prompt.trim().slice(0, 140) || "Untitled operator brief";
  switch (kind) {
    case "ideas.generate":
      return `Adaptive concept · ${clipped}`;
    case "plan.deepen":
      return `Generated deepen: ${clipped} — favor agency-grade execution with an explicit Approve gate before spend.`;
    case "ventures.create":
      return `Venture workspace drafted from “${clipped}”.`;
    case "shell.approve":
      return `Approved for ADAPT execute · ${clipped}`;
    case "research.deepen":
      return `Research deepen · ${clipped} — cite agency vs SaaS whitespace and push signal into the plan market section.`;
    case "brand.voice":
      return `Brand voice check · ${clipped} — keep Fifth Avenue precision, orange for action, gold for emphasis only.`;
    default:
      return clipped;
  }
}

function systemPrompt(kind: AssistKind): string {
  return [
    "You are ADAPT assist for MyBizAI (Fifth Avenue Intelligence Group).",
    "Write concise operator drafts — decisions, not dashboards.",
    "Tone: professional, trustworthy, autonomous warmth.",
    `Task kind: ${kind}.`,
    "Reply with plain text only — no markdown fences.",
  ].join(" ");
}

type ChatProvider = {
  name: "xai" | "openai";
  url: string;
  apiKey: string;
  model: string;
};

function resolveChatProvider(): ChatProvider | null {
  const resolved = resolveAssistProvider();
  if (resolved.id === "local") return null;

  if (resolved.id === "xai") {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) return null;
    return {
      name: "xai",
      url: "https://api.x.ai/v1/chat/completions",
      apiKey,
      model: resolved.model || "grok-4.6",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    name: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    apiKey,
    model: resolved.model || "gpt-4o-mini",
  };
}

export function getXaiApiKey(): string | null {
  return process.env.XAI_API_KEY?.trim() || null;
}

export function getXaiVoiceModel(): string {
  return process.env.XAI_VOICE_MODEL?.trim() || "grok-voice-latest";
}

export function getAssistProviderSnapshot() {
  return getProviderStatus().assist;
}

export async function runServerAssist(
  kind: AssistKind,
  prompt: string,
): Promise<AssistResponse> {
  const provider = resolveChatProvider();
  if (!provider) {
    return { draft: localAssistDraft(kind, prompt), source: "local" };
  }

  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
        ...(provider.name === "xai"
          ? { "x-grok-conv-id": `mybizai-assist-${kind}` }
          : {}),
      },
      body: JSON.stringify({
        model: provider.model,
        temperature: 0.7,
        max_tokens: 420,
        messages: [
          { role: "system", content: systemPrompt(kind) },
          {
            role: "user",
            content: prompt.trim() || "Draft the next operator move.",
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[assist] ${provider.name} ${res.status}`,
        detail.slice(0, 240),
      );
      return { draft: localAssistDraft(kind, prompt), source: "local" };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { draft: localAssistDraft(kind, prompt), source: "local" };
    }

    return {
      draft: content,
      source: "model",
      provider: provider.name,
      model: provider.model,
    };
  } catch (error) {
    console.error("[assist] model call failed", error);
    return { draft: localAssistDraft(kind, prompt), source: "local" };
  }
}
