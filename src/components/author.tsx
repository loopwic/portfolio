const AUTHOR = {
  name: "Loopwic",
  avatarUrl: "https://avatars.githubusercontent.com/u/88957459?v=4",
  profileUrl: "https://github.com/loopwic",
} as const;

export function Author() {
  return (
    <div className="not-prose my-5 flex items-center gap-3 rounded-xl border border-border/75 bg-muted/25 px-3 py-2">
      <img
        alt={AUTHOR.name}
        className="size-10 rounded-full border border-border/70"
        height={40}
        src={AUTHOR.avatarUrl}
        width={40}
      />

      <a
        className="transition-colors hover:text-primary"
        href={AUTHOR.profileUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <p className="font-semibold text-sm">{AUTHOR.name}</p>
        <p className="text-muted-foreground text-xs">作者</p>
      </a>
    </div>
  );
}
