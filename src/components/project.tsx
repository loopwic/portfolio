import { motion, useReducedMotion } from "motion/react";

const REVEAL_Y_OFFSET = 16;
const CARD_HOVER_OFFSET = -5;
const REDUCED_CARD_HOVER_OFFSET = -1;
const REDUCED_ICON_SCALE = 1.02;
const ICON_HOVER_SCALE = 1.06;
const IMAGE_HOVER_SCALE = 1.016;
const REDUCED_IMAGE_HOVER_SCALE = 1.004;
const IMAGE_HOVER_OFFSET = -2;
const MILESTONE_HOVER_X = 4;
const REDUCED_MILESTONE_HOVER_X = 1;
const NOTE_HOVER_Y = -3;
const REDUCED_NOTE_HOVER_Y = -1;
const ICON_ROTATE_LEFT = -3;
const ICON_ROTATE_RIGHT = 2;
const ICON_ROTATE_KEYFRAMES = [
  0,
  ICON_ROTATE_LEFT,
  ICON_ROTATE_RIGHT,
  0,
] as const;

export function Project() {
  const prefersReducedMotion = useReducedMotion();

  const lattice = {
    name: "Lattice",
    status: "Shipped",
    detail:
      "已完成 Mod + Backend + Desktop 的一体化链路，正在持续迭代稳定性与规则精度。",
    icon: "/svgs/lattice.svg",
    preview: "/images/lattice.png",
    previewAlt: "Lattice desktop window",
    tags: ["Mod + Backend + Desktop", "Ops-ready", "Live iteration"],
  } as const;

  const licMusic = {
    name: "LicMusic",
    status: "Planned",
    detail:
      "以播放器为核心，加入 AI 偏好分析与条件找歌，让“想听什么”可以被准确表达和快速命中。",
    milestones: [
      "Desktop-first player and queue UX",
      "AI taste profile from real listening behavior",
      "Condition-based song discovery (mood / bpm / language / era)",
    ],
    note: "先把播放与推荐链路做准：用户输入条件 -> AI 解释偏好 -> 返回可验证的候选歌单，再逐步扩展跨端同步。",
  } as const;

  const revealInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: REVEAL_Y_OFFSET };
  const revealInView = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
  const cardHover = prefersReducedMotion
    ? { y: REDUCED_CARD_HOVER_OFFSET }
    : { y: CARD_HOVER_OFFSET };
  const cardHoverTransition = prefersReducedMotion
    ? { duration: 0.16, ease: "linear" as const }
    : { type: "spring" as const, stiffness: 270, damping: 24, mass: 0.75 };

  return (
    <section className="min-h-screen pt-22 pb-6 lg:h-screen" id="projects">
      <div className="container mx-auto flex min-h-0 flex-col px-4 lg:h-full">
        <h2 className="mb-2 font-semibold text-3xl tracking-tight">Projects</h2>
        <p className="max-w-2xl text-muted-foreground text-sm">
          我更关注“真实可维护的工程资产”，而不是一堆截图。下面这些是当前在做或已交付的方向。
        </p>

        <div className="mt-6 grid min-h-0 flex-1 gap-4 lg:grid-cols-12 lg:items-stretch">
          <motion.article
            className="group flex h-full min-h-0 flex-col rounded-2xl border border-border/80 bg-card p-5 lg:col-span-8"
            initial={revealInitial}
            transition={{ duration: 0.32, ease: "easeOut" }}
            viewport={{ amount: 0.25, once: true }}
            whileHover={cardHover}
            whileInView={revealInView}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center justify-center gap-3">
                <motion.div
                  className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/80 bg-muted/40"
                  transition={cardHoverTransition}
                  whileHover={
                    prefersReducedMotion
                      ? { scale: REDUCED_ICON_SCALE }
                      : {
                          rotate: ICON_ROTATE_KEYFRAMES,
                          scale: ICON_HOVER_SCALE,
                        }
                  }
                >
                  <span className="pointer-events-none absolute inset-0 border border-border/0 transition-colors duration-300 group-hover:border-border/80" />
                  <img
                    alt={`${lattice.name} icon`}
                    className="relative z-10 block size-7 object-contain"
                    height={28}
                    loading="lazy"
                    src={lattice.icon}
                    width={28}
                  />
                </motion.div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-xl tracking-tight">
                    {lattice.name}
                  </h3>
                  <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                    Productionized full-stack monitoring toolkit
                  </p>
                </div>
              </div>

              <p className="inline-flex shrink-0 rounded-full border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.12em]">
                {lattice.status}
              </p>
            </div>

            <div className="mt-4 grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
              <div className="flex min-h-0 flex-col">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lattice.detail}
                </p>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {lattice.tags.map((tag) => (
                    <li
                      className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]"
                      key={tag}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto rounded-xl border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]">
                    Focus
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                    规则可维护性、事件链路完整性、桌面运维体验打磨。
                  </p>
                </div>
              </div>

              <div className="flex h-full min-h-55 flex-col overflow-hidden rounded-xl border border-border/70 sm:min-h-70 xl:min-h-0">
                <div className="flex items-center gap-2 border-border/70 border-b bg-muted/30 px-3 py-2">
                  <span className="size-1.5 rounded-full bg-muted-foreground/70" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/45" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/25" />
                  <span className="ml-2 font-mono text-[0.66rem] text-muted-foreground uppercase tracking-[0.1em]">
                    lattice-desktop
                  </span>
                </div>

                <motion.div
                  className="min-h-0 flex-1 bg-muted/20 p-3 flex items-center justify-center"
                  transition={cardHoverTransition}
                  whileHover={
                    prefersReducedMotion
                      ? { scale: REDUCED_IMAGE_HOVER_SCALE }
                      : { scale: IMAGE_HOVER_SCALE, y: IMAGE_HOVER_OFFSET }
                  }
                >
                  <div className="aspect-2400/1520 w-full  overflow-hidden rounded-md border border-border/60 bg-card/70">
                    <img
                      alt={lattice.previewAlt}
                      className="block h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                      height={1520}
                      loading="lazy"
                      src={lattice.preview}
                      width={2400}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="group flex h-full min-h-0 flex-col rounded-2xl border border-border/80 bg-card p-5 lg:col-span-4"
            initial={revealInitial}
            transition={{ delay: 0.06, duration: 0.32, ease: "easeOut" }}
            viewport={{ amount: 0.25, once: true }}
            whileHover={cardHover}
            whileInView={revealInView}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-xl tracking-tight">
                {licMusic.name}
              </h3>
              <p className="inline-flex w-fit rounded-full border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.12em]">
                {licMusic.status}
              </p>
            </div>

            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {licMusic.detail}
            </p>

            <div className="mt-4 flex min-h-0 flex-1 flex-col">
              <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]">
                Roadmap
              </p>
              <ul className="mt-3 space-y-2">
                {licMusic.milestones.map((milestone) => (
                  <motion.li
                    className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-muted-foreground text-xs leading-relaxed transition-colors duration-300 ease-out group-hover:border-border"
                    key={milestone}
                    transition={cardHoverTransition}
                    whileHover={
                      prefersReducedMotion
                        ? { x: REDUCED_MILESTONE_HOVER_X }
                        : { x: MILESTONE_HOVER_X }
                    }
                  >
                    {milestone}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-4 rounded-lg border border-border/70 bg-muted/20 px-3 py-2"
                transition={cardHoverTransition}
                whileHover={
                  prefersReducedMotion
                    ? { y: REDUCED_NOTE_HOVER_Y }
                    : { y: NOTE_HOVER_Y }
                }
              >
                <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]">
                  Project Note
                </p>
                <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                  {licMusic.note}
                </p>
              </motion.div>

              <div className="mt-auto rounded-lg border border-border/80 border-dashed bg-card/40 px-3 py-2">
                <p className="font-mono text-[0.66rem] text-muted-foreground uppercase tracking-[0.08em]">
                  Phase
                </p>
                <p className="mt-1 text-xs">Pre-production / Research</p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
