"use client";

import { SignInClerkModal } from "~/components/sign-in-modal-clerk";
import { useMounted } from "~/hooks/use-mounted";
import { hasClerkConfigured } from "~/lib/clerk-config";

export const ModalProvider = ({ dict }: { dict: Record<string, string> }) => {
  const mounted = useMounted();

  if (!mounted || !hasClerkConfigured()) {
    return null;
  }

  return <SignInClerkModal dict={dict} />;
};
