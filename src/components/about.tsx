import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { IconLink } from "./icon-link";

const PROFILE = {
  name: "Loopwic",
  role: "前端开发 / 交互实现",
  image: "https://cdn.loopwic.com/images/hero.webp",
  summary:
    "我主要做前端和交互实现，习惯先把状态和结构拆清楚，再做动效。这样页面既有表现力，也能长期维护。",
  links: [
    {
      label: "GitHub",
      url: "https://github.com/loopwic",
      icon: GithubLogoIcon,
    },
    {
      label: "X",
      url: "https://x.com/loopwic",
      icon: XLogoIcon,
    },
    {
      label: "邮箱",
      url: "mailto:me@loopwic.com",
      icon: EnvelopeSimpleIcon,
    },
  ],
  highlights: [
    {
      label: "工程偏好",
      value: "简单、可维护",
    },
    {
      label: "交互原则",
      value: "反馈明确，不打断操作",
    },
    {
      label: "当前重心",
      value: "体验稳定和性能边界",
    },
    {
      label: "协作方式",
      value: "先对齐目标，再推进细节",
    },
  ],
  skills: [
    {
      name: "TypeScript",
      icon: "/svgs/typescript.svg",
    },
    {
      name: "React",
      icon: "/svgs/react.svg",
    },
    {
      name: "Motion",
      icon: "/svgs/motion.svg",
    },
    {
      name: "Expo",
      icon: "/svgs/expo.svg",
    },
    {
      name: "Golang",
      icon: "/svgs/golang.svg",
    },
    {
      name: "Docker",
      icon: "/svgs/docker.svg",
    },
  ],
  works: [
    {
      name: "kuaiqi Tech Co., Ltd.",
      job: "前端工程师",
      date: "2024.10 - 2025.07",
      icon: "/svgs/kq.svg",
      responsibility: "负责核心业务页面维护和新功能交付，保障线上稳定。",
    },
    {
      name: "MOONDROP Tech Co. Ltd.",
      job: "前端工程师",
      date: "2025.08 - 至今",
      icon: "/svgs/md.svg",
      responsibility: "参与 AI 产品线前端架构和 CI/CD 流程优化。",
    },
  ],
} as const;

const CARD_HOVER = {
  y: -4,
} as const;

const CARD_TRANSITION = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.85,
} as const;

export function About() {
  return (
    <section className="h-screen overflow-hidden pt-18 pb-4 lg:pt-21 lg:pb-6">
      <div className="container mx-auto grid h-full min-h-0 gap-3 px-4 lg:grid-cols-12 lg:gap-4">
        <motion.article
          className="flex min-h-0 flex-col rounded-2xl border border-border/80 bg-card/85 p-4 lg:col-span-4"
          initial={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          viewport={{ amount: 0.25, once: true }}
          whileHover={CARD_HOVER}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative h-[34%] min-h-[8.5rem] overflow-hidden rounded-xl border border-border/70 bg-muted/20 lg:h-[42%] lg:min-h-0">
            <img
              alt={PROFILE.name}
              className="h-full w-full object-cover object-top"
              height={1067}
              loading="eager"
              src={PROFILE.image}
              width={800}
            />
          </div>

          <div className="mt-4">
            <h2 className="font-semibold text-2xl tracking-tight">
              {PROFILE.name}
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">{PROFILE.role}</p>
          </div>

          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            {PROFILE.summary}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {PROFILE.highlights.map((item) => (
              <motion.div
                className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2"
                key={item.label}
                transition={CARD_TRANSITION}
                whileHover={{ y: -2 }}
              >
                <p className="font-mono text-[0.62rem] text-muted-foreground uppercase tracking-[0.12em]">
                  {item.label}
                </p>
                <p className="mt-1 text-xs">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <ul className="mt-auto flex items-center gap-4 pt-3">
            {PROFILE.links.map((item) => (
              <li key={item.url}>
                <IconLink {...item} />
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className="flex min-h-0 flex-col rounded-2xl border border-border/80 bg-card/85 p-4 lg:col-span-8 lg:p-5"
          initial={{ opacity: 0, x: 16 }}
          transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
          viewport={{ amount: 0.25, once: true }}
          whileHover={CARD_HOVER}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div>
            <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.14em]">
              关于
            </p>
            <h3 className="mt-2 font-semibold text-3xl tracking-tight">
              我是怎么做页面的
            </h3>
            <p className="mt-3 max-w-3xl text-muted-foreground text-sm leading-relaxed">
              目标是让页面既有表现力，又不牺牲可维护性。交付时我会优先保证交互链路完整、状态可推导，再去打磨视觉细节。
            </p>
          </div>

          <div className="mt-4 grid min-h-0 flex-1 gap-3 lg:mt-6 lg:grid-cols-2 lg:gap-4">
            <section className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-muted/20 p-3.5 lg:p-4">
              <p className="font-semibold text-sm">技术栈</p>
              <p className="mt-1 text-muted-foreground text-xs">
                这些是我长期在用、并且愿意持续投入的工具。
              </p>

              <motion.ul
                className="mt-4 flex flex-wrap gap-2"
                initial="initial"
                transition={{ staggerChildren: 0.05 }}
                viewport={{ amount: 0.2 }}
                whileInView="animate"
              >
                {PROFILE.skills.map((skill) => (
                  <motion.li
                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5"
                    key={skill.name}
                    transition={CARD_TRANSITION}
                    variants={{
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -2 }}
                  >
                    <img
                      alt={skill.name}
                      className="size-3.5 object-contain"
                      height={14}
                      src={skill.icon}
                      width={14}
                    />
                    <span className="text-xs">{skill.name}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </section>

            <section className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-muted/20 p-3.5 lg:p-4">
              <p className="font-semibold text-sm">工作经历</p>
              <p className="mt-1 text-muted-foreground text-xs">
                我呆过的公司和做过的事，能反映我在工作中是什么样子的。
              </p>

              <ul className="mt-4 min-h-0 space-y-2 overflow-y-auto pr-1">
                {PROFILE.works.map((work) => (
                  <motion.li
                    className="rounded-lg border border-border/70 bg-card px-3 py-2"
                    key={work.name}
                    transition={CARD_TRANSITION}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start gap-2">
                      <img
                        alt={work.name}
                        className="mt-0.5 size-4 object-contain"
                        height={16}
                        src={work.icon}
                        width={16}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm">{work.name}</p>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {work.job} · {work.date}
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                          {work.responsibility}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
