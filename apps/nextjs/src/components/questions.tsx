import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@saasfly/ui/accordion";

export function Questions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-border">
        <AccordionTrigger className="hover:text-brand-orange hover:no-underline">
          About MyBizAI
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          MyBizAI is the autonomous business architect from Fifth Avenue
          Intelligence Group. Brainstorm, Architect, and Execute with ADAPT
          agents — you stay in control while the platform ships.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-border">
        <AccordionTrigger className="hover:text-brand-orange hover:no-underline">
          What is ADAPT?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          ADAPT is the multi-agent operating system behind the platform —
          specialists coordinate research, brand, marketing, and finance so
          delivery stays coherent under pressure.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-border">
        <AccordionTrigger className="hover:text-brand-orange hover:no-underline">
          Who is private access for?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Operators who want Fifth Avenue standards without agency overhead —
          founders and teams that need autonomous execution with a personal
          touch. Request access to schedule a walkthrough.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
