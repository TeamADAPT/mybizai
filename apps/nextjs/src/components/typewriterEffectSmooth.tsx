"use client";

import { TextGenerateEffect } from "@saasfly/ui/typewriter-effect";

export function TypewriterEffectSmooths() {
  const words = [
    { text: "Brainstorm." },
    { text: "Architect." },
    { text: "Execute." },
    {
      text: "MyBizAI.",
      className: "text-brand-orange",
    },
  ];
  return (
    <div className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
      <TextGenerateEffect words={words} />
    </div>
  );
}
