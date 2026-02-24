import type { Icon } from "@phosphor-icons/react";

export type IconLinkProps = {
  url: string;
  icon: Icon;
  label?: string;
};
export const IconLink = ({ url, icon: LinkIcon }: IconLinkProps) => {
  return (
    <a
      className="flex items-center gap-1.5"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <LinkIcon className="size-5" />
    </a>
  );
};
