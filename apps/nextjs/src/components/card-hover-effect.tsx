"use client";

import React from "react";

import { HoverEffect } from "@saasfly/ui/card-hover-effect";

export const projects = [
  {
    title: "Brainstorm",
    description:
      "Prompt an idea. ADAPT co-plans industry, market, and positioning with you.",
    link: "/#approach",
  },
  {
    title: "Architect",
    description:
      "Approve the plan — brand, ops, marketing, and finance assemble as one system.",
    link: "/shell",
  },
  {
    title: "Execute",
    description:
      "Agents ship the work while you monitor from the assist dock and intervene when needed.",
    link: "/shell",
  },
];

export function HoverEffects() {
  return <HoverEffect items={projects} />;
}
