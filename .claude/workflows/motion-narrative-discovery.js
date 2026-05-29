export const meta = {
  name: 'motion-narrative-discovery',
  description: 'Catalog all motion literals, verify dead-code deletion safety, audit reduced-motion gaps',
  phases: [
    { title: 'Discover' },
    { title: 'Synthesize' },
  ],
}

const SAFETY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['animationsTsSafeToDelete', 'motionPkgSafeToRemove', 'references', 'notes'],
  properties: {
    animationsTsSafeToDelete: { type: 'boolean' },
    motionPkgSafeToRemove: { type: 'boolean' },
    references: {
      type: 'array',
      description: 'Every reference found to src/lib/animations.ts (any import path) OR to the "motion" package (motion, motion/react, framer-motion). Empty array if none.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'line', 'snippet', 'kind'],
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          snippet: { type: 'string' },
          kind: { type: 'string', description: 'animations-ts | motion-pkg' },
        },
      },
    },
    notes: { type: 'string', description: 'Anything notable: dynamic imports, config files, comments referencing these, CLAUDE.md mentions.' },
  },
}

const CENSUS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['literals'],
  properties: {
    literals: {
      type: 'array',
      description: 'Every hardcoded animation/transition value found across the whole repo (TS/TSX AND styles.css). Easing curves (cubic-bezier, expo.out, back.out, power*.out, ease arrays like [0.16,1,0.3,1]), durations (s/ms in transition/animation/duration props or gsap calls), stagger amounts.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'line', 'value', 'category', 'context'],
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          value: { type: 'string', description: 'the literal, e.g. "cubic-bezier(0.16, 1, 0.3, 1)" or "0.18" or "expo.out"' },
          category: { type: 'string', description: 'easing | duration | stagger | other' },
          context: { type: 'string', description: 'short note: what it animates / which system (gsap, css transition, tailwind, RAF)' },
        },
      },
    },
  },
}

const RM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['components'],
  properties: {
    components: {
      type: 'array',
      description: 'Every component/hook that produces motion, and whether it gates on prefers-reduced-motion.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'animates', 'gatesReducedMotion', 'gatingMechanism', 'gap'],
        properties: {
          file: { type: 'string' },
          animates: { type: 'string', description: 'what motion it produces' },
          gatesReducedMotion: { type: 'boolean' },
          gatingMechanism: { type: 'string', description: 'e.g. window.matchMedia check, GSAP reduceMotion var, none' },
          gap: { type: 'string', description: 'if it does NOT gate, describe the WCAG gap and the recommended fallback; else empty' },
        },
      },
    },
  },
}

phase('Discover')
const [safety, census, rm] = await parallel([
  () => agent(
    `Read-only investigation in the repo at the current working directory (a TanStack Start / React portfolio).\n\n` +
    `GOAL: Determine with certainty whether it is SAFE to (a) delete the file src/lib/animations.ts and (b) remove the "motion" npm package from package.json.\n\n` +
    `Do an EXHAUSTIVE search across the ENTIRE repo (src/**, vite.config.*, *.config.*, tsconfig*, src/routes/__root.tsx, src/router.tsx if any, MDX content, any dynamic import()):\n` +
    `- Any import or reference to "@/lib/animations" or "./animations" or "lib/animations" (the preset file).\n` +
    `- Any import or reference to the "motion" package: "motion", "motion/react", "motion/mini", "framer-motion".\n` +
    `Use grep/ripgrep thoroughly (include .ts, .tsx, .mdx, .json, .css, config files). Report EVERY hit with file+line+snippet. ` +
    `If zero real references exist (other than the definition file itself and package.json's dependency line), mark both safe to delete/remove. ` +
    `Note any mention in CLAUDE.md or comments (those are not blockers but worth noting).`,
    { label: 'deletion-safety', phase: 'Discover', schema: SAFETY_SCHEMA, agentType: 'Explore' }
  ),
  () => agent(
    `Read-only census in the repo at the current working directory.\n\n` +
    `GOAL: Catalog EVERY hardcoded animation/motion literal across the WHOLE repo so they can be unified into a single tokens module.\n\n` +
    `Search both code and styles:\n` +
    `- TS/TSX: easing strings/arrays ("expo.out", "back.out(...)", "power2.out", "power3.out", "[0.16, 1, 0.3, 1]", "cubic-bezier(...)"), durations passed to gsap (duration: ..., stagger: ...), CSS-in-JS transition strings with cubic-bezier and ms/s, IntersectionObserver thresholds are NOT relevant.\n` +
    `- src/styles.css: transition:, animation:, @keyframes timing, cubic-bezier(...), durations in ms/s.\n` +
    `Look especially in: src/components/home/home-animations.tsx, src/components/home/kinetic-text.tsx, src/components/nav/site-nav.tsx, src/components/home/pixel-smiley.tsx, src/components/home/constants.ts, src/components/ui/custom-cursor.tsx, src/components/ui/liquid-image.tsx, src/components/blog-post-layout.tsx, src/styles.css, src/routes/__root.tsx.\n` +
    `Report each literal with file+line+value+category(easing|duration|stagger|other)+a short context note (what it animates, which system). Be exhaustive; do not summarize away duplicates — list each occurrence.`,
    { label: 'literal-census', phase: 'Discover', schema: CENSUS_SCHEMA, agentType: 'Explore' }
  ),
  () => agent(
    `Read-only accessibility audit in the repo at the current working directory.\n\n` +
    `GOAL: For the home page + global chrome, list every component/hook that produces motion and whether it respects prefers-reduced-motion.\n\n` +
    `Inspect at least: src/components/home/home-animations.tsx (GSAP), src/components/home/kinetic-text.tsx, src/components/home/pixel-smiley.tsx, src/components/home/use-cube-title-mask.ts, src/components/home/hero-title-object.tsx, src/components/home/hero-headline.tsx (animate-pulse), src/components/nav/site-nav.tsx (theme wipe + indicator), src/components/ui/custom-cursor.tsx, src/components/ui/liquid-image.tsx, src/styles.css (any @media (prefers-reduced-motion)).\n` +
    `For each: does it check window.matchMedia('(prefers-reduced-motion: reduce)') or a CSS @media block, or not? Identify the GAPS (components that animate but never gate) and recommend the concrete fallback (e.g., KineticText should render letters fully visible / opacity-only fade under reduced motion). Note that the project's stated principle is "WCAG AAA strict, full prefers-reduced-motion support, all effects degrade to opacity fade".`,
    { label: 'reduced-motion-audit', phase: 'Discover', schema: RM_SCHEMA, agentType: 'Explore' }
  ),
])

