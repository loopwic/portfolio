import { SITE } from "@/lib/site-data";

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

type LinkTag = {
  rel: string;
  href: string;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  type?: string;
  as?: string;
};

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

function absoluteUrl(path?: string) {
  if (!path) {
    return SITE.url;
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildSeo(input: SeoInput = {}): SeoOutput {
  const title = input.title ?? `${SITE.name} — ${SITE.subtitle}`;
  const description = input.description ?? SITE.description;
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? SITE.ogImage);
  const type = input.type ?? "website";

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { name: "author", content: input.author ?? SITE.name },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { property: "og:locale", content: SITE.locale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE.twitter },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (input.keywords) {
    meta.push({ name: "keywords", content: input.keywords });
  }

  if (type === "article" && input.publishedTime) {
    meta.push({
      property: "article:published_time",
      content: input.publishedTime,
    });
    meta.push({
      property: "article:author",
      content: input.author ?? SITE.name,
    });
  }

  const links: LinkTag[] = [{ rel: "canonical", href: canonical }];

  return { meta, links };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.subtitle,
    description: SITE.description,
    email: `mailto:${SITE.email}`,
    sameAs: ["https://github.com/loopwic", "https://x.com/loopwic"],
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: absoluteUrl(input.image ?? SITE.ogImage),
    datePublished: input.publishedTime,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: absoluteUrl(input.path),
  };
}
