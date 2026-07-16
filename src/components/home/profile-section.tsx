import { HOME_SECTIONS, PROFILE, SITE } from "@/lib/site-data";

export const ProfileSection = () => (
  <section
    className="flex min-h-svh items-center px-5 py-12 md:px-8 md:py-16"
    id={HOME_SECTIONS[0]}
  >
    <div className="mx-auto flex w-fit max-w-full items-center gap-4 md:gap-5">
      <img
        alt={`${SITE.name} 的头像`}
        className="size-12 shrink-0 rounded-full object-cover saturate-[0.92] shadow-[0_8px_22px_rgba(0,0,0,0.09)] md:size-14 dark:shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
        data-profile-avatar=""
        fetchPriority="high"
        height={56}
        src={PROFILE.avatar}
        width={56}
      />

      <div className="min-w-0 flex-1" data-profile-copy="">
        <h1 className="font-display text-xl font-light leading-none tracking-[-0.01em] md:text-2xl">
          {SITE.name}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/64">
          <a
            className="underline decoration-foreground/24 underline-offset-4 transition-opacity hover:opacity-65"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
          <span aria-hidden="true" className="text-foreground/30">
            /
          </span>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </div>
  </section>
);
