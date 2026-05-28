import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  title: string;
  inverse?: boolean;
};

export function SectionHeader({
  index,
  title,
  inverse = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "scroll-fade flex items-center gap-4 font-mono font-black text-xs uppercase tracking-[0.3em]",
        inverse ? "text-background/50" : "text-foreground/40"
      )}
    >
      <span>[{index}]</span>
      <span
        className={cn(
          "h-px w-12",
          inverse ? "bg-background/30" : "bg-foreground/20"
        )}
      />
      <span>{title}</span>
    </div>
  );
}
