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
  name: string;
  url: string;
  apiKey: string;
  model: string;
};

function resolveProvider(): ChatProvider | null {
  const xai = process.env.XAI_API_KEY?.trim();
  if (xai) {
    return {
      name: "xai",
      url: "https://api.x.ai/v1/chat/completions",
      apiKey: xai,
      model: process.env.XAI_MODEL?.trim() || "grok-2-latest",
    };
  }
  const openai = process.env.OPENAI_API_KEY?.trim();
  if (openai) {
    return {
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      apiKey: openai,
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    };
  }
  return null;
}

export async function runServerAssist(
  kind: AssistKind,
  prompt: string,
): Promise<AssistResponse> {
  const provider = resolveProvider();
  if (!provider) {
    return { draft: localAssistDraft(kind, prompt), source: "local" };
  }

  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        temperature: 0.7,
        max_tokens: 320,
        messages: [
          { role: "system", content: systemPrompt(kind) },
          { role: "user", content: prompt.trim() || "Draft the next operator move." },
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

    return { draft: content, source: "model", provider: provider.name };
  } catch (error) {
    console.error("[assist] model call failed", error);
    return { draft: localAssistDraft(kind, prompt), source: "local" };
  }
}
