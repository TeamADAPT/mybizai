import { BrandLogo } from "~/components/brand-logo";

type BrandProcessScreenProps = {
  title?: string;
  detail?: string;
  tip?: string;
  progress?: number;
};

/**
 * Branded loading / processing surface (inspired by mocks/mybizai_loading_screen).
 */
export function BrandProcessScreen({
  title = "Preparing your workspace",
  detail = "ADAPT is assembling the next surface.",
  tip = "Keep this window open — agents work best when you stay nearby.",
  progress = 48,
}: BrandProcessScreenProps) {
  const width = Math.min(100, Math.max(8, progress));

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-60" />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center">
          <BrandLogo size="lg" spin />
        </div>
        <div className="mt-8 rounded-2xl border border-brand-gold/25 bg-card/80 p-8 backdrop-blur dark:bg-brand-ink/50">
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
          <div className="relative mt-6 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand-orange transition-[width] duration-700"
              style={{ width: `${width}%` }}
            />
            <div className="brand-shimmer absolute inset-0" />
          </div>
          <p className="mt-6 rounded-xl bg-muted/60 px-4 py-3 text-left text-sm text-muted-foreground">
            {tip}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold/80">
            Processing
          </p>
        </div>
      </div>
    </div>
  );
}
