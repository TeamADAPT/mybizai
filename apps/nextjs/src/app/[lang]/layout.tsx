"use client";

import { Suspense } from "react";

import { VoiceRuntimeProvider } from "~/components/voice-runtime";

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <VoiceRuntimeProvider>{children}</VoiceRuntimeProvider>
    </Suspense>
  );
}
