export const PageAtmosphere = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--surface)_32%,transparent_51%,var(--surface)_77%,transparent_100%)] opacity-25" />
    <div
      className="absolute -top-40 left-[8%] h-[42rem] w-[74rem] -rotate-6 rounded-[46%] bg-foreground/[0.018] blur-[160px] dark:bg-foreground/[0.04]"
      data-atmosphere-drift="primary"
    />
    <div className="absolute top-[29%] -left-80 h-[50rem] w-[70rem] rotate-12 rounded-[44%] bg-foreground/[0.022] blur-[170px] dark:bg-foreground/[0.045]" />
    <div
      className="absolute top-[58%] -right-80 h-[54rem] w-[74rem] -rotate-12 rounded-[46%] bg-foreground/[0.022] blur-[180px] dark:bg-foreground/[0.045]"
      data-atmosphere-drift="secondary"
    />
    <div className="absolute right-[12%] -bottom-52 h-[40rem] w-[62rem] rounded-[48%] bg-foreground/[0.016] blur-[150px] dark:bg-foreground/[0.035]" />
  </div>
);
