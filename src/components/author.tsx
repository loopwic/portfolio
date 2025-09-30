import Link from "next/dist/client/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export async function Author() {
  const author = await fetch("https://api.github.com/users/loopwic").then(
    (res) => res.json()
  );

  return (
    <div className="not-prose flex items-center gap-2">
      <Avatar className="size-10">
        <AvatarImage alt={author.name} src={author.avatar_url} />
        <AvatarFallback>
          {author.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <Link href={author.html_url} rel="noopener" target="_blank">
        <p className="font-semibold">{author.name}</p>
        <p className="text-muted-foreground text-xs">Owner</p>
      </Link>
    </div>
  );
}
