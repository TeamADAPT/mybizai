import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import type { DashboardConfig } from "~/types";

export const getDashboardConfig = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}): Promise<DashboardConfig> => {
  const dict = await getDictionary(lang);

  return {
    mainNav: [
      {
        title: dict.common.dashboard.main_nav_documentation,
        href: "/design",
      },
      {
        title: "Shell",
        href: "/shell",
      },
      {
        title: "Brand kit",
        href: "/brand-kit",
      },
    ],
    sidebarNav: [
      {
        id: "overview",
        title: dict.common.dashboard.sidebar_nav_modules,
        href: "/dashboard/",
      },
      {
        id: "ventures",
        title: "Ventures",
        href: "/ventures",
      },
      {
        id: "brand",
        title: "Brand kit",
        href: "/brand-kit",
      },
      {
        id: "research",
        title: "Research",
        href: "/research",
      },
      {
        id: "billing",
        title: dict.common.dashboard.sidebar_nav_billing,
        href: "/dashboard/billing",
      },
      {
        id: "settings",
        title: dict.common.dashboard.sidebar_nav_settings,
        href: "/dashboard/settings",
      },
    ],
  };
};
