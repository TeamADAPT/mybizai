import { ProductShell } from "~/components/product-shell";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Product Shell",
  description: "MyBizAI interactive product shell wireframe",
};

export default function ProductShellPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh] py-10">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 space-y-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
            Wireframe · interactive
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            Product shell
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Dark-first chrome from the design foundation — left rail modules,
            canvas, theme, and AI assist dock. Click modules to switch context.
          </p>
        </div>
        <ProductShell lang={lang} />
      </div>
    </div>
  );
}
