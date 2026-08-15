import { getCurrentUser } from "@saasfly/auth";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { UserNameForm } from "~/components/user-name-form";
import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Settings",
  description: "Manage account and workspace settings.",
};

export default async function SettingsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text={`Operator profile for ${brand.name} · ${brand.parent}`}
      />
      <div className="mt-8 grid gap-6">
        {user ? (
          <UserNameForm user={{ id: user.id, name: user.name ?? "" }} />
        ) : (
          <div className="rounded-2xl border border-brand-gold/25 bg-brand-ink/40 p-6">
            <p className="text-sm text-muted-foreground">
              Profile details sync once the Clerk server session is available.
              You can still use Sign out from the avatar menu.
            </p>
          </div>
        )}
        <div className="rounded-2xl border border-brand-gold/25 bg-brand-ink/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">
            Workspace
          </p>
          <p className="mt-2 font-display text-2xl tracking-tight">
            Private access
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Theme follows system preference via the header switch. Locale:{" "}
            {lang}.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
