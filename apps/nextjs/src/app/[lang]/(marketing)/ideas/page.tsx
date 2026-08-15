import { IdeasBuilder } from "~/components/ideas-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Ideas",
  description: "MyBizAI interactive idea generation",
};

export default function IdeasPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <IdeasBuilder lang={lang} />;
}
