"use client";

import Link from "next/link";
import Image from "next/image";

import { ContainerScroll } from "@saasfly/ui/container-scroll-animation";

export function VideoScroll({
  dict,
  lang = "en",
}: {
  dict: Record<string, string> | undefined;
  lang?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="font-display text-4xl font-normal tracking-tight text-foreground">
              {dict?.first_text}
              <br />
              <span className="mt-1 text-4xl leading-none md:text-6xl">
                {dict?.second_text1}
                <span className="text-brand-orange">
                  {dict?.time_text ?? "private access"}
                </span>
                {dict?.second_text2}
              </span>
            </h1>
          </>
        }
      >
        <Link href={`/${lang}/shell`}>
          <Image
            src="/images/brand/mybizai-mark.svg"
            alt="MyBizAI product shell"
            height={720}
            width={1400}
            className="mx-auto h-full rounded-2xl border border-brand-gold/30 bg-brand-ink object-contain object-center p-16"
            draggable={false}
          />
        </Link>
      </ContainerScroll>
    </div>
  );
}
