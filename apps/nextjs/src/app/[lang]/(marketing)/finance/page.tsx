import { FinanceBuilder } from "~/components/finance-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Financial projections",
  description: "MyBizAI interactive finance builder",
};

export default function FinancePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <FinanceBuilder lang={lang} />;
}
