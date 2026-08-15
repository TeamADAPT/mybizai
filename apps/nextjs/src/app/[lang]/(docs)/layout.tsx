import { Suspense } from "react";

import { getCurrentUser } from "@saasfly/auth";

import { NavBar } from "~/components/navbar";
import { SiteFooter } from "~/components/site-footer";
import type { Locale } from "~/config/i18n-config";
import { getMarketingConfig } from "~/config/ui/marketing";
import { getDictionary } from "~/lib/get-dictionary";

interface DocsLayoutProps {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export default async function DocsLayout({
  children,
  params: { lang },
}: DocsLayoutProps) {
  const dict = await getDictionary(lang);
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-30" />
      <Suspense
        fallback={
          <div className="flex h-16 items-center border-b border-border px-4 text-sm text-muted-foreground">
            Loading…
          </div>
        }
      >
        <NavBar
          items={
            (await getMarketingConfig({ params: { lang: `${lang}` } })).mainNav
          }
          params={{ lang: `${lang}` }}
          scroll={true}
          user={user}
          marketing={dict.marketing}
          dropdown={dict.dropdown}
        />
      </Suspense>
      <div className="container relative z-10 flex-1 py-6">{children}</div>
      <SiteFooter
        className="relative z-10 border-t border-border"
        params={{ lang: `${lang}` }}
        dict={dict.common}
      />
    </div>
  );
}
