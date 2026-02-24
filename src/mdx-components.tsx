import type { MDXComponents } from "mdx/types";
import React from "react";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

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

const components: MDXComponents = {
  code: ({
    className,
    __raw__,
    __src__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string;
    __src__?: string;
  }) => {
    // Inline Code.
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "relative break-words rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] outline-none",
            className
          )}
          {...props}
        />
      );
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && <CopyButton value={__raw__} />}
        <code {...props} />
      </>
    );
  },
  pre: (props) => {
    // rehype-pretty-code adds data-language attribute to pre element
    const language = props["data-language"] || "text";

    // Extract raw text content for copying
    const rawContent = props.__raw__ || extractTextContent(props.children);

    return (
      <CodeBlock language={language} raw={rawContent}>
        {props.children}
      </CodeBlock>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
