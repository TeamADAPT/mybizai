import type { Metadata } from "next";
import Link from "next/link";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
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
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-16">
      <Link
        href={`/${lang}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 text-muted-foreground md:left-8 md:top-8",
        )}
      >
        <Icons.ChevronLeft className="mr-2 h-4 w-4" />
        {dict.login.back}
      </Link>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8 rounded-2xl border border-brand-gold/30 bg-brand-ink/50 p-8 backdrop-blur">
        <div className="flex flex-col items-center space-y-3 text-center">
          <BrandLogo href={`/${lang}`} size="md" spin />
          <h1 className="font-display text-3xl tracking-tight">
            {dict.login.welcome_back}
          </h1>
          <p className="text-sm text-muted-foreground">
            {brand.parent} · {brand.tagline}
          </p>
        </div>
        <UserClerkAuthForm lang={lang} dict={dict.login} />
      </div>
    </div>
  );
}
