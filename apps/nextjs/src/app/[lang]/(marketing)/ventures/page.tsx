import { VenturesBuilder } from "~/components/ventures-builder";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Ventures",
  description: "MyBizAI ventures — create, pause, and archive workspaces",
};

export default function VenturesPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <VenturesBuilder lang={lang} />;
}
