export const ProjectField = () => (
  <div className="relative h-full overflow-hidden opacity-60">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,currentColor,transparent_42%)] opacity-10 blur-2xl" />
    <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-current/30" />
    <div className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-current/24" />
    <div className="absolute inset-10 border border-current/12" />
  </div>
);
