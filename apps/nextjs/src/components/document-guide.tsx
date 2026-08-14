import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@saasfly/ui";
import { AnimatedGradientText } from "@saasfly/ui/animated-gradient-text";

export function DocumentGuide({ children }: { children: ReactNode }) {
  return (
    <AnimatedGradientText>
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
        MyBizAI
      </span>
      <hr className="mx-2 h-4 w-px shrink-0 bg-border" />
      <span
        className={cn(
          `animate-gradient inline bg-gradient-to-r from-brand-orange via-brand-gold to-brand-orange bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        )}
      >
        {children}
      </span>
      <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </AnimatedGradientText>
  );
}
