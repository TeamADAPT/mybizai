import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import type { MarketingConfig } from "~/types";

export const getMarketingConfig = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}): Promise<MarketingConfig> => {
  const dict = await getDictionary(lang);
  return {
    mainNav: [
      {
        title: dict.marketing.main_nav_features,
        href: `/#approach`,
      },
      {
        title: dict.marketing.main_nav_products,
        href: `/shell`,
      },
      {
        title: dict.marketing.main_nav_pricing,
        href: `/pricing`,
      },
      {
        title: dict.marketing.main_nav_blog,
        href: `/brand-kit`,
      },
      {
        title: dict.marketing.main_nav_documentation,
        href: `/design`,
      },
    ],
  };
};
