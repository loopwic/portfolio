import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";

export type IconLinkProps = {
  url: string;
  icon: Icon;
  label?: string;
};
export const IconLink = ({ url, icon: LinkIcon }: IconLinkProps) => {
  return (
    <Link className="flex items-center gap-1.5" href={url}>
      <LinkIcon className="size-5" />
    </Link>
  );
};
