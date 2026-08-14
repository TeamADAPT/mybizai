import { Meteors } from "@saasfly/ui/meteors";

import type { Meteor } from "~/types/meteors";

export function Meteorss({ meteor }: { meteor: Meteor }) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-brand-cobalt/40 bg-gradient-to-r from-brand-cobalt to-brand-orange blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-ink/70 px-4 py-8 shadow-xl">
          <h1 className="relative z-50 mb-4 font-display text-2xl tracking-tight">
            {meteor.name}
          </h1>

          <p className="relative z-50 mb-4 text-base font-normal text-muted-foreground">
            {meteor.description}
          </p>
          <a href={meteor.url} target="_blank" rel="noopener noreferrer">
            <button className="rounded-full border border-brand-orange/60 px-4 py-1 text-brand-orange">
              {meteor.button_content}
            </button>
            <Meteors number={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
