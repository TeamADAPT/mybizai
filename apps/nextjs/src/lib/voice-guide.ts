/**
 * Non-technical voice guide — Nova fills the loop quietly.
 */

export const IMMERSIVE_INSTRUCTIONS = [
  "You are Nova, the calm voice of MyBizAI.",
  "The person talking is not technical. Speak simply, warmly, and briefly — one question at a time.",
  "Opening script (follow this order):",
  "1) Ask: Who am I speaking with?",
  "2) After they give a name, greet them by name, then ask: Do you have an idea, or shall we explore?",
  "3) If they want to explore, say you’ll open Ideas and help them discover options.",
  "4) If they have an idea, repeat it once, confirm, then say you’re opening Ideas to capture it.",
  "Journey order after that: Idea → Research → Plan → Brand → Venture.",
  "Never dump a form or dashboard. Never say you are ADAPT — you are Nova.",
  "When a step is ready, say you’re taking them there.",
  "Never read code, diffs, or engineering steps aloud.",
  "If they ask to build software features, say you’ll handle that in the background and stay on the business conversation.",
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

export type PresencePhase = "name" | "intent" | "building";

/** Studio ids used for voice journey navigation. */
export type StudioId = JourneyStepId;

export function studioHref(lang: string, studio: StudioId): string {
  return `/${lang}/${JOURNEY_ROUTES[studio]}?voice=1`;
}

/**
 * Lightweight capture from spoken language — fills the loop without forms.
 */
export function extractJourneyHint(
  text: string,
  phase: PresencePhase = "building",
): {
  step: JourneyStepId | null;
  value: string;
  phase?: PresencePhase;
  navigate?: boolean;
} {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2) return { step: null, value: "" };

  if (phase === "name") {
    const nameMatch = trimmed.match(
      /(?:i(?:'| a)?m|my name is|this is|call me)\s+([A-Za-z][\w' -]{1,40})/i,
    );
    const bare = trimmed.match(/^([A-Za-z][\w']{1,24})$/);
    const name = (nameMatch?.[1] ?? bare?.[1] ?? "").trim();
    if (name) {
      return { step: null, value: name, phase: "intent", navigate: false };
    }
    return { step: null, value: "" };
  }

  if (phase === "intent") {
    if (/(?:explore|not sure|no idea|help me|discover|brainstorm)/i.test(trimmed)) {
      return {
        step: "idea",
        value: "Exploring ideas together",
        phase: "building",
        navigate: true,
      };
    }
    if (
      /(?:i (?:have|got) an idea|my idea|i want to|let'?s build|i'?m thinking)/i.test(
        trimmed,
      )
    ) {
      const idea =
        trimmed
          .replace(
            /^(?:i (?:have|got) an idea[:\s]*|my idea is\s*|i want to (?:build|start|create)\s*|let'?s build\s*|i'?m thinking (?:about|of)\s*)/i,
            "",
          )
          .replace(/[.?!]+$/, "")
          .trim()
          .slice(0, 120) || trimmed.slice(0, 120);
      return {
        step: "idea",
        value: idea,
        phase: "building",
        navigate: true,
      };
    }
    // Short affirmative idea title
    if (trimmed.length > 3 && trimmed.length < 80 && !/\?$/.test(trimmed)) {
      return {
        step: "idea",
        value: trimmed.replace(/[.?!]+$/, "").trim(),
        phase: "building",
        navigate: true,
      };
    }
    return { step: null, value: "" };
  }

  if (
    /(?:i want to (?:build|start|create)|my idea is|let'?s (?:build|start)|i'?m thinking)/i.test(
      trimmed,
    )
  ) {
    const idea = trimmed
      .replace(
        /^(?:i want to (?:build|start|create)\s*|my idea is\s*|let'?s (?:build|start)\s*|i'?m thinking (?:about|of)\s*)/i,
        "",
      )
      .replace(/[.?!]+$/, "")
      .trim()
      .slice(0, 120);
    if (idea) return { step: "idea", value: idea, navigate: true };
  }

  if (/(?:customers?|market|audience|who (?:it'?s|is) for|competitors?)/i.test(trimmed)) {
    return { step: "research", value: trimmed.slice(0, 200), navigate: true };
  }

  if (/(?:the plan|how it works|we should|offer|pricing|product)/i.test(trimmed)) {
    return { step: "plan", value: trimmed.slice(0, 200), navigate: true };
  }

  if (/(?:brand|feel|tone|look|colors?|premium|friendly)/i.test(trimmed)) {
    return { step: "brand", value: trimmed.slice(0, 160), navigate: true };
  }

  if (/(?:ready|let'?s (?:go|launch|do it)|create (?:the )?venture|i'?m in)/i.test(trimmed)) {
    return { step: "venture", value: trimmed.slice(0, 120), navigate: true };
  }

  return { step: null, value: "" };
}
