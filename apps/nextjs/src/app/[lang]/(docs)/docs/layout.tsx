import { DocsSearch } from "~/components/docs/search";
import { DocsSidebarNav } from "~/components/docs/sidebar-nav";
import type { Locale } from "~/config/i18n-config";
import { getDocsConfig } from "~/config/ui/docs";

export default function DocsLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  return (
    <div className="flex-1 md:grid md:grid-cols-[240px_1fr] md:gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border py-6 pr-3 md:sticky md:block lg:py-8">
        <div className="mb-6 px-1">
          <DocsSearch lang={lang} />
        </div>
        <div className="rounded-2xl border border-brand-gold/20 bg-brand-ink/40 p-3">
          <DocsSidebarNav items={getDocsConfig(`${lang}`).sidebarNav} />
        </div>
      </aside>
      {children}
    </div>
  );
}
