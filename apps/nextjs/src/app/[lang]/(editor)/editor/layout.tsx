import { notFound } from "next/navigation";

import { getCurrentUser } from "@saasfly/auth";

import { MainNav } from "~/components/main-nav";
import { DashboardNav } from "~/components/nav";
import { SiteFooter } from "~/components/site-footer";
import { ThemeSwitch } from "~/components/theme-switch";
import { UserAccountNav } from "~/components/user-account-nav";
import type { Locale } from "~/config/i18n-config";
import { getDashboardConfig } from "~/config/ui/dashboard";
import { getDictionary } from "~/lib/get-dictionary";

interface EditLayoutProps {
  children?: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export default async function DashboardLayout({
  children,
  params: { lang },
}: EditLayoutProps) {
  const user = await getCurrentUser();
  const dict = await getDictionary(lang);

  const dashboardConfig = await getDashboardConfig({ params: { lang } });
  if (!user) {
    return notFound();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash opacity-40" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav
            items={dashboardConfig.mainNav}
            params={{ lang: `${lang}` }}
          />
          <div className="flex items-center space-x-3">
            <ThemeSwitch />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
              params={{ lang: `${lang}` }}
              dict={dict.dropdown}
            />
          </div>
        </div>
      </header>
      <div className="container relative z-10 grid flex-1 gap-8 py-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden w-[220px] flex-col md:flex">
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-ink/40 p-3">
            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
              Editor
            </p>
            <DashboardNav
              items={dashboardConfig.sidebarNav}
              params={{ lang: `${lang}` }}
            />
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter
        className="relative z-10 border-t border-border"
        params={{ lang: `${lang}` }}
        dict={dict.common}
      />
    </div>
  );
}
