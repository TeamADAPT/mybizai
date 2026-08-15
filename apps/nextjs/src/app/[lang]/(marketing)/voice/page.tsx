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
      lead="Talk the core loop with swappable voice — xAI grok-voice or browser speech. Assist brain defaults to grok-4.6 when XAI_API_KEY is set. Grok Build stays on the coding side; this is the product surface."
      shellModule="dashboard"
    >
      <VoiceAgent />
    </StudioBuilderChrome>
  );
}
