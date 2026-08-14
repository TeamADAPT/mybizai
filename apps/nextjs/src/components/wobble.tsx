"use client";

import React from "react";

import { WobbleCard } from "@saasfly/ui/wobble-card";

export function WobbleCardShow() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full min-h-[500px] bg-brand-cobalt lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-balance text-left font-display text-base tracking-tight text-white md:text-xl lg:text-3xl">
            Stay ahead of the loop
          </h2>
          <p className="mt-4 text-left text-base/6 text-white/80">
            Brainstorm, Architect, and Execute — ADAPT keeps shipping while you
            approve the moments that matter.
          </p>
        </div>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-brand-ink">
        <h2 className="max-w-80 text-balance text-left font-display text-base tracking-tight text-white md:text-xl lg:text-3xl">
          Philosophy
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-white/80">
          Fifth Avenue standards. Autonomous scale. Personal touch.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[500px] bg-brand-orange lg:col-span-3 lg:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm text-balance text-left font-display text-base tracking-tight text-brand-midnight md:max-w-lg md:text-xl lg:text-3xl">
            MyBizAI — the autonomous business architect.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-brand-midnight/80">
            Design, build, and scale with an AI partner that executes — from
            Fifth Avenue Intelligence Group.
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
