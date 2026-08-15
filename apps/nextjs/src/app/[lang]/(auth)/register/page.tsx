import Link from "next/link";

import { BrandAuthFrame } from "~/components/brand-auth-frame";
import { UserAuthForm } from "~/components/user-auth-form";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
  title: "Request access",
  description: "Create your MyBizAI account",
};

export default async function RegisterPage({
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
      title="Request access"
      subtitle="enter your email to begin"
      cornerHref={`/${lang}/login-clerk`}
      cornerLabel={dict.marketing.login}
      spinLogo={false}
      footer={
        <p className="px-4 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link
            href={`/${lang}/terms`}
            className="underline underline-offset-4 hover:text-brand-orange"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href={`/${lang}/privacy`}
            className="underline underline-offset-4 hover:text-brand-orange"
          >
            Privacy
          </Link>
          .
        </p>
      }
    >
      <UserAuthForm lang={lang} dict={dict.login} disabled={true} />
    </BrandAuthFrame>
  );
}
