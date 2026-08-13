/**
 * MyBizAI brand tokens — source of truth for design discussion + CSS mapping.
 * Anchors: Ultramarine/Cobalt #120a8f · Dark Orange #ff8c00 · Gold accents.
 */

export const brand = {
  name: "MyBizAI",
  parent: "Fifth Avenue Intelligence Group",
  tagline: "Create, Automate, Thrive",
  mission:
    "Empowering entrepreneurs with a fully autonomous business ecosystem.",
} as const;

/** Named hex anchors from brand references */
export const brandHex = {
  cobalt: "#120a8f",
  cobaltDeep: "#0a0658",
  cobaltSoft: "#3b2fd4",
  orange: "#ff8c00",
  orangeDeep: "#e67300",
  orangeSoft: "#ffb347",
  gold: "#d4af37",
  goldSoft: "#e8c547",
  goldMuted: "#c9a227",
  midnight: "#070b18",
  ink: "#0c1228",
  chalk: "#f3f5fb",
  parchment: "#ece8df",
} as const;

/**
 * Suggested palette directions for review.
 * A is the recommended default (logo-faithful).
 */
export const paletteSuggestions = [
  {
    id: "A",
    name: "Vortex (recommended)",
    note: "Closest to the logo — deep cobalt surfaces, orange CTAs, gold for emphasis only.",
    swatches: {
      background: brandHex.midnight,
      primary: brandHex.cobalt,
      accent: brandHex.orange,
      highlight: brandHex.gold,
      surface: brandHex.ink,
    },
  },
  {
    id: "B",
    name: "Fifth Avenue Warm",
    note: "Slightly lifted cobalt for UI chrome; orange stays primary action; gold borders like the Architecture mock.",
    swatches: {
      background: "#0a1024",
      primary: "#1a129e",
      accent: "#ff8c00",
      highlight: "#e8c547",
      surface: "#121a36",
    },
  },
  {
    id: "C",
    name: "Dawn Contrast",
    note: "Light-mode leaning — cool chalk canvas, cobalt type, orange CTAs without cream/terracotta tropes.",
    swatches: {
      background: brandHex.chalk,
      primary: brandHex.cobalt,
      accent: brandHex.orange,
      highlight: brandHex.goldMuted,
      surface: "#ffffff",
    },
  },
] as const;

export const typography = {
  display: {
    family: "Instrument Serif",
    role: "Brand wordmark, hero headlines, editorial moments",
    cssVar: "--font-display",
  },
  sans: {
    family: "Manrope",
    role: "UI, body, navigation, forms",
    cssVar: "--font-sans",
  },
  mono: {
    family: "IBM Plex Mono",
    role: "Code, tokens, hex labels",
    cssVar: "--font-mono",
  },
} as const;

export const motion = {
  heroFade: "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1)",
  markSpin: "mark-spin 24s linear infinite",
  ctaGlow: "cta-glow 2.8s ease-in-out infinite",
} as const;

export type WireframeScreen = {
  id: string;
  title: string;
  purpose: string;
  regions: string[];
};

export const wireframes: WireframeScreen[] = [
  {
    id: "marketing-hero",
    title: "Marketing Hero",
    purpose: "One composition: brand, headline, support line, CTA — full-bleed atmosphere.",
    regions: [
      "Sticky nav: mark + wordmark | links | theme | access",
      "Full-bleed cobalt/midnight field with subtle grain + orange radial wash",
      "Hero mark (swirl) as atmospheric anchor, not a floating card",
      "Display headline + one sentence + primary CTA (orange) / secondary (gold outline)",
    ],
  },
  {
    id: "product-shell",
    title: "Product Shell",
    purpose: "App chrome for dashboard / brand kit / projects — dark-first work surface.",
    regions: [
      "Left rail: modules (Dashboard, Businesses, Research, Brand, Marketing, Finance)",
      "Top bar: context title + theme switch + profile",
      "Main canvas: one job per section, sparse cards only for interactive tools",
      "AI assist dock: persistent, non-modal strip",
    ],
  },
  {
    id: "onboarding",
    title: "Welcome / Access",
    purpose: "Private-access tone from Architecture mock — exclusive, not SaaS-generic.",
    regions: [
      "Centered stack on textured midnight",
      "Wordmark dominant",
      "Short promise + Request Access CTA",
      "Footer: Fifth Avenue Intelligence Group",
    ],
  },
];
