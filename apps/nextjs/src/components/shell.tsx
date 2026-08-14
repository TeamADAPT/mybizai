import * as React from "react";

import { cn } from "@saasfly/ui";

export function DashboardShell(props: {
  title?: string;
  description?: React.ReactNode;
  breadcrumb?: boolean;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      {(props.title || props.description || props.headerAction) && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {props.title ? (
              <h1 className="font-display text-3xl tracking-tight md:text-4xl">
                {props.title}
              </h1>
            ) : null}
            {typeof props.description === "string" ? (
              <p className="text-sm text-muted-foreground md:text-base">
                {props.description}
              </p>
            ) : (
              props.description
            )}
          </div>
          {props.headerAction}
        </div>
      )}
      <div className={cn(props.className)}>{props.children}</div>
    </div>
  );
}
