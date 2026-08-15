import { ResearchBuilder } from "~/components/research-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Market research",
  description: "MyBizAI interactive market research builder",
};

export default function ResearchPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <ResearchBuilder lang={lang} />;
}
