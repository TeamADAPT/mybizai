import type { DocsConfig } from "~/types";

export const getDocsConfig = (_lang: string): DocsConfig => {
  return {
    mainNav: [
      {
        title: "Design",
        href: `/design`,
      },
      {
        title: "Shell",
        href: `/shell`,
      },
      {
        title: "Brand kit",
        href: `/brand-kit`,
      },
    ],
    sidebarNav: [
      {
        id: "docs",
        title: "Getting Started",
        items: [
          {
            title: "Introduction",
            href: `/docs`,
          },
        ],
      },
      {
        id: "product",
        title: "Product",
        items: [
          {
            title: "Design foundation",
            href: `/design`,
          },
          {
            title: "Product shell",
            href: `/shell`,
          },
          {
            title: "Brand Identity Kit",
            href: `/brand-kit`,
          },
          {
            title: "Pricing",
            href: `/pricing`,
          },
        ],
      },
      {
        id: "access",
        title: "Access",
        items: [
          {
            title: "Operator playbook",
            href: `/playbook`,
          },
          {
            title: "Private access",
            href: `/login-clerk`,
          },
        ],
      },
    ],
  };
};
