/**
 * Single shared motion vocabulary for the GSAP + CSS system.
 *
 * Framework-agnostic on purpose: no `motion/react`, no `gsap` import, no
 * `window` access. Strings / numbers / arrays only, so this can be imported
 * from server or client bundles without pulling a runtime along.
 *
 * The home page animates through three surfaces — GSAP timelines
 * (`home-animations.tsx`, `custom-cursor.tsx`, blog/MDX), inline CSS
 * transitions (`kinetic-text.tsx`, `site-nav.tsx`), and the `styles.css`
 * keyframes (which read the `--ease-*` custom properties defined in `:root`).
 * Each surface needs the same curve in its own dialect, so the brutalist
 * "snap into place" easing is expressed three ways below.
 */

/* ── Easing: numeric cubic-bezier control points (JS / inline-style use) ── */
export const EASE_BRUTAL = [0.16, 1, 0.3, 1] as const; // expo-out signature
export const EASE_ENTER = [0.0, 0.0, 0.2, 1] as const;
export const EASE_OUT_CUBIC = [0.4, 0, 0.2, 1] as const; // theme-wipe curve

/* ── Easing: CSS cubic-bezier() strings ── */
export const CSS_EASE_BRUTAL = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_OUT_CUBIC = "cubic-bezier(0.4, 0, 0.2, 1)";

/* ── Easing: GSAP ease names (handles into GSAP's ease registry) ── */
export const GSAP_EASE = "expo.out";
export const GSAP_EASE_POWER2 = "power2.out";
export const GSAP_EASE_POWER3 = "power3.out";
export const GSAP_EASE_POWER4 = "power4.out";
export const GSAP_EASE_POWER3_INOUT = "power3.inOut";
export const GSAP_EASE_NONE = "none";
export const GSAP_BACK_SOFT = "back.out(1.6)"; // tech stickers
export const GSAP_BACK_HEADER = "back.out(1.8)"; // section header row
export const GSAP_BACK_NUMBER = "back.out(2)"; // section header index

/* ── Durations (seconds) — GSAP / inline-style ── */
export const DURATION_SNAP = 0.18;
export const DURATION_FAST = 0.25;
export const DURATION_SECTION = 0.4;
export const DURATION_KINETIC = 0.6;
export const DURATION_REDUCED = 0.2; // entrance duration under reduced motion

/* ── Durations (milliseconds) — CSS strings / View Transition API ── */
export const MS_THEME_WIPE = 320;
export const MS_NAV_INDICATOR = 280;

/* ── Stagger presets (seconds) ── */
export const STAGGER_TIGHT = 0.05; // scroll-fade rows, pixel decorations
export const STAGGER_BASE = 0.06; // hero fade-in group
export const STAGGER_INTRO = 0.08; // hero intro lines
export const STAGGER_STICKER = 0.12; // tech stickers, from center

/* ── Kinetic text config (single source for KineticText) ── */
export const KINETIC = {
  cipherChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&",
  cipherIterations: 6,
  cipherIntervalMs: 50,
  scatterDelayTotalMs: 400,
  typewriterStepMs: 20,
  /**
   * Calmed settle for `scatter` mode. The label drops a few px and snaps
   * straight rather than flying in from across the viewport — "bold, not
   * loud". Replaces the former ±600px / ±400px / ±90° explosion.
   */
  settleYpx: 14,
  settleRotateDeg: 4,
  settleDurationMs: 600,
} as const;
