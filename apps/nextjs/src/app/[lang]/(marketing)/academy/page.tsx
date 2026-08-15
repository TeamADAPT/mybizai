import Link from "next/link";

import { Button } from "@saasfly/ui/button";

import { brand } from "~/config/brand";
import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Academy",
  description: "MyBizAI operator academy",
};

const courses = [
  {
    title: "Agency loop in 20 minutes",
    level: "Start here",
    body: "Brainstorm → architect → execute without losing Fifth Avenue tone.",
    href: "playbook",
  },
  {
    title: "Lock your brand kit",
    level: "Brand",
    body: "Cobalt, orange, gold, Instrument Serif, and export JSON for ventures.",
    href: "brand-kit",
  },
  {
    title: "Drive the product shell",
    level: "Shell",
    body: "Modules, Approve, and assist-dock prompts that actually change state.",
    href: "shell",
  },
  {
    title: "Research to campaign",
    level: "GTM",
    body: "Turn whitespace notes into a brief the campaign architect can run.",
    href: "research",
  },
  {
    title: "Finance scenarios",
    level: "Ops",
    body: "Base / stretch / conservative with cash intervention points.",
    href: "finance",
  },
  {
    title: "Marketplace skills",
    level: "Agents",
    body: "Install the right ADAPT skills for a venture — not a plugin aisle.",
    href: "marketplace",
  },
];

export default function AcademyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative min-h-[80vh] py-14">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="container relative z-10 mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Studio · Academy
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
          Operator academy
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Short paths into MyBizAI — platform craft plus the business skills
          ADAPT expects you to stay above.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="flex flex-col rounded-2xl border border-brand-gold/20 bg-card/80 p-5 dark:bg-brand-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-orange">
                {course.level}
              </p>
              <h2 className="mt-2 font-display text-xl tracking-tight">
                {course.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {course.body}
              </p>
              <Link href={`/${lang}/${course.href}`} className="mt-5">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                >
                  Open lesson
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          {brand.parent} · academy stub — expand with full curricula next
        </p>
      </div>
    </div>
  );
}
