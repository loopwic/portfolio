const AUTHOR = {
  avatarUrl: "https://avatars.githubusercontent.com/u/157279205",
  name: "Loopwic",
  profileUrl: "https://github.com/loopwic",
} as const;

export const Author = () => (
  <div className="not-prose my-7 flex items-center gap-4 border-foreground/15 border-y py-3">
    <img
      alt={AUTHOR.name}
      className="author-avatar size-11 border border-foreground/15"
      height={40}
      src={AUTHOR.avatarUrl}
      width={40}
    />

    <a
      className="group grid gap-1 transition-colors hover:text-primary"
      href={AUTHOR.profileUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <p className="flex items-center gap-2 font-black font-mono text-xs uppercase tracking-[0.18em]">
        <span className="h-2 w-2 bg-signal-a transition-transform group-hover:translate-x-1" />
        {AUTHOR.name}
      </p>
      <p className="text-muted-foreground text-xs">Author / Frontend</p>
    </a>
  </div>
);
