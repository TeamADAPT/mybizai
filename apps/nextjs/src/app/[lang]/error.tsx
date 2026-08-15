"use client";

import { useParams } from "next/navigation";

import { BrandErrorPanel } from "~/components/brand-error-panel";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "en";

  return (
    <BrandErrorPanel
      lang={lang}
      title="This page stumbled"
      detail="MyBizAI hit an unexpected error on this route. Retry, or return home."
      onRetry={reset}
    />
  );
}
