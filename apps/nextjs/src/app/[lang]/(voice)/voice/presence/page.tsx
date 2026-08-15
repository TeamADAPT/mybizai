import { VoiceImmersive } from "~/components/voice-immersive";

export const metadata = {
  title: "Voice presence",
  description:
    "Calm MyBizAI presence — talk an idea into a business without forms.",
};

export default function VoicePresencePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return <VoiceImmersive lang={lang} />;
}
