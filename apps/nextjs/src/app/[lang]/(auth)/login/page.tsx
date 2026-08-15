import { BrandAuthFrame } from "~/components/brand-auth-frame";
import { UserAuthForm } from "~/components/user-auth-form";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
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
      subtitle={dict.login.signin_title}
      backHref={`/${lang}`}
      backLabel={dict.login.back}
    >
      <UserAuthForm lang={lang} dict={dict.login} />
    </BrandAuthFrame>
  );
}
