import Balancer from "react-wrap-balancer";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@saasfly/ui/accordion";

import type { Locale } from "~/config/i18n-config";
import { priceFaqDataMap } from "~/config/price/price-faq-data";

export function PricingFaq({
  params: { lang },
  dict,
}: {
  params: {
    lang: Locale;
  };
  dict: Record<string, string>;
}) {
  const pricingFaqData = priceFaqDataMap[lang];
  return (
    <section className="container max-w-3xl py-12 md:py-16">
      <div className="mb-10 space-y-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Access details
        </p>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          <Balancer>{dict.faq}</Balancer>
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          <Balancer>{dict.faq_detail}</Balancer>
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full border-t border-border">
        {pricingFaqData?.map((faqItem) => (
          <AccordionItem
            key={faqItem.id}
            value={faqItem.id}
            className="border-b border-border"
          >
            <AccordionTrigger className="text-left font-medium hover:text-brand-orange hover:no-underline">
              {faqItem.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
