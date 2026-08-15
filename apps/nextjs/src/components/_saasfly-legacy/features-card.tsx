"use client";

import { cn } from "@saasfly/ui";
import { AnimatedList } from "@saasfly/ui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Plan approved",
    description: "Logistics campaign brief",
    time: "2m ago",
    icon: "A",
    color: "#ff8c00",
  },
  {
    name: "Agent needs guidance",
    description: "Inventory routing · assist dock",
    time: "5m ago",
    icon: "G",
    color: "#120a8f",
  },
  {
    name: "Brand kit exported",
    description: "Cobalt · orange · gold JSON",
    time: "12m ago",
    icon: "B",
    color: "#d4af37",
  },
  {
    name: "Private access request",
    description: "Fifth Avenue walkthrough queued",
    time: "18m ago",
    icon: "P",
    color: "#3b2fd4",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/50 p-4 transition hover:border-brand-gold/40",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-sm font-medium text-foreground">
            <span>{name}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </figcaption>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </figure>
  );
};

export function FeaturesCard() {
  return (
    <div className="relative flex max-h-[435px] min-h-[435px] flex-col overflow-hidden rounded-2xl border border-border bg-brand-ink/40 p-6">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
