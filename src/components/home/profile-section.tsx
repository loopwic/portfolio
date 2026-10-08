import { HOME_SECTIONS, PROFILE, SITE } from "@/lib/site-data";

export const ProfileSection = () => (
  <section
    className="flex min-h-svh items-center px-5 py-16 md:px-8 md:py-20"
    id={HOME_SECTIONS[0]}
  >
    <div className="mx-auto w-full max-w-[896px]">
      <div className="flex items-start gap-4 md:gap-6">
        <span className="profile-avatar-shell mt-1 shrink-0">
          <img
            alt={`${SITE.name} 的头像`}
            className="profile-avatar size-12 rounded-full object-cover saturate-[0.92] shadow-[0_8px_22px_rgba(0,0,0,0.09)] md:size-16 dark:shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
            data-profile-avatar=""
            fetchPriority="high"
            height={64}
            src={PROFILE.avatar}
            width={64}
          />
        </span>

        <div className="min-w-0 flex-1" data-profile-copy="">
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-foreground/58">
            Independent developer <span aria-hidden="true">/</span> 个人开发者
          </p>
          <h1 className="mt-3 font-display text-3xl font-light leading-none tracking-[-0.035em] md:text-5xl">
            {SITE.name}
          </h1>
          <p className="mt-3 text-sm text-foreground/70 md:text-base">
            {SITE.subtitleCN}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground/58 md:text-sm">
            <span>{PROFILE.location}</span>
            <span aria-hidden="true" className="text-foreground/30">
              /
            </span>
            <a
              className="underline decoration-foreground/24 underline-offset-4 transition-opacity hover:opacity-65"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
          </div>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-foreground/74 md:text-base md:leading-8">
            我主要做前端和交互实现，最近在做一款中英双语 iOS 输入法。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/15 px-4 font-mono text-2xs uppercase tracking-[0.1em] text-foreground/75 transition-colors hover:bg-foreground/[0.055] hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
              href="https://github.com/loopwic"
              rel="noreferrer"
              target="_blank"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/15 px-4 font-mono text-2xs uppercase tracking-[0.1em] text-foreground/75 transition-colors hover:bg-foreground/[0.055] hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
              href={`mailto:${SITE.email}`}
            >
              Contact <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
