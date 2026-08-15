import { VoiceAgent } from "~/components/voice-agent";
import { StudioBuilderChrome } from "~/components/studio-builder-chrome";

export const metadata = {
  title: "Voice agent",
  description: "MyBizAI ADAPT voice powered by xAI grok-voice",
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
      lead="Talk the core loop with Grok voice — ephemeral browser tokens, API key stays on Railway. Text assist uses grok-4.6."
      shellModule="dashboard"
    >
      <VoiceAgent />
    </StudioBuilderChrome>
  );
}
