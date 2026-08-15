import type { Metadata } from "next";

import { BrandAuthFrame } from "~/components/brand-auth-frame";
import { UserClerkAuthForm } from "~/components/user-clerk-auth-form";
import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata: Metadata = {
  title: "Private access",
  description: "Sign in to MyBizAI",
};

export default async function LoginPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  return (
    <BrandAuthFrame
      lang={lang}
      title={dict.login.welcome_back}
      subtitle={brand.tagline}
      backHref={`/${lang}`}
      backLabel={dict.login.back}
    >
      <UserClerkAuthForm lang={lang} dict={dict.login} />
    </BrandAuthFrame>
  );
}
