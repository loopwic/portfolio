import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { KineticText } from "@/components/home/kinetic-text";
import { BrutalMarquee } from "@/components/home/brutal-marquee";
import {
  SITE,
  PROFILE,
  PROJECTS,
  SOCIAL_LINKS,
  HOME_SECTIONS,
} from "@/lib/site-data";
import {
  EASE_BRUTAL,
  DURATION_SECTION,
  DURATION_KINETIC,
  SPATIAL,
} from "@/lib/animations";
import { BLOG_POSTS } from "./blog/-constants";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WritingSection />
      <CTASection />
    </div>
  );
}

/* ── 01 Hero ── */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxZ = useTransform(
    scrollYProgress,
    [0, 1],
    [0, SPATIAL.heroParallaxZ]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-14 md:pt-0"
      id={HOME_SECTIONS[0]}
      ref={ref}
    >
      <motion.div
        className="relative z-10 px-4 text-center"
        style={{
          opacity,
          z: parallaxZ,
          perspective: SPATIAL.perspective,
        }}
      >
        <KineticText
          as="h1"
          className="font-display font-bold text-[length:var(--type-hero)] leading-[0.85] tracking-tighter"
          mode="scatter"
          text={SITE.title}
        />
        <div className="mt-6">
          <KineticText
            as="p"
            className="brutal-mono text-muted-foreground"
            mode="typewriter"
            text={SITE.subtitle}
          />
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0">
        <BrutalMarquee
          className="border-border-hard border-y-2 bg-signal-a py-2 text-background"
          text="FRONTEND · INTERACTION · ENGINEERING"
        />
      </div>
    </section>
  );
}

