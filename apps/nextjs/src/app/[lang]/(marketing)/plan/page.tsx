import { PlanBuilder } from "~/components/plan-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Business plan",
  description: "MyBizAI interactive business plan builder",
};

export default function PlanPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <PlanBuilder lang={lang} />;
}
