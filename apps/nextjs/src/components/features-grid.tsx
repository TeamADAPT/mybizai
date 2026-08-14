import * as Icons from "@saasfly/ui/icons";

export function FeaturesGrid({
  dict,
}: {
  dict: Record<string, string> | undefined;
}) {
  const items = [
    {
      title: dict?.monorepo_title,
      desc: dict?.monorepo_desc,
      icon: Icons.Blocks,
    },
    {
      title: dict?.i18n_title,
      desc: dict?.i18n_desc,
      icon: Icons.Languages,
    },
    {
      title: dict?.payments_title,
      desc: dict?.payments_desc,
      icon: Icons.Billing,
    },
    {
      title: dict?.nextauth_title,
      desc: dict?.nextauth_desc,
      icon: Icons.ShieldCheck,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-border bg-card/40 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cobalt/20">
              <item.icon className="h-5 w-5 text-brand-orange" />
            </div>
            <h3 className="font-display text-lg tracking-tight text-foreground">
              {item.title}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