/* ── 02 About ── */
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      className="relative min-h-screen border-border-hard border-t-2 py-20 md:py-32"
      id={HOME_SECTIONS[1]}
      ref={ref}
    >
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-12">
        {/* Watermark */}
        <div className="pointer-events-none absolute top-8 right-4 select-none lg:right-12">
          <span className="brutal-number">02</span>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <motion.h2
            className="font-display font-bold text-[length:var(--type-h1)] tracking-tight"
            style={{ x: titleX, opacity: titleOpacity }}
          >
            <span className="relative">
              ABOUT
              <span className="absolute inset-x-0 top-1/2 h-[3px] bg-signal-a" />
            </span>
          </motion.h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            {PROFILE.summary}
          </p>

          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            {PROFILE.approach}
          </p>

          {/* Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PROFILE.highlights.map((h) => (
              <div className="brutal-callout" key={h.label}>
                <p className="brutal-mono" data-size="sm">
                  {h.label}
                </p>
                <p className="mt-1 font-medium text-sm">{h.value}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {PROFILE.skills.map((skill) => (
              <span className="brutal-tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-4">
          <p className="brutal-mono mb-4">EXPERIENCE</p>
          <div className="relative border-border-hard border-l-4 pl-6">
            {PROFILE.works.map((work) => (
              <div className="mb-6 last:mb-0" key={work.company}>
                <p className="brutal-mono" data-size="sm">
                  {work.period}
                </p>
                <p className="mt-1 font-semibold">{work.company}</p>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  {work.role}
                </p>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {work.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 03 Projects (sticky-stack) ── */
function ProjectsSection() {
  return (
    <section
      className="relative min-h-screen border-border-hard border-t-2 py-20 md:py-32"
      id={HOME_SECTIONS[2]}
    >
      <div className="container mx-auto px-4">
        <div className="pointer-events-none absolute top-8 left-4 select-none lg:left-12">
          <span className="brutal-number">03</span>
        </div>

        <h2 className="font-display font-bold text-[length:var(--type-h1)] tracking-tight">
          PROJECTS
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          我更关注"真实可维护的工程资产"，而不是一堆截图。下面这些是当前在做或已交付的方向。
        </p>

        <div className="mt-12 space-y-6">
          {PROJECTS.map((project, index) => (
            <motion.article
              className="brutal-card sticky p-6 md:p-8"
              data-shadow
              initial={{ opacity: 0, y: 40 }}
              key={project.name}
              style={{ top: `${120 + index * 20}px` }}
              transition={{
                duration: DURATION_SECTION,
                delay: index * 0.06,
                ease: EASE_BRUTAL,
              }}
              viewport={{ amount: 0.25, once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-2xl tracking-tight">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {project.subtitle}
                  </p>
                </div>
                <span
                  className="brutal-label"
                  data-tone={project.status === "SHIPPED" ? undefined : "b"}
                >
                  {project.status}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed">
                {project.detail}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span className="brutal-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {"milestones" in project && (
                <div className="mt-6">
                  <p className="brutal-mono mb-2">ROADMAP</p>
                  <ul className="space-y-2">
                    {project.milestones.map((m) => (
                      <li
                        className="border-2 border-border-hard px-3 py-2 text-sm transition-transform hover:translate-x-1"
                        key={m}
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {"focus" in project && (
                <div className="brutal-callout mt-6">
                  <p className="brutal-mono" data-size="sm">
                    FOCUS
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {project.focus}
                  </p>
                </div>
              )}

              {"note" in project && (
                <div className="brutal-callout mt-6" data-tone="b">
                  <p className="brutal-mono" data-size="sm">
                    NOTE
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {project.note}
                  </p>
                </div>
              )}

              {"preview" in project && (
                <div className="mt-6 overflow-hidden border-2 border-border-hard">
                  <img
                    alt={project.previewAlt}
                    className="block w-full object-cover"
                    loading="lazy"
                    src={project.preview}
                  />
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 04 Writing ── */
function WritingSection() {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section
      className="relative min-h-[60vh] border-border-hard border-t-2 py-20 md:py-32"
      id={HOME_SECTIONS[3]}
    >
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-[length:var(--type-display)] tracking-tight">
          WRITING
        </h2>

        <div className="brutal-divider mt-4" data-size="lg" />

        <div className="mt-8">
          {latestPosts.map((post, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              key={post.slug}
              transition={{
                duration: DURATION_SECTION,
                delay: index * 0.1,
                ease: EASE_BRUTAL,
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Link
                className="group flex items-baseline gap-4 py-6 transition-transform hover:translate-x-3 md:gap-6"
                to={post.to}
              >
                <span className="font-display font-bold text-[length:var(--type-h1)] text-muted-foreground/30 transition-colors group-hover:text-signal-a">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[length:var(--type-h2)] tracking-tight transition-all group-hover:line-through group-hover:decoration-signal-a group-hover:decoration-3">
                    {post.title}
                  </h3>
                  <p className="mt-1 truncate text-muted-foreground text-sm opacity-0 transition-opacity group-hover:opacity-100">
                    {post.summary}
                  </p>
                </div>
                <span className="brutal-mono hidden shrink-0 md:block">
                  {post.date}
                </span>
              </Link>
              {index < latestPosts.length - 1 && (
                <div className="brutal-divider" data-size="sm" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            className="brutal-tag inline-flex items-center gap-2 text-sm"
            to="/blog"
          >
            ALL POSTS →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 05 CTA ── */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.4"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      className="relative flex min-h-[70vh] items-center border-border-hard border-t-2 py-20 pb-20 md:pb-32 md:py-32"
      id={HOME_SECTIONS[4]}
      ref={ref}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div style={{ scale, opacity }}>
          <h2 className="font-display font-bold text-[length:var(--type-hero)] leading-[0.85] tracking-tighter">
            LET'S BUILD
            <br />
            <KineticText
              className="text-signal-a"
              mode="cipher"
              text="SOMETHING"
            />
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              className="brutal-tag px-6 py-3 text-base"
              href={link.url}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="brutal-mono mx-auto mt-8 max-w-lg text-muted-foreground">
          {SITE.email}
        </p>
      </div>
    </section>
  );
}
