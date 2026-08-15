"use client";

import React, { useState } from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { BrandLogo } from "~/components/brand-logo";
import { Modal } from "~/components/modal";
import { siteConfig } from "~/config/site";
import { useSigninModal } from "~/hooks/use-signin-modal";

export const SignInClerkModal = ({ dict }: { dict: Record<string, string> }) => {
  const signInModal = useSigninModal();
  const [signInClicked, setSignInClicked] = useState(false);
  const { signIn } = useSignIn();

  if (!signIn) {
    return null;
  }

  const signInWith = (strategy: OAuthStrategy) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const lang = window.location.pathname.split("/")[1] || "en";
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: `/${lang}/login-clerk/sso-callback`,
        redirectUrlComplete: `${protocol}//${host}/${lang}/dashboard`,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full overflow-hidden rounded-2xl border border-brand-gold/30">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-border bg-brand-ink/80 px-4 py-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <BrandLogo showWordmark size="md" />
          </a>
          <h3 className="font-display text-2xl tracking-tight">{dict.signup}</h3>
          <p className="text-sm text-muted-foreground">{dict.privacy}</p>
        </div>

        <div className="flex flex-col space-y-4 bg-background px-4 py-8 md:px-16">
          <Button
            className="rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              void signInWith("oauth_github").then(() => {
                setTimeout(() => {
                  signInModal.onClose();
                }, 1000);
              });
            }}
          >
            {signInClicked ? (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.GitHub className="mr-2 h-4 w-4" />
            )}{" "}
            {dict.signup_github}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
