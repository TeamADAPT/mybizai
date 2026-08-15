import { create } from "zustand";

import {
  localAssistDraft,
  type AssistKind,
  type AssistResponse,
} from "~/lib/assist";
import {
  packageBuildBrief,
  type BuildBrief,
} from "~/lib/build-handoff";

/**
 * Shared operator loop state across Ideas → Research → Plan → Brand →
 * Marketplace → Shell → Ventures → Voice → Grok Build handoff.
 *
 * LLM seam: `runAssist()` POSTs `/api/assist`. Voice stays conversational;
 * coding requests queue a BuildBrief for Grok Build (subscription/CLI).
 */

export type { AssistKind };
export type { BuildBrief };

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
  brandLocked?: boolean;
};

export type LoopBrandKit = {
  primaryId: string;
  primaryHex: string;
  primaryLabel: string;
  logoStyle: string;
  voice: string;
  lockedToVentureId: string | null;
  updatedAt: string | null;
};

export type LoopResearch = {
  notes: string;
  deepenedSignals: string[];
  readyForPlan: boolean;
};

export type LoopAgentStatus = "available" | "installed" | "wishlist";

export type LoopAgent = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  status: LoopAgentStatus;
};

type VentureLoopState = {
  ideas: LoopIdea[];
  ventures: LoopVenture[];
  planVision: string;
  brandKit: LoopBrandKit;
  research: LoopResearch;
  agents: LoopAgent[];
  buildQueue: BuildBrief[];
  lastEvent: string | null;
  assistPending: boolean;
  keepIdea: (id: string) => void;
  addIdea: (idea: Omit<LoopIdea, "id" | "kept"> & { kept?: boolean }) => void;
  seedPlanFromIdea: (idea: LoopIdea) => void;
  setPlanVision: (vision: string) => void;
  saveBrandKit: (
    kit: Omit<LoopBrandKit, "lockedToVentureId" | "updatedAt">,
  ) => void;
  lockBrandToVenture: (ventureId: string | null) => void;
  pushResearchToPlan: (input: {
    notes: string;
    deepenedSignals: string[];
  }) => void;
  setAgentStatus: (id: string, status: LoopAgentStatus) => void;
  createVenture: (input: {
    name: string;
    industry: string;
    note: string;
    seededFromIdeaId?: string;
  }) => LoopVenture | null;
  setVentureStatus: (id: string, status: LoopVentureStatus) => void;
  approveVenture: (id: string) => void;
  queueBuildBrief: (input: {
    request: string;
    source?: BuildBrief["source"];
    context?: string;
  }) => BuildBrief;
  clearBuildBrief: (id: string) => void;
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
    brandLocked: true,
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

const seedBrand: LoopBrandKit = {
  primaryId: "cobalt",
  primaryHex: "#120a8f",
  primaryLabel: "Cobalt",
  logoStyle: "vortex",
  voice:
    "Professional, trustworthy, and innovative — Fifth Avenue precision with autonomous warmth.",
  lockedToVentureId: "v1",
  updatedAt: "2026-08-10",
};

const seedResearch: LoopResearch = {
  notes:
    "Coastal SMB logistics — whitespace between agency retainers and generic SaaS.",
  deepenedSignals: [],
  readyForPlan: false,
};

const seedAgents: LoopAgent[] = [
  {
    id: "scout",
    name: "Research Scout",
    category: "Market research",
    blurb: "Maps TAM / whitespace and cites sources before deepen prompts.",
    status: "available",
  },
  {
    id: "steward",
    name: "Brand Steward",
    category: "Identity",
    blurb: "Keeps cobalt / orange / gold and voice locked across exports.",
    status: "installed",
  },
  {
    id: "runner",
    name: "Campaign Runner",
    category: "Marketing",
    blurb: "Drafts multi-channel briefs and waits for Approve before spend.",
    status: "available",
  },
  {
    id: "sentinel",
    name: "Finance Sentinel",
    category: "Projections",
    blurb: "Runs base / stretch / conservative with cash intervention flags.",
    status: "wishlist",
  },
  {
    id: "concierge",
    name: "Venture Concierge",
    category: "Operations",
    blurb: "Spins workspace ventures from approved plan sections.",
    status: "available",
  },
  {
    id: "guide",
    name: "Academy Guide",
    category: "Learning",
    blurb: "Pairs playbook steps with short tutorials for new operators.",
    status: "wishlist",
  },
];

export const useVentureLoop = create<VentureLoopState>((set, get) => ({
  ideas: seedIdeas,
  ventures: seedVentures,
  planVision:
    "Fifth Avenue agency gravity distilled into an autonomous platform — personal touch, ADAPT execution.",
  brandKit: seedBrand,
  research: seedResearch,
  agents: seedAgents,
  buildQueue: [],
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

  saveBrandKit: (kit) =>
    set((state) => ({
      brandKit: {
        ...kit,
        lockedToVentureId: state.brandKit.lockedToVentureId,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      lastEvent: `Brand kit saved · ${kit.primaryLabel} · ${kit.logoStyle}`,
    })),

  lockBrandToVenture: (ventureId) =>
    set((state) => {
      if (!ventureId) {
        return {
          brandKit: { ...state.brandKit, lockedToVentureId: null },
          lastEvent: "Brand kit unlocked from venture",
        };
      }
      const venture = state.ventures.find((item) => item.id === ventureId);
      return {
        brandKit: {
          ...state.brandKit,
          lockedToVentureId: ventureId,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        ventures: state.ventures.map((item) =>
          item.id === ventureId
            ? {
                ...item,
                brandLocked: true,
                note: `${item.note.replace(/\s*·?\s*Brand kit locked/gi, "").trim()} · Brand kit locked`,
              }
            : item,
        ),
        lastEvent: venture
          ? `Brand locked · “${venture.name}”`
          : "Brand locked to venture",
      };
    }),

  pushResearchToPlan: ({ notes, deepenedSignals }) =>
    set((state) => ({
      research: {
        notes,
        deepenedSignals,
        readyForPlan: deepenedSignals.length > 0,
      },
      planVision:
        deepenedSignals.length > 0
          ? `${state.planVision.split(" · Research:")[0]} · Research: ${deepenedSignals.join(", ")}`
          : state.planVision,
      lastEvent: `Queued for plan · ${deepenedSignals.length} research cells ready`,
    })),

  setAgentStatus: (id, status) =>
    set((state) => {
      const agent = state.agents.find((item) => item.id === id);
      return {
        agents: state.agents.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
        lastEvent:
          status === "installed"
            ? `Installed · ${agent?.name ?? "Agent"} ready for shell assist`
            : status === "wishlist"
              ? `Wishlist · ${agent?.name ?? "Agent"}`
              : `Removed · ${agent?.name ?? "Agent"} from venture stack`,
      };
    }),

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

  queueBuildBrief: ({ request, source, context }) => {
    const brief = packageBuildBrief({ request, source, context });
    set((state) => ({
      buildQueue: [brief, ...state.buildQueue].slice(0, 8),
      lastEvent: `Grok Build · brief queued “${brief.title}”`,
    }));
    return brief;
  },

  clearBuildBrief: (id) =>
    set((state) => ({
      buildQueue: state.buildQueue.filter((item) => item.id !== id),
      lastEvent: "Grok Build · brief cleared",
    })),

  runAssist: async (kind, prompt) => {
    set({ assistPending: true });
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, prompt }),
      });
      if (!res.ok) {
        throw new Error(`assist ${res.status}`);
      }
      const data = (await res.json()) as AssistResponse;
      const draft = data.draft?.trim() || localAssistDraft(kind, prompt);
      set({
        assistPending: false,
        lastEvent:
          data.source === "model"
            ? `Assist · ${kind.replace(".", " ")} · ${data.provider ?? "model"}${data.model ? ` · ${data.model}` : ""}`
            : `Assist · ${kind.replace(".", " ")} · local draft`,
      });
      return draft;
    } catch {
      const draft = localAssistDraft(kind, prompt);
      set({
        assistPending: false,
        lastEvent: `Assist · ${kind.replace(".", " ")} · local draft`,
      });
      return draft;
    }
  },

  clearEvent: () => set({ lastEvent: null }),
}));
