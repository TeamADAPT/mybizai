import { StudioModule } from "~/components/studio-module";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Financial projections",
  description: "MyBizAI finance studio",
};

export default function FinancePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <StudioModule
      lang={lang}
      eyebrow="Studio · Finance"
      title="Financial projections"
      lead="Scenario runs with intervention points — you stay above the math while ADAPT stress-tests burn and runway."
      shellModule="finance"
      metrics={[
        { label: "Runway", value: "14 mo" },
        { label: "Monthly burn", value: "$48k" },
        { label: "Scenario", value: "Base" },
      ]}
      insights={[
        {
          title: "Base case",
          body: "Private-access ARR ramps with controlled agent cost lines. Cash stays above the intervention threshold.",
        },
        {
          title: "Stretch case",
          body: "Marketing spend +20% and agent concurrency +15%. Useful for investor conversations, not default ops.",
        },
        {
          title: "Conservative case",
          body: "Freeze new ventures, keep brand-kit and research agents warm. Protects runway without killing momentum.",
        },
      ]}
      prompt="Show stretch scenario with agent costs +15% and highlight cash intervention points."
    />
  );
}
