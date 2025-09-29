/** biome-ignore-all lint/style/noMagicNumbers: this file will contain magic numbers */
const EASE_OUT_CUBIC = [0.4, 0, 0.2, 1] as const;
const ANIMATION_DURATION_MEDIUM = 0.4;

const HERO_WIDTH = {
  rest: "var(--hero-width-rest)",
  hover: "var(--hero-width-hover)",
} as const;

const HERO_ASPECT = {
  rest: "var(--hero-aspect-rest)",
  hover: "var(--hero-aspect-hover)",
} as const;

export const HERO_ANIMATIONS = {
  button: {
    initial: {
      width: HERO_WIDTH.rest,
      aspectRatio: HERO_ASPECT.rest,
      borderRadius: "var(--radius)",
    },
    animate: {
      width: HERO_WIDTH.hover,
      aspectRatio: HERO_ASPECT.hover,
      borderRadius: 0,
    },
    transition: { duration: 0.3 },
  },
  cover: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  text: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
} as const;

export const SCROLL_VIEW_CONTAINER_VARIANTS = {
  rest: {
    scale: 1,
    opacity: 1,
    width: HERO_WIDTH.rest,
    aspectRatio: HERO_ASPECT.rest,
  },
  hover: {
    scale: 1.02,
    opacity: 1,
    width: HERO_WIDTH.hover,
    aspectRatio: HERO_ASPECT.hover,
  },
} as const;

export const SCROLL_VIEW_CONTAINER_TRANSITION = {
  duration: 0.35,
  ease: "easeOut",
} as const;

export const ABOUT_ANIMATIONS = {
  container: {
    initial: { opacity: 0.5, y: 70 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      staggerChildren: 0.3,
      when: "beforeChildren",
    },
  },
  List: {
    initial: { opacity: 0.3 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  skillItem: {
    initial: { opacity: 0, x: 20, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: { duration: ANIMATION_DURATION_MEDIUM, ease: EASE_OUT_CUBIC },
  },
  workItem: {
    initial: { opacity: 0, y: -20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: ANIMATION_DURATION_MEDIUM, ease: EASE_OUT_CUBIC },
  },
  workLine: {
    initial: { scaleY: 0, opacity: 0 },
    animate: { scaleY: 1, opacity: 1 },
    transition: {
      duration: ANIMATION_DURATION_MEDIUM,
      delay: 0.3,
      ease: EASE_OUT_CUBIC,
    },
  },
};

export const SCROLL_VIEW_ANIMATIONS = {
  scrollIdleTimeout: 1800,
  indicatorFadeDuration: 0.22,
  imageTransform: {
    translateYRange: [0, -100],
    opacityInputRange: [0, 0.1, 0.9, 1],
    opacityOutputRange: [1, 0.8, 0.8, 1],
  },
  textTransition: {
    duration: 0.3,
    ease: EASE_OUT_CUBIC,
  },
  textTransitionDelayed: {
    duration: 0.3,
    delay: 0.1,
    ease: EASE_OUT_CUBIC,
  },
} as const;
