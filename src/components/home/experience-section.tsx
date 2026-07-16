import { HOME_SECTIONS, PROFILE } from "@/lib/site-data";

export const ExperienceSection = () => (
  <section
    className="flex min-h-svh items-center border-foreground/12 border-t px-5 py-12 md:px-8 md:py-16"
    data-motion-section=""
    id={HOME_SECTIONS[2]}
  >
    <div className="mx-auto w-full max-w-[896px]">
      <div
        className="flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-foreground/68"
        data-motion-heading=""
      >
        <span>03</span>
        <span className="h-px w-8 bg-foreground/18" />
        <h2 className="font-normal">履历</h2>
      </div>

      <div className="relative mt-9 max-w-3xl">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-foreground/18"
          data-timeline-line=""
        />
        <ol>
          {PROFILE.works.map((work, index) => (
            <li
              className="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[9rem_1fr] md:gap-8 md:pl-10"
              data-timeline-item=""
              key={work.company}
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[5px] size-[9px] rounded-full border border-background bg-foreground shadow-[0_0_0_4px_var(--background)]"
              />
              <p className="font-mono text-xs text-foreground/62">
                {work.period}
              </p>
              <div className="mt-2 md:mt-0">
                <h3 className="font-display text-xl font-light leading-none tracking-[-0.01em] md:text-2xl">
                  {work.company}
                </h3>
                <p className="mt-2 text-sm text-foreground/68">{work.role}</p>
                {index === 0 ? (
                  <span className="mt-3 inline-block rounded-full border border-foreground/14 px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-foreground/68">
                    Current
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
