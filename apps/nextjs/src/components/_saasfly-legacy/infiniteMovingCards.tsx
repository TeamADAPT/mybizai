"use client";

import React from "react";

import { InfiniteMovingCards } from "@saasfly/ui/infinite-moving-cards";

export function InfiniteMovingCardss() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md antialiased">
      <InfiniteMovingCards items={reviews} direction="right" speed="slow" />
    </div>
  );
}

const reviews = [
  {
    quote:
      "Finally an AI that feels like a Fifth Avenue agency — not another chatbot.",
    name: "Elena",
    title: "Operator",
  },
  {
    quote:
      "Brainstorm to execute without losing the brand voice. That was the missing piece.",
    name: "Marcus",
    title: "Founder",
  },
  {
    quote:
      "The assist dock keeps me in control while agents actually ship the work.",
    name: "Priya",
    title: "Growth lead",
  },
  {
    quote:
      "Cobalt, orange, gold — the product looks as intentional as the outcomes.",
    name: "James",
    title: "Creative director",
  },
  {
    quote:
      "We replaced three agencies with one ADAPT loop. Personal touch, autonomous scale.",
    name: "Noah",
    title: "Verified operator",
  },
];