phase('Synthesize')
const design = await agent(
  `You are designing a behavior-preserving refactor for a brutalist React portfolio. The user approved: (1) consolidate all motion onto the de-facto GSAP+CSS system with a single shared tokens module src/lib/motion-tokens.ts, delete the dead src/lib/animations.ts, and remove the unused "motion" package; (2) ALSO fix the visible motion to match design principles ("bold not loud", "things snap into place", "every interaction earns its place", "WCAG AAA / full reduced-motion / degrade to opacity fade").\n\n` +
  `Here is the discovery data.\n\n` +
  `DELETION SAFETY:\n${JSON.stringify(safety, null, 2)}\n\n` +
  `LITERAL CENSUS:\n${JSON.stringify(census, null, 2)}\n\n` +
  `REDUCED-MOTION AUDIT:\n${JSON.stringify(rm, null, 2)}\n\n` +
  `Produce a precise, file-by-file refactor plan as PROSE (not JSON):\n` +
  `1. The exact API of src/lib/motion-tokens.ts — name every export and its value, derived from the census. Include: numeric easing arrays (EASE_BRUTAL etc.), a CSS_EASE_BRUTAL string 'cubic-bezier(0.16, 1, 0.3, 1)', GSAP_EASE='expo.out', the back/power eases GSAP uses, named durations (snap 0.18, fast 0.25, section 0.4, kinetic 0.6, reduced 0.3) plus any others the census surfaced, stagger presets, and the kinetic/cipher config currently duplicated in kinetic-text.tsx. Keep it framework-agnostic (no motion/react import).\n` +
  `2. For EACH consumer file, the specific literals to replace and with which token (cite the census line). Flag any literal that is intentionally one-off and should NOT be tokenized.\n` +
  `3. Hero double-animation fix: explain exactly how to stop GSAP .fade-in and KineticText from both animating the INIT_SEQUENCE label and the subhead. Recommend whether to (a) drop .fade-in from the KineticText wrappers and let KineticText own the entrance, or (b) drop KineticText scatter/typewriter and let GSAP own it. Pick the option that yields ONE choreographed intro consistent with the GSAP intro timeline, and justify.\n` +
  `4. Scatter calming: the INIT_SEQUENCE micro-label currently scatters letters ±600px/±400px/±90°. Propose the on-brand replacement (snap-in / typewriter / short-distance settle) with concrete values.\n` +
  `5. KineticText reduced-motion fallback: concrete implementation (read matchMedia once; render final state with opacity-only fade).\n` +
  `6. Pulse dot: how to make it settle once instead of animate-pulse forever, respecting reduced motion.\n` +
  `7. Call out ANY regression risk or ordering constraint (e.g., GSAP gsap.set('.fade-in') selectors that must still match, SSR/'use client' concerns, the intro timeline '-=0.55' offset).\n` +
  `Be concrete and conservative: the goal is coherence, not maximal change. Limit visible change to the items the user approved.`,
  { label: 'refactor-design', phase: 'Synthesize' }
)

return { safety, census, rm, design }
