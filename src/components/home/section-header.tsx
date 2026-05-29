import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  title: string;
  inverse?: boolean;
}

export const SectionHeader = ({
  index,
  title,
  inverse = false,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "scroll-fade section-header flex items-center gap-4 font-mono font-black text-xs uppercase tracking-[0.3em]",
      inverse ? "text-background/50" : "text-foreground/40"
    )}
  >
    <span className="section-header-number inline-block">[{index}]</span>
    <span
      className={cn(
        "section-header-rule h-px w-12",
        inverse ? "bg-background/30" : "bg-foreground/20"
      )}
    />
    <span className="section-header-title">{title}</span>
  </div>
);
