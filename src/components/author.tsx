const AUTHOR = {
  name: "Loopwic",
  avatarUrl: "https://avatars.githubusercontent.com/u/88957459?v=4",
  profileUrl: "https://github.com/loopwic",
} as const;

export function Author() {
  return (
    <div className="not-prose flex items-center gap-2">
      <img
        alt={AUTHOR.name}
        className="size-10 rounded-full"
        height={40}
        src={AUTHOR.avatarUrl}
        width={40}
      />

      <a href={AUTHOR.profileUrl} rel="noopener noreferrer" target="_blank">
        <p className="font-semibold">{AUTHOR.name}</p>
        <p className="text-muted-foreground text-xs">Owner</p>
      </a>
    </div>
  );
}
