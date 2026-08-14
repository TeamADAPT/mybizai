import { notFound } from "next/navigation";
import { allAuthors, allPosts } from "contentlayer/generated";

import { Mdx } from "~/components/content/mdx-components";

import "~/styles/mdx.css";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { env } from "~/env.mjs";
import { absoluteUrl, formatDate } from "~/lib/utils";

interface PostPageProps {
  params: {
    lang?: string;
    slug: string[];
  };
}

function getPostFromParams(params: { slug?: string | string[] }) {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    null;
  }

  return post;
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPostFromParams(params);
  if (!post) {
    return {};
  }

  const url = env.NEXT_PUBLIC_APP_URL;

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", post.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
}

export function generateStaticParams(): PostPageProps["params"][] {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostFromParams(params);
  const lang = params.lang ?? "en";

  if (!post) {
    notFound();
  }

  const authors = post.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`),
  );

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href={`/${lang}/blog`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden text-muted-foreground xl:inline-flex",
        )}
      >
        <Icons.ChevronLeft className="mr-2 h-4 w-4" />
        All insights
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block font-mono text-[11px] uppercase tracking-[0.16em] text-brand-gold"
          >
            {formatDate(post.date)}
          </time>
        )}
        <h1 className="mt-2 inline-block font-display text-4xl tracking-tight lg:text-5xl">
          <Balancer>{post.title}</Balancer>
        </h1>
        {authors?.length ? (
          <div className="mt-4 flex space-x-4">
            {authors.map((author) =>
              author ? (
                <Link
                  key={author._id}
                  href={`https://twitter.com/${author.twitter}`}
                  className="flex items-center space-x-2 text-sm"
                >
                  <Image
                    src={author.avatar}
                    alt={author.title}
                    width={42}
                    height={42}
                    className="rounded-full bg-white"
                  />
                  <div className="flex-1 text-left leading-tight">
                    <p className="font-medium">{author.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      @{author.twitter}
                    </p>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        ) : null}
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-2xl border border-border bg-muted transition-colors"
          priority
        />
      )}
      <Mdx code={post.body.code} />
      <hr className="mt-12 border-border" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href={`/${lang}/blog`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-full border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10",
          )}
        >
          <Icons.ChevronLeft className="mr-2 h-4 w-4" />
          All insights
        </Link>
      </div>
    </article>
  );
}
