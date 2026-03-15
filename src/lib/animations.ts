/** biome-ignore-all lint/style/noMagicNumbers: animation constants */

/* ── Core easing curves ── */
export const EASE_BRUTAL = [0.16, 1, 0.3, 1] as const;
export const EASE_ENTER = [0.0, 0.0, 0.2, 1] as const;
export const EASE_OUT_CUBIC = [0.4, 0, 0.2, 1] as const;

/* ── Durations ── */
export const DURATION_SNAP = 0.18;
export const DURATION_FAST = 0.25;
export const DURATION_SECTION = 0.4;
export const DURATION_KINETIC = 0.6;
export const DURATION_REDUCED = 0.3;

/* ── Kinetic text presets ── */
export const KINETIC_TEXT = {
  scatter: {
    initial: (_i: number) => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 90,
      opacity: 0,
    }),
    animate: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
    },
    transition: (i: number, total: number) => ({
      duration: DURATION_KINETIC,
      delay: i * (0.4 / total),
      ease: EASE_BRUTAL,
    }),
  },
  typewriter: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    staggerDelay: 0.02,
    transition: {
      duration: DURATION_SNAP,
      ease: EASE_BRUTAL,
    },
  },
  cipherIterations: 6,
  cipherIntervalMs: 50,
} as const;

/* ── Section reveal animations ── */
export const REVEAL = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION_SECTION, ease: EASE_BRUTAL },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION_SECTION, ease: EASE_ENTER },
  },
  slideLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATION_SECTION, ease: EASE_BRUTAL },
  },
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATION_SECTION, ease: EASE_BRUTAL },
  },
  reduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION_REDUCED },
  },
} as const;

/* ── Interaction animations ── */
export const INTERACTION = {
  cardHover: { y: -4 },
  cardHoverReduced: { y: -1 },
  cardTransition: {
    duration: DURATION_SNAP,
    ease: EASE_BRUTAL,
  },
  rowShift: { x: 12 },
  rowShiftReduced: { x: 2 },
} as const;

/* ── Stagger presets ── */
export const STAGGER = {
  fast: { staggerChildren: 0.05 },
  normal: { staggerChildren: 0.1 },
  slow: { staggerChildren: 0.2 },
} as const;

/* ── Scroll-linked 3D ── */
export const SPATIAL = {
  perspective: 1200,
  heroParallaxZ: -200,
  sectionTiltX: 2,
  cardHoverZ: 20,
} as const;

/* ── Nav animations ── */
export const NAV = {
  show: { y: 0 },
  hide: { y: "-100%" },
  transition: {
    duration: DURATION_FAST,
    ease: EASE_BRUTAL,
  },
} as const;

/* ── Blog animations ── */
export const BLOG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION_SECTION, ease: EASE_BRUTAL },
    },
  },
} as const;

/* ── Route transition ── */
export const ROUTE_TRANSITION = {
  enter: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: DURATION_FAST, ease: EASE_BRUTAL },
} as const;
