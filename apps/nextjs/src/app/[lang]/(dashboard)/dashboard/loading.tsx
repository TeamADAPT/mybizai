import { BrandProcessScreen } from "~/components/brand-process-screen";

export default function DashboardLoading() {
  return (
    <BrandProcessScreen
      title="Loading workspace"
      detail="Gathering agents, approvals, and growth signals."
      tip="Overview metrics refresh when ADAPT is connected."
      progress={55}
    />
  );
}
