/**
 * Single shared motion vocabulary for the GSAP + CSS system.
 *
 * Framework-agnostic on purpose: no `motion/react`, no `gsap` import, no
 * `window` access. Strings / numbers / arrays only, so this can be imported
 * from server or client bundles without pulling a runtime along.
 *
 * Motion runs through three surfaces — GSAP timelines
 * (`custom-cursor.tsx`, blog/MDX), inline CSS
 * transitions (`site-nav.tsx`), and the `styles.css`
 * keyframes (which read the `--ease-*` custom properties defined in `:root`).
 * Each surface needs the same curve in its own dialect, so the brutalist
 * "snap into place" easing is expressed three ways below.
 */

/* ── Easing: numeric cubic-bezier control points (JS / inline-style use) ── */
// expo-out signature
export const EASE_BRUTAL = [0.16, 1, 0.3, 1] as const;
export const EASE_ENTER = [0, 0, 0.2, 1] as const;
// theme-wipe curve
export const EASE_OUT_CUBIC = [0.4, 0, 0.2, 1] as const;

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
// tech stickers
export const GSAP_BACK_SOFT = "back.out(1.6)";
// section header row
export const GSAP_BACK_HEADER = "back.out(1.8)";
// section header index
export const GSAP_BACK_NUMBER = "back.out(2)";

/* ── Durations (seconds) — GSAP / inline-style ── */
export const DURATION_SNAP = 0.18;
export const DURATION_FAST = 0.25;
export const DURATION_SECTION = 0.4;

/* ── Durations (milliseconds) — CSS strings / View Transition API ── */
export const MS_THEME_WIPE = 320;
export const MS_NAV_INDICATOR = 280;

/* ── Stagger presets (seconds) ── */
// scroll-fade rows, pixel decorations
export const STAGGER_TIGHT = 0.05;
export const STAGGER_BASE = 0.06;
// tech stickers, from center
export const STAGGER_STICKER = 0.12;
