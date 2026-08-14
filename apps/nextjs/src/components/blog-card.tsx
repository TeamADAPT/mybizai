import { FollowerPointerCard } from "@saasfly/ui/following-pointer";

export function XBlogArticle() {
  return (
    <div className="w-80">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={blogContent.author}
            avatar={blogContent.authorAvatar}
          />
        }
      >
        <div className="group relative h-full overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-ink/70 transition duration-200 hover:border-brand-orange/50">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-cobalt/20">
            <img
              src={blogContent.image}
              alt="thumbnail"
              className="h-full w-full transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl"
            />
          </div>
          <div className="p-4">
            <h2 className="my-4 font-display text-lg tracking-tight text-foreground">
              {blogContent.title}
            </h2>
            <p className="my-4 text-sm text-muted-foreground">
              {blogContent.description}
            </p>
            <div className="mt-10 flex flex-row items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {blogContent.date}
              </span>
              <div className="relative z-10 block rounded-full bg-brand-orange px-6 py-2 text-xs font-bold text-brand-midnight">
                Read more
              </div>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const blogContent = {
  slug: "brand-to-execute",
  author: "MyBizAI",
  date: "14 Aug, 2026",
  title: "Brainstorm to execute without losing the brand",
  description:
    "How ADAPT keeps Fifth Avenue voice intact while agents ship the work.",
  image: "/images/brand/mybizai-mark.svg",
  authorAvatar: "/images/brand/mybizai-mark.svg",
};

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2">
    <img
      src={avatar}
      height="20"
      width="20"
      alt=""
      className="rounded-full border border-brand-gold/40"
    />
    <p>{title}</p>
  </div>
);
