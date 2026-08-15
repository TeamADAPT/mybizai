import { cn } from "@saasfly/ui";
import Marquee from "@saasfly/ui/marquee";

const reviews = [
  {
    name: "Elena",
    username: "@elena",
    body: "Finally an AI that feels like a Fifth Avenue agency — not another chatbot.",
    img: "https://avatar.vercel.sh/elena",
  },
  {
    name: "Marcus",
    username: "@marcus",
    body: "Brainstorm to execute without losing the brand voice. That was the missing piece.",
    img: "https://avatar.vercel.sh/marcus",
  },
  {
    name: "Priya",
    username: "@priya",
    body: "The assist dock keeps me in control while agents actually ship the work.",
    img: "https://avatar.vercel.sh/priya",
  },
  {
    name: "James",
    username: "@james",
    body: "Cobalt, orange, gold — the product looks as intentional as the outcomes.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Sofia",
    username: "@sofia",
    body: "Private access tone throughout. Feels exclusive without being closed off.",
    img: "https://avatar.vercel.sh/sofia",
  },
  {
    name: "Noah",
    username: "@noah",
    body: "We replaced three agencies with one ADAPT loop. Personal touch, autonomous scale.",
    img: "https://avatar.vercel.sh/noah",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border border-border bg-card/50 p-4 transition hover:border-brand-gold/40",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-muted-foreground">{body}</blockquote>
    </figure>
  );
};

const Comments = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg py-4">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/*
        Edge fades must use hsl(... / 0), not Tailwind from-background.
        Our theme maps background without <alpha-value>, so from-background
        rendered as solid slabs and hid the marquee on mobile.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 md:w-28"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 md:w-28"
        style={{
          background:
            "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0) 100%)",
        }}
      />
    </div>
  );
};

export { Comments };
