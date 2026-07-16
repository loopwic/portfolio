import { HOME_SECTIONS, PROJECTS } from "@/lib/site-data";

export const ProjectsSection = () => (
  <section
    className="flex min-h-svh items-center border-foreground/12 border-t px-5 py-12 md:px-8 md:py-16"
    data-motion-section=""
    id={HOME_SECTIONS[1]}
  >
    <div className="mx-auto w-full max-w-[896px]">
      <div
        className="flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-foreground/68"
        data-motion-heading=""
      >
        <span>02</span>
        <span className="h-px w-8 bg-foreground/18" />
        <h2 className="font-normal">项目</h2>
      </div>

      <div
        className="mt-7 grid gap-px overflow-hidden rounded-[1.35rem] border border-foreground/12 bg-foreground/12 shadow-[0_18px_50px_rgba(0,0,0,0.045)] lg:h-[28rem] lg:grid-cols-[5fr_4fr] lg:grid-rows-[3fr_2fr] dark:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
        data-bento-grid=""
      >
        {PROJECTS.map((project, index) => {
          const hasPreview = "preview" in project;

          return (
            <article
              className={`group relative flex min-h-[16rem] min-w-0 flex-col overflow-hidden bg-surface/90 backdrop-blur-sm lg:min-h-0 ${index === 0 ? "lg:row-span-2" : ""}`}
              data-motion-item=""
              key={project.name}
            >
              <div className="relative z-10 flex min-w-0 flex-col p-5 md:p-6">
                <div className="flex items-center justify-between gap-4 font-mono text-2xs uppercase tracking-[0.16em] text-foreground/70">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.status}</span>
                </div>
                <h3 className="mt-5 font-display text-[clamp(1.75rem,2.7vw,2.35rem)] font-light leading-none tracking-[-0.015em]">
                  {project.name}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-foreground/68">
                  {project.tags.join(" · ")}
                </p>
              </div>

              {hasPreview ? (
                <div className="relative mt-auto aspect-[16/8] min-w-0 overflow-hidden border-foreground/10 border-t bg-surface lg:aspect-auto lg:flex-1">
                  <img
                    alt={project.previewAlt}
                    className="h-full w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                    height={project.previewHeight}
                    loading="lazy"
                    src={project.preview}
                    width={project.previewWidth}
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute -right-24 -bottom-24 size-64 rounded-full bg-foreground/8 blur-3xl"
                />
              )}
            </article>
          );
        })}

        <a
          aria-label="在 GitHub 查看更多项目"
          className="relative flex min-h-[16rem] min-w-0 flex-col overflow-hidden bg-surface/90 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-[-3px] md:p-6 lg:min-h-0"
          data-motion-item=""
          href="https://github.com/loopwic"
          rel="noreferrer"
          target="_blank"
        >
          <span className="relative z-10 font-mono text-2xs tracking-[0.16em] text-foreground/70">
            03
          </span>
          <span className="relative z-10 mt-auto font-display text-2xl font-light leading-none tracking-[-0.015em]">
            More
          </span>
          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-24 size-52 rounded-full bg-foreground/7 blur-3xl"
          />
        </a>
      </div>
    </div>
  </section>
);
