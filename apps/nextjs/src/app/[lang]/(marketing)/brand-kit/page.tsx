import { BrandIdentityKit } from "~/components/brand-identity-kit";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Brand Identity Kit",
  description: "Build a cohesive MyBizAI brand system",
};

export default function BrandKitPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh] py-14">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10">
        <BrandIdentityKit lang={lang} />
      </div>
    </div>
  );
}
