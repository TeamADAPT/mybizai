import Image from "next/image";
import Link from "next/link";

import { cn } from "@saasfly/ui";

import { brand } from "~/config/brand";

type BrandLogoProps = {
  href?: string;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  spin?: boolean;
};

const sizes = {
  sm: { mark: 28, text: "text-lg" },
  md: { mark: 36, text: "text-2xl" },
  lg: { mark: 48, text: "text-3xl" },
} as const;

export function BrandLogo({
  href,
  className,
  markClassName,
  showWordmark = true,
  size = "md",
  spin = false,
}: BrandLogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/images/brand/mybizai-mark.svg"
        alt=""
        width={s.mark}
        height={s.mark}
        className={cn(
          "shrink-0 drop-shadow-sm",
          spin && "animate-mark-spin",
          markClassName,
        )}
        priority
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-display tracking-tight text-foreground",
            s.text,
          )}
        >
          {brand.name}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
      {content}
    </Link>
  );
}
