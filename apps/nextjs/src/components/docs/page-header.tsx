import { cn } from "@saasfly/ui";

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
}

export function DocsPageHeader({
  heading,
  text,
  className,
  ...props
}: DocsPageHeaderProps) {
  return (
    <>
      <div className={cn("space-y-3", className)} {...props}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Docs
        </p>
        <h1 className="inline-block font-display text-4xl tracking-tight lg:text-5xl">
          {heading}
        </h1>
        {text ? (
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {text}
          </p>
        ) : null}
      </div>
      <hr className="my-6 border-border" />
    </>
  );
}
