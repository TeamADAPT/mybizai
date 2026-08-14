import React, { type CSSProperties } from "react";

import { cn } from "@saasfly/ui";

interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = ({
  shimmerColor = "#ff8c00",
  shimmerSize = "0.1em",
  shimmerDuration = "1.5s",
  borderRadius = "100px",
  background = "radial-gradient(ellipse 80% 50% at 50% 120%,rgba(18,10,143,0.95),rgba(7,11,24,1))",
  className,
  children,
  ...props
}: ShimmerButtonProps) => {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as CSSProperties
      }
      className={cn(
        "group relative flex cursor-pointer overflow-hidden whitespace-nowrap px-6 py-4 text-white [background:var(--bg)] [border-radius:var(--radius)]",
        "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(255,140,0,0.35)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-visible [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none] ">
          <div className="absolute inset-[-100%] w-auto rotate-0 animate-spinLinear [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      {children}
    </button>
  );
};

export default ShimmerButton;
