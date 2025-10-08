import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ABOUT_ANIMATIONS } from "@/lib/animations";
import { IconLink } from "./icon-link";

const CONTSTANDS = {
  name: "Loopwic",
  image: "https://cdn.loopwic.com/images/hero.webp",
  href: [
    {
      label: "Loopwic",
      url: "https://github.com/loopwic",
      icon: GithubLogoIcon,
    },
    {
      label: "Lp",
      url: "https://x.com/loopwic",
      icon: XLogoIcon,
    },
    {
      label: "Email",
      url: "mailto:me@loopwic.com",
      icon: EnvelopeSimpleIcon,
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
      job: "Frontend Engineer",
      date: "2024.10 - 2025.07",
      icon: "/svgs/kq.svg",
    },
    {
      name: "MOONDROP Tech Co. Ltd.",
      date: "2025.08 - Now",
      job: "Frontend Engineer",
      icon: "/svgs/md.svg",
    },
  ],
} as const;

const BREAKPOINT = 1024;

export function About() {
  const isMobile = useIsMobile(BREAKPOINT);
  return (
    <section
      className="flex h-screen items-start justify-center pt-18 lg:items-center lg:pt-0"
      id="about"
    >
      <motion.div className="flex h-full max-w-7xl flex-col gap-6 p-4 lg:h-auto lg:flex-row lg:gap-10">
        {/* 头像和名字 */}
        <motion.div className="flex items-center gap-2">
          <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-full lg:aspect-[3/4] lg:w-100 lg:rounded">
            <Image
              alt={CONTSTANDS.name}
              className="object-cover object-top"
              fill
              priority
              sizes="auto"
              src={CONTSTANDS.image}
            />
          </div>
          {isMobile && <p className="font-semibold text-3xl">Loopwic</p>}
        </motion.div>

        <div className="flex flex-1 flex-col gap-4">
          {!isMobile && <p className="font-semibold text-5xl">About Me</p>}
          {/* 介绍文字 */}
          <p className="px-0.5 lg:px-0">
            Hi, I'm Loopwic, a passionate developer and designer dedicated to
            crafting beautiful and functional web experiences. With a keen eye
            for detail and a love for clean code, I strive to bring ideas to
            life through innovative solutions and creative designs.
          </p>

          {/* 技能列表 */}
          <p className="mb-2 font-semibold">Skills I Learned</p>
          <motion.ul
            className="flex flex-wrap gap-4"
            initial="initial"
            transition={ABOUT_ANIMATIONS.List.transition}
            variants={ABOUT_ANIMATIONS.List}
            viewport={{ amount: 0.1 }}
            whileInView="animate"
          >
            {CONTSTANDS.skills.map((skill) => (
              <motion.li
                className="flex items-center gap-2 rounded bg-muted px-3 py-1"
                key={skill.name}
                transition={ABOUT_ANIMATIONS.skillItem.transition}
                variants={ABOUT_ANIMATIONS.skillItem}
              >
                <div className="relative size-4 shrink-0">
                  <Image
                    alt={skill.name}
                    className="object-contain"
                    fill
                    sizes="auto"
                    src={skill.icon}
                  />
                </div>
                <span className="text-sm">{skill.name}</span>
              </motion.li>
            ))}
          </motion.ul>

          <p className="mb-2 font-semibold">Where I Worked</p>
          <div className="flex gap-2">
            <motion.div
              className="h-full w-1 rounded-full bg-muted"
              initial="initial"
              style={{ transformOrigin: "top" }}
              transition={ABOUT_ANIMATIONS.workLine.transition}
              variants={ABOUT_ANIMATIONS.workLine}
              whileInView="animate"
            />

            <motion.ul
              className="flex flex-col flex-wrap items-start gap-4"
              initial="initial"
              transition={ABOUT_ANIMATIONS.List.transition}
              variants={ABOUT_ANIMATIONS.List}
              viewport={{ amount: 0.1 }}
              whileInView="animate"
            >
              {CONTSTANDS.works.map((work) => (
                <motion.li
                  className="items flex w-full gap-2 rounded bg-muted px-3 py-1 lg:w-auto"
                  key={work.name}
                  transition={ABOUT_ANIMATIONS.skillItem.transition}
                  variants={ABOUT_ANIMATIONS.skillItem}
                >
                  <div className="relative mt-2 size-4 shrink-0">
                    <Image
                      alt={work.name}
                      className="object-contain"
                      fill
                      sizes="auto"
                      src={work.icon}
                    />
                  </div>
                  <div>
                    <span className="text-sm">{work.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      {work.date}
                    </span>
                    <p>{work.job}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <ul className="flex items-center gap-4 lg:mt-auto lg:ml-auto">
            {CONTSTANDS.href.map((item) => (
              <li key={item.url}>
                <IconLink {...item} />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
