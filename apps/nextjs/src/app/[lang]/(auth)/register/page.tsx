import Link from "next/link";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

import { BrandLogo } from "~/components/brand-logo";
import { UserAuthForm } from "~/components/user-auth-form";
import { brand } from "~/config/brand";
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
    <div className="container flex min-h-screen flex-col items-center justify-center py-16">
      <Link
        href={`/${lang}/login-clerk`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 text-muted-foreground md:right-8 md:top-8",
        )}
      >
        {dict.marketing.login}
      </Link>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6 rounded-2xl border border-brand-gold/30 bg-brand-ink/50 p-8 backdrop-blur">
        <div className="flex flex-col items-center space-y-3 text-center">
          <BrandLogo href={`/${lang}`} size="md" />
          <h1 className="font-display text-3xl tracking-tight">
            Request access
          </h1>
          <p className="text-sm text-muted-foreground">
            {brand.parent} · enter your email to begin
          </p>
        </div>
        <UserAuthForm lang={lang} dict={dict.login} disabled={true} />
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
      </div>
    </div>
  );
}
