import { create } from "zustand";

/**
 * Shared operator loop state across Ideas → Plan → Shell → Ventures.
 *
 * LLM seam: `runAssist()` is the single place to swap the local draft
 * generator for an API route (e.g. /api/assist) once model keys land.
 */

export type LoopIdea = {
  id: string;
  title: string;
  industry: string;
  angle: string;
  kept: boolean;
};

export type LoopVentureStatus = "active" | "ready" | "paused" | "archived";

export type LoopVenture = {
  id: string;
  name: string;
  industry: string;
  status: LoopVentureStatus;
  note: string;
  createdAt: string;
  seededFromIdeaId?: string;
};

export type AssistKind =
  | "ideas.generate"
  | "plan.deepen"
  | "ventures.create"
  | "shell.approve";

type VentureLoopState = {
  ideas: LoopIdea[];
  ventures: LoopVenture[];
  planVision: string;
  lastEvent: string | null;
  assistPending: boolean;
  keepIdea: (id: string) => void;
  addIdea: (idea: Omit<LoopIdea, "id" | "kept"> & { kept?: boolean }) => void;
  seedPlanFromIdea: (idea: LoopIdea) => void;
  setPlanVision: (vision: string) => void;
  createVenture: (input: {
    name: string;
    industry: string;
    note: string;
    seededFromIdeaId?: string;
  }) => LoopVenture | null;
  setVentureStatus: (id: string, status: LoopVentureStatus) => void;
  approveVenture: (id: string) => void;
  /**
   * Local stand-in for ADAPT / LLM. Returns a draft string and stamps lastEvent.
   * Replace body with fetch('/api/assist') when wiring a real model.
   */
  runAssist: (kind: AssistKind, prompt: string) => Promise<string>;
  clearEvent: () => void;
};

const seedIdeas: LoopIdea[] = [
  {
    id: "1",
    title: "Boutique hospitality OS",
    industry: "Hospitality",
    angle: "Private-access ops for multi-property hosts with ADAPT concierges.",
    kept: false,
  },
  {
    id: "2",
    title: "Coastal SMB logistics desk",
    industry: "Logistics",
    angle: "Agency-grade routing plans that execute after Approve.",
    kept: true,
  },
  {
    id: "3",
    title: "Founder brand studio",
    industry: "Professional services",
    angle: "Cobalt/orange kits + campaign gate for solo operators.",
    kept: false,
  },
];

const seedVentures: LoopVenture[] = [
  {
    id: "v1",
    name: "Fifth Avenue demo",
    industry: "Professional services",
    status: "ready",
    note: "Brand kit locked · plan approved · waiting on campaign spend gate",
    createdAt: "2026-08-10",
  },
  {
    id: "v2",
    name: "Coastal logistics pilot",
    industry: "Logistics",
    status: "active",
    note: "Research deepen complete · finance base scenario green",
    createdAt: "2026-08-12",
    seededFromIdeaId: "2",
  },
];

function draftFromAssist(kind: AssistKind, prompt: string): string {
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
    default:
      return clipped;
  }
}

export const useVentureLoop = create<VentureLoopState>((set, get) => ({
  ideas: seedIdeas,
  ventures: seedVentures,
  planVision:
    "Fifth Avenue agency gravity distilled into an autonomous platform — personal touch, ADAPT execution.",
  lastEvent: null,
  assistPending: false,

  keepIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, kept: !idea.kept } : idea,
      ),
    })),

  addIdea: (idea) =>
    set((state) => ({
      ideas: [
        {
          id: String(Date.now()),
          kept: idea.kept ?? false,
          title: idea.title,
          industry: idea.industry,
          angle: idea.angle,
        },
        ...state.ideas,
      ],
      lastEvent: `Generated · new idea “${idea.title}”`,
    })),

  seedPlanFromIdea: (idea) =>
    set({
      planVision: `${idea.title} — ${idea.angle}`,
      lastEvent: `Queued for plan · “${idea.title}” as venture vision seed`,
      ideas: get().ideas.map((item) =>
        item.id === idea.id ? { ...item, kept: true } : item,
      ),
    }),

  setPlanVision: (vision) => set({ planVision: vision }),

  createVenture: ({ name, industry, note, seededFromIdeaId }) => {
    const trimmed = name.trim();
    if (!trimmed) {
      set({ lastEvent: "Name your venture before creating a workspace." });
      return null;
    }
    const next: LoopVenture = {
      id: `v-${Date.now()}`,
      name: trimmed,
      industry: industry.trim() || "General",
      status: "ready",
      note: note.trim() || "New venture workspace ready for ADAPT.",
      createdAt: new Date().toISOString().slice(0, 10),
      seededFromIdeaId,
    };
    set((state) => ({
      ventures: [next, ...state.ventures],
      lastEvent: `Created · “${next.name}” ready for plan handoff`,
    }));
    return next;
  },

  setVentureStatus: (id, status) =>
    set((state) => ({
      ventures: state.ventures.map((venture) =>
        venture.id === id ? { ...venture, status } : venture,
      ),
      lastEvent:
        status === "archived"
          ? "Archived · venture updated"
          : status === "active"
            ? "Activated · venture updated"
            : status === "paused"
              ? "Paused · venture updated"
              : "Marked ready · venture updated",
    })),

  approveVenture: (id) =>
    set((state) => {
      const venture = state.ventures.find((item) => item.id === id);
      return {
        ventures: state.ventures.map((item) =>
          item.id === id ? { ...item, status: "active" } : item,
        ),
        lastEvent: venture
          ? `Approved · “${venture.name}” queued for ADAPT execute in the shell`
          : "Approved · venture queued for ADAPT execute",
      };
    }),

  runAssist: async (kind, prompt) => {
    set({ assistPending: true });
    // Simulate model latency; swap for real LLM fetch later.
    await new Promise((resolve) => setTimeout(resolve, 280));
    const draft = draftFromAssist(kind, prompt);
    set({
      assistPending: false,
      lastEvent: `Assist · ${kind.replace(".", " ")} draft ready`,
    });
    return draft;
  },

  clearEvent: () => set({ lastEvent: null }),
}));
