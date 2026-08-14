import { BasicItemSkeleton } from "~/components/base-item";
import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Operator overview"
        text="Loading access queue…"
      />
      <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-brand-gold/20">
        <BasicItemSkeleton />
        <BasicItemSkeleton />
        <BasicItemSkeleton />
      </div>
    </DashboardShell>
  );
}
