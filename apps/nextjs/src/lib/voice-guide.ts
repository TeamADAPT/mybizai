/**
 * Non-technical voice guide — conversation fills the ADAPT loop quietly.
 */

export const IMMERSIVE_INSTRUCTIONS = [
  "You are ADAPT, the calm voice of MyBizAI.",
  "The person talking is not technical. Speak simply, warmly, and briefly — one question at a time.",
  "Your job: guide them from a spark of an idea to a real business they feel ready to run.",
  "Journey order: Idea → Research → Plan → Brand → Venture. Never dump a form or dashboard.",
  "When they name a business idea, repeat it back once, confirm, then say you’ve saved it — we will open the Ideas studio for them.",
  "When they describe who it’s for or the market, treat that as research and say we’re opening Research.",
  "When they describe how it should work, treat that as the plan and say we’re opening Plan.",
  "When they describe the feel/tone of the brand, note it and say we’re opening Brand.",
  "When they are ready, celebrate lightly and say we’re opening their Venture.",
  "Never read code, diffs, or engineering steps aloud.",
  "If they ask to build software features, say you’ll handle that in the background and stay on the business conversation.",
  "Start by welcoming them to MyBizAI and asking what business they’ve been thinking about.",
].join(" ");

export const STUDIO_INSTRUCTIONS = [
  "You are ADAPT voice for MyBizAI (Fifth Avenue Intelligence Group).",
  "Speak briefly and clearly — decisions, not dashboards.",
  "Help operators move Ideas → Research → Plan → Brand → Campaigns → Finance → Approve → Venture.",
  "Ask one focused question at a time. Prefer action over lecture.",
  "CRITICAL: Do NOT write code, diffs, or long technical implementations aloud.",
  "If the operator asks to code, implement, fix, refactor, or ship engineering work, acknowledge in one sentence that it will be queued for Grok Build (their coding subscription) and stop.",
  "Keep voice cheap — conversation and routing only; coding is a handoff.",
].join(" ");

export const JOURNEY_STEPS = [
  { id: "idea", label: "Idea" },
  { id: "research", label: "Research" },
  { id: "plan", label: "Plan" },
  { id: "brand", label: "Brand" },
  { id: "venture", label: "Venture" },
] as const;

export type JourneyStepId = (typeof JOURNEY_STEPS)[number]["id"];

/** Locale-relative studio paths for journey navigation. */
export const JOURNEY_ROUTES: Record<JourneyStepId, string> = {
  idea: "ideas",
  research: "research",
  plan: "plan",
  brand: "brand-kit",
  venture: "ventures",
};

export type JourneySnapshot = {
  idea: string | null;
  research: string | null;
  plan: string | null;
  brand: string | null;
  venture: string | null;
};

/**
 * Lightweight capture from spoken language — fills the loop without forms.
 */
export function extractJourneyHint(text: string): {
  step: JourneyStepId | null;
  value: string;
} {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 4) return { step: null, value: "" };

  const idea =
    trimmed.match(
      /(?:i want to (?:build|start|create)|my idea is|let'?s (?:build|start)|i'?m thinking (?:about|of))\s+(.+)/i,
    ) ?? trimmed.match(/^(.+?)(?:\s+business)?$/i);

  if (
    /(?:i want to (?:build|start|create)|my idea is|let'?s (?:build|start)|i'?m thinking)/i.test(
      trimmed,
    )
  ) {
    const value = (idea?.[1] ?? trimmed).replace(/[.?!]+$/, "").trim().slice(0, 120);
    if (value) return { step: "idea", value };
  }

  if (/(?:customers?|market|audience|who (?:it'?s|is) for|competitors?)/i.test(trimmed)) {
    return { step: "research", value: trimmed.slice(0, 200) };
  }

  if (/(?:the plan|how it works|we should|offer|pricing|product)/i.test(trimmed)) {
    return { step: "plan", value: trimmed.slice(0, 200) };
  }

  if (/(?:brand|feel|tone|look|voice|colors?|premium|friendly)/i.test(trimmed)) {
    return { step: "brand", value: trimmed.slice(0, 160) };
  }

  if (/(?:ready|let'?s (?:go|launch|do it)|create (?:the )?venture|i'?m in)/i.test(trimmed)) {
    return { step: "venture", value: trimmed.slice(0, 120) };
  }

  return { step: null, value: "" };
}
