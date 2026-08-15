import { VoiceImmersive } from "~/components/voice-immersive";
import { VoiceAgent } from "~/components/voice-agent";
import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

export const metadata = {
  title: "Voice",
  description:
    "Talk with MyBizAI — turn an idea into a business without forms or dashboards.",
};

export default function VoicePage({
  params: { lang },
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { studio?: string };
}) {
  if (searchParams?.studio === "1") {
    return (
      <StudioBuilderChrome
        lang={lang}
        eyebrow="Studio · Voice · xAI"
        title="ADAPT voice agent"
        lead="Operator studio with provider switches and build handoff controls."
        shellModule="dashboard"
      >
        <VoiceAgent />
      </StudioBuilderChrome>
    );
  }

  return <VoiceImmersive lang={lang} />;
}
