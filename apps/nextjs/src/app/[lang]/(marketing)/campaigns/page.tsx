import { CampaignBuilder } from "~/components/campaign-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Campaign architect",
  description: "MyBizAI interactive campaign builder",
};

export default function CampaignsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <CampaignBuilder lang={lang} />;
}
