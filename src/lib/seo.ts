import { SITE } from "@/lib/site-data";

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

interface LinkTag {
  rel: string;
  href: string;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  type?: string;
  as?: string;
}

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string;
  author?: string;
}

interface SeoOutput {
  meta: MetaTag[];
  links: LinkTag[];
}

const absoluteUrl = (path?: string) => {
  if (!path) {
    return SITE.url;
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildSeo = (input: SeoInput = {}): SeoOutput => {
  const title = input.title ?? `${SITE.name} — ${SITE.subtitle}`;
  const description = input.description ?? SITE.description;
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? SITE.ogImage);
  const type = input.type ?? "website";

  const meta: MetaTag[] = [
    { title },
    { content: description, name: "description" },
    { content: input.author ?? SITE.name, name: "author" },
    { content: type, property: "og:type" },
    { content: SITE.name, property: "og:site_name" },
    { content: title, property: "og:title" },
    { content: description, property: "og:description" },
    { content: canonical, property: "og:url" },
    { content: image, property: "og:image" },
    { content: SITE.locale, property: "og:locale" },
    { content: "summary_large_image", name: "twitter:card" },
    { content: SITE.twitter, name: "twitter:site" },
    { content: title, name: "twitter:title" },
    { content: description, name: "twitter:description" },
    { content: image, name: "twitter:image" },
  ];

  if (input.keywords) {
    meta.push({ content: input.keywords, name: "keywords" });
  }

  if (type === "article" && input.publishedTime) {
    meta.push({
      content: input.publishedTime,
      property: "article:published_time",
    });
    meta.push({
      content: input.author ?? SITE.name,
      property: "article:author",
    });
  }

  const links: LinkTag[] = [{ href: canonical, rel: "canonical" }];

  return { links, meta };
};

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  description: SITE.description,
  email: `mailto:${SITE.email}`,
  jobTitle: SITE.subtitle,
  name: SITE.name,
  sameAs: ["https://github.com/loopwic", "https://x.com/loopwic"],
  url: SITE.url,
});

export const articleJsonLd = (input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  author: {
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
  },
  datePublished: input.publishedTime,
  description: input.description,
  headline: input.title,
  image: absoluteUrl(input.image ?? SITE.ogImage),
  mainEntityOfPage: absoluteUrl(input.path),
});
