import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { formatDate } from "~/lib/utils";

interface Post {
  _id: string;
  title: string;
  description?: string;
  date: string;
  published: boolean;
  image: string;
  authors: string[];
  slug: string;
}

interface BlogPostsProps {
  posts: Post[];
}

export function BlogPosts({ posts }: BlogPostsProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <div className="container space-y-12 py-10 md:py-14">
      <section>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          Latest
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          Featured note
        </h2>
        <article className="relative mt-6 grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand-ink/40 p-4 md:grid-cols-2 md:p-6">
          <div>
            {posts[0]?.image && (
              <Image
                alt={posts[0].title}
                className="w-full rounded-xl border border-border object-cover object-center md:h-64 lg:h-72"
                height={452}
                src={posts[0].image}
                width={804}
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-2 font-display text-2xl tracking-tight md:text-4xl">
              <Balancer>{posts[0]?.title}</Balancer>
            </h3>
            {posts[0]?.description && (
              <p className="text-muted-foreground md:text-lg">
                <Balancer>{posts[0]?.description}</Balancer>
              </p>
            )}
            <Link href={posts[0]?.slug ?? "/#"} className="absolute inset-0">
              <span className="sr-only">View Article</span>
            </Link>
          </div>
        </article>
      </section>

      <section>
        <h2 className="font-display text-3xl tracking-tight">More notes</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => (
            <article
              key={post._id}
              className="group relative flex flex-col space-y-3 rounded-2xl border border-border bg-card/40 p-3 transition hover:border-brand-gold/40"
            >
              {post.image && (
                <Image
                  alt={post.title}
                  src={post.image}
                  width={804}
                  height={452}
                  className="rounded-xl border border-border bg-muted transition-colors"
                />
              )}
              <h2 className="line-clamp-2 font-display text-2xl tracking-tight">
                {post.title}
              </h2>
              {post.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
              )}
              {post.date && (
                <p className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
