import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MDXComponents } from "mdx/types";
import React, { useRef } from "react";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Helper function to extract text content from React children
const extractTextContent = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children;
  }

  if (typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join("");
  }

  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractTextContent(props.children);
    }
  }

  return "";
};

const AnimatedImage = ({
  alt = "",
  className,
  height = 900,
  width = 1600,
  ...props
}: React.ComponentProps<"img">) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!(imgRef.current && containerRef.current)) {
        return;
      }

      // Image reveal animation
      gsap.fromTo(
        containerRef.current,
        { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Subtle parallax effect on the image
      gsap.fromTo(
        imgRef.current,
        { y: -20, scale: 1.05 },
        {
          y: 20,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="group relative z-20 my-14 w-full" ref={containerRef}>
      <div className="relative overflow-hidden border border-foreground/25 bg-background">
        <img
          alt={alt}
          className={cn(
            "h-auto w-full object-cover contrast-110 grayscale transition-transform duration-[2s] hover:scale-[1.02]",
            className
          )}
          height={height}
          ref={imgRef}
          width={width}
          {...props}
        />
      </div>
    </div>
  );
};

const AnimatedBlockquote = (props: React.ComponentProps<"blockquote">) => {
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      if (!quoteRef.current) {
        return;
      }

      gsap.from(quoteRef.current, {
        x: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: quoteRef }
  );

  return <blockquote ref={quoteRef} {...props} />;
};

const components: MDXComponents = {
  img: AnimatedImage,
  blockquote: AnimatedBlockquote,
  code: ({
    className,
    __raw__,
    __src__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string;
    __src__?: string;
  }) => {
    const isCodeBlock =
      Boolean(__raw__ || __src__) ||
      Boolean(className?.includes("language-")) ||
      "data-theme" in props;

    if (!isCodeBlock && typeof props.children === "string") {
      return (
        <code
          className={cn(
            "relative break-words border border-foreground/15 bg-surface px-[0.35rem] py-[0.14rem] font-mono text-tiny text-foreground outline-none",
            className
          )}
          {...props}
        />
      );
    }

    return <code className={cn("font-mono", className)} {...props} />;
  },
  pre: (props) => {
    // rehype-pretty-code adds data-language attribute to pre element
    const language = props["data-language"] || "text";

    // Extract raw text content for copying
    const rawContent = props.__raw__ || extractTextContent(props.children);

    return (
      <div className="my-8">
        <CodeBlock language={language} raw={rawContent}>
          {props.children}
        </CodeBlock>
      </div>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
