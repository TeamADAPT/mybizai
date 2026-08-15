import Link from "next/link";

import { VoiceAgent } from "~/components/voice-agent";
import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

export const metadata = {
  title: "Voice agent",
  description: "MyBizAI ADAPT voice — operator studio (main).",
};

export default function VoicePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return (
    <StudioBuilderChrome
      lang={lang}
      eyebrow="Studio · Voice · xAI"
      title="ADAPT voice agent"
      lead="Operator studio with provider switches and build handoff. Presence mode is the calm founder surface."
      shellModule="dashboard"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Main voice studio — keep this as the working surface for operators.
        </p>
        <Link
          href={`/${lang}/voice/presence`}
          className="rounded-full border border-brand-gold/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold transition hover:bg-brand-gold/10"
        >
          Open presence
        </Link>
      </div>
      <VoiceAgent />
    </StudioBuilderChrome>
  );
}
