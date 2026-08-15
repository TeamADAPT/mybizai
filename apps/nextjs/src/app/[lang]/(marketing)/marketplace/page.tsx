import { MarketplaceBuilder } from "~/components/marketplace-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Agent marketplace",
  description: "MyBizAI interactive agent marketplace",
};

export default function MarketplacePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <MarketplaceBuilder lang={lang} />;
}
