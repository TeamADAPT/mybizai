import { StudioModule } from "~/components/studio-module";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Market research",
  description: "MyBizAI market research studio",
};

export default function ResearchPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <StudioModule
      lang={lang}
      eyebrow="Studio · Research"
      title="Market research insights"
      lead="Competitive maps and demand signals, distilled for decision — not dashboards for their own sake."
      shellModule="research"
      metrics={[
        { label: "Total market", value: "$500M" },
        { label: "Growth YoY", value: "15%" },
        { label: "Confidence", value: "High" },
      ]}
      insights={[
        {
          title: "Coastal SMB logistics heat",
          body: "Whitespace sits between agency retainers and generic SaaS — operators want execution with a personal touch.",
        },
        {
          title: "Competitor posture",
          body: "Most tools stop at planning. ADAPT differentiates by approving and running the plan inside one cobalt workspace.",
        },
        {
          title: "Next deepen",
          body: "Prompt the shell to expand any segment cell into TAM / SAM / SOM with agent citations.",
        },
      ]}
      prompt="Deepen competitor whitespace for agency vs SaaS and return three GTM bets."
    />
  );
}
