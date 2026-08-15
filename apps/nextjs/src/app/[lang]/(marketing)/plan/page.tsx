import { StudioModule } from "~/components/studio-module";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Business plan",
  description: "MyBizAI business plan studio",
};

export default function PlanPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <StudioModule
      lang={lang}
      eyebrow="Studio · Plan"
      title="Business plan editor"
      lead="Narrative + milestones in one place. ADAPT drafts; you approve sections before they become ventures."
      shellModule="businesses"
      metrics={[
        { label: "Sections", value: "7" },
        { label: "Ready", value: "4" },
        { label: "Needs you", value: "2" },
      ]}
      insights={[
        {
          title: "Vision locked",
          body: "Mission and Fifth Avenue positioning are approved. Tagline and offer still await operator notes.",
        },
        {
          title: "Go-to-market draft",
          body: "Research and campaign studios feed this section — open them when the plan needs fresh signal.",
        },
        {
          title: "Venture handoff",
          body: "When the plan is green, spin a workspace from the shell Businesses module.",
        },
      ]}
      prompt="Draft the competitive section using the latest research whitespace notes."
    />
  );
}
