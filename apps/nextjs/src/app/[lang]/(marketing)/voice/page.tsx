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
      lead="Voice stays conversational (xAI or browser). Coding asks get queued for Grok Build — your subscription covers implementation, not the Voice API."
      shellModule="dashboard"
    >
      <VoiceAgent />
    </StudioBuilderChrome>
  );
}
