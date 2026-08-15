import { getCurrentUser } from "@saasfly/auth";

import { DashboardChrome } from "~/components/dashboard-chrome";
import { i18n, type Locale } from "~/config/i18n-config";
import { getDashboardConfig } from "~/config/ui/dashboard";
import { getDictionary } from "~/lib/get-dictionary";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function DashboardLayout({
  children,
  params: { lang },
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const dict = await getDictionary(lang);
  const dashboardConfig = await getDashboardConfig({ params: { lang } });

  return (
    <DashboardChrome
      lang={lang}
      dict={{ dropdown: dict.dropdown, common: dict.common }}
      mainNav={dashboardConfig.mainNav}
      sidebarNav={dashboardConfig.sidebarNav}
      serverUser={
        user
          ? { name: user.name, image: user.image, email: user.email }
          : undefined
      }
    >
      {children}
    </DashboardChrome>
  );
}
