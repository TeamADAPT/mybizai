import { StudioModule } from "~/components/studio-module";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Campaign architect",
  description: "MyBizAI marketing campaign studio",
};

export default function CampaignsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <StudioModule
      lang={lang}
      eyebrow="Studio · Campaigns"
      title="Campaign architect"
      lead="Multi-channel plans that execute after you approve the brief — LinkedIn, email, and landing in one loop."
      shellModule="marketing"
      metrics={[
        { label: "Channels", value: "3" },
        { label: "Budget", value: "$12k" },
        { label: "Status", value: "Draft" },
      ]}
      insights={[
        {
          title: "Private-access launch sequence",
          body: "Warm list → gold-border invite → shell preview. Tone stays Fifth Avenue, never generic SaaS blast.",
        },
        {
          title: "Channel sync",
          body: "Landing, email, and LinkedIn share one creative system from the brand kit export.",
        },
        {
          title: "Approval gate",
          body: "Nothing spends until an operator taps Approve in the product shell.",
        },
      ]}
      prompt="Increase social ad budget 20% and re-run the logistics campaign with brand-kit voice."
    />
  );
}
