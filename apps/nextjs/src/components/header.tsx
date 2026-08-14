interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-1">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          {heading}
        </h1>
        {text ? <p className="text-sm text-muted-foreground md:text-base">{text}</p> : null}
      </div>
      {children}
    </div>
  );
}
