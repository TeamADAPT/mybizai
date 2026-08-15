import { BrandProcessScreen } from "~/components/brand-process-screen";

export default function MarketingLoading() {
  return (
    <BrandProcessScreen
      title="Loading MyBizAI"
      detail="Pulling the next marketing surface into focus."
      tip="Fifth Avenue pacing — intentional, never rushed."
      progress={42}
    />
  );
}
