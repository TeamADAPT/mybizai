/**
 * Voice ↔ Grok Build handoff.
 *
 * Voice (xAI realtime / browser) stays conversational and cheap.
 * Coding work is packaged as a brief for Grok Build (subscription / CLI),
 * not executed inside the voice session.
 */

export type BuildBrief = {
  id: string;
  title: string;
  request: string;
  prompt: string;
  cli: string;
  createdAt: string;
  source: "voice" | "shell" | "manual";
};

const CODING_HINT =
  /\b(code|coding|implement|implementation|refactor|fix|bug|pr\b|pull request|commit|deploy|typescript|react|api route|write a function|build the|ship the|patch|debug)\b/i;

export function looksLikeCodingRequest(text: string): boolean {
  return CODING_HINT.test(text);
}

export function packageBuildBrief(input: {
  request: string;
  source?: BuildBrief["source"];
  context?: string;
}): BuildBrief {
  const request = input.request.trim();
  const title =
    request.slice(0, 72).replace(/\s+/g, " ") || "MyBizAI coding handoff";
  const context = input.context?.trim();
  const prompt = [
    "You are Grok Build working in the MyBizAI monorepo (TeamADAPT/mybizai).",
    "Voice already captured the operator intent — implement the change, do not re-interview.",
    "Prefer small diffs on the ADAPT loop (assist, voice providers, studios, shell).",
    "Do not invent new auth or billing surfaces unless asked.",
    "Use the Railway plugin / MCP when deploying: project caring-expression, service mybizai, environment production, staging https://mybizai-production-63b8.up.railway.app",
    "Keep Plan Mode on until the operator approves deploys.",
    "",
    "## Operator request",
    request,
    context ? `\n## Context\n${context}` : "",
    "",
    "## Done when",
    "- Change compiles / typechecks in touched files",
    "- Staging path is clear (Railway branch or note)",
    "- Summarize files touched in 3 bullets",
  ]
    .filter(Boolean)
    .join("\n");

  const cli = `grok -p ${JSON.stringify(prompt.slice(0, 1800))}`;

  return {
    id: `build-${Date.now()}`,
    title,
    request,
    prompt,
    cli,
    createdAt: new Date().toISOString(),
    source: input.source ?? "voice",
  };
}
