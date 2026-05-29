# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev           # Start dev server on port 3000
bun run build         # Production build
bun run lint          # Biome lint check
bun run format        # Biome auto-format
bun run preview       # Build + local Cloudflare Workers preview
bun run deploy        # Build + deploy to Cloudflare Workers
bun run release       # Semantic versioning (CI runs this on push to main)
```

## Tech Stack

- **Framework:** TanStack Start (React 19 full-stack framework) with TanStack Router
- **Styling:** Tailwind CSS v4 with oklch color variables, brutalist design system
- **Animation:** GSAP + ScrollTrigger (via `@gsap/react`'s `useGSAP`); shared motion tokens (easing/durations/stagger/kinetic config) in `src/lib/motion-tokens.ts`
- **Content:** MDX blog articles with rehype-pretty-code, remark-gfm
- **Deploy:** Cloudflare Workers via Wrangler
- **Linting:** Biome (extends ultracite), enforced via lefthook pre-commit/pre-push hooks
- **Package manager:** Bun only. Do not use pnpm/npm/yarn commands in this project.

## Architecture

### Routing

TanStack Router with file-based routing in `src/routes/`. Route tree auto-generated in `src/routeTree.gen.ts` (do not edit). Root shell in `__root.tsx` wraps all pages with ThemeProvider → ScrollProvider → SiteNav → main.

### Home Page — Native Scroll, 5 Sections

The home page (`src/routes/index.tsx`) uses native scroll with scroll-linked animations. Five full-height sections: Hero, About, Projects, Writing, CTA. Scroll-driven effects (intro choreography, pinned protocol scrub, section reveals, parallax) are orchestrated with GSAP + ScrollTrigger in `src/components/home/home-animations.tsx`.

Key files: `src/components/home/home-animations.tsx` (GSAP scroll orchestration), `src/contexts/scroll-context.tsx` (state), `src/components/providers/scroll-provider.tsx` (section tracking via IntersectionObserver-like logic), `src/components/nav/site-nav.tsx` (unified desktop top + mobile bottom nav)

### Centralized Data

`src/lib/site-data.ts` — All site content (profile, projects, nav items, social links, section IDs) in one file.

### Styling Conventions

- Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- Component classes in `src/styles.css`:
  - `.brutal-card` — 2px solid `--border-hard`, no border-radius, optional offset box-shadow via `data-shadow`
  - `.brutal-label` — Uppercase mono badge, 2px border, signal-color bg, `data-tone="b"` or `data-tone="ghost"`
  - `.brutal-tag` — 1px bordered mono pill, inverts on hover
  - `.brutal-callout` — 4px left border in signal-a, `data-tone="b"` for signal-b
  - `.brutal-mono` — Uppercase mono text, 0.2em tracking, `data-size` variants (sm, lg)
  - `.brutal-divider` — 4px separator line, `data-size` (sm, lg), `data-signal` for colored
  - `.brutal-number` — Massive section watermark index at `--type-index`
  - `.brutal-focus` — 3px solid signal-a focus ring
  - `.blog-prose` — Editorial typography with 4px left border on h2, no border-radius
- Design tokens (CSS custom properties):
  - Colors: `--background`, `--foreground`, `--surface`, `--border-hard`, `--border-soft`, `--signal-a` (red-orange), `--signal-b` (green)
  - Typography: `--type-hero` through `--type-micro`, `--type-index`
  - Shadows: `--shadow-brutal`, `--shadow-brutal-lg`
  - Fonts: `--font-geist-sans` (IBM Plex), `--font-geist-mono` (JetBrains Mono), `--font-geist-display` (Space Grotesk)
- Motion tokens in `src/lib/motion-tokens.ts`: `EASE_BRUTAL` (expo-out as a control-point array), `CSS_EASE_BRUTAL` (the `cubic-bezier()` string for CSS, mirrored as the `--ease-brutal` custom property), `GSAP_EASE`/`GSAP_BACK_*`/`GSAP_EASE_POWER*` (GSAP ease names), `DURATION_*`, `STAGGER_*`, and `KINETIC` (kinetic-text/cipher config). Framework-agnostic — imported by the GSAP timelines and the CSS-driven components alike
- Theme uses CSS custom properties with oklch color space, dark/light via next-themes
- UI primitives in `src/components/ui/` are shadcn/ui — avoid editing directly

### Content

Blog articles are MDX files in `src/content/`. Code blocks use dual themes: GitHub Dark Dimmed (dark) / Gruvbox Light Soft (light).

## Conventions

- **Commits:** Conventional Commits required (feat:, fix:, chore:, etc.) — enforced by commitlint
- **Path alias:** `@/*` maps to `src/*`
- **Biome ignores:** `src/routeTree.gen.ts`, `src/components/ui/`, `.tanstack/`, `dist/`, `build/`
- **Agent command rule:** use `bun`, `bunx`, and `bun run <script>` for all dependency, script, lint, format, build, and hook commands.

## Design Context

### Users

Dual audience: hiring managers/recruiters assessing technical ability, and fellow developers/designers seeking creative inspiration. The portfolio serves as proof of craft — a living demonstration of interactive frontend engineering.

### Brand Personality

**Bold, expressive, energetic.** This is not a quiet portfolio. It makes a statement through typography-driven brutalism, spatial depth, and motion-heavy interactivity. Every bold choice is backed by maintainable, state-driven code.

### Aesthetic Direction

- **Visual tone:** Typography-driven brutalism with high-contrast surfaces, dramatic type scale, and kinetic motion
- **Color strategy:** Near-black/near-white base with two saturated signal colors — signal-a (red-orange `oklch(0.62 0.26 29)`) and signal-b (electric green `oklch(0.72 0.18 142)`). oklch color space throughout. No gradients, no patterns — whitespace is the design element
- **Typography:** IBM Plex Sans + Noto Sans SC for body, JetBrains Mono for mono/labels, Space Grotesk for display headings. Hero text at `clamp(4rem, 10vw+1rem, 12rem)`. Massive section watermarks at `clamp(6rem, 15vw, 14rem)`
- **Animation:** Expo-out easing `[0.16, 1, 0.3, 1]` — things snap into place. 0.18s interactions, 0.4s section transitions, 0.6s kinetic text. Scroll-linked 3D with `perspective: 1200px`. All effects degrade to opacity fade for prefers-reduced-motion
- **Borders:** The core brutalist element. 2px solid `--border-hard` everywhere. No border-radius. 4px offset box-shadows
- **Theme:** Full dark/light support via next-themes with inverted oklch palette

### Design Principles

1. **Every interaction earns its place.** No decorative animation without purpose. Snap easing, scroll-linked transforms, and kinetic text guide attention — never just impress
2. **Bold, not loud.** High impact through confident typography, hard borders, and dramatic scale — not through excess
3. **Craft is the message.** The portfolio itself demonstrates the work philosophy. Code quality, animation smoothness, and interaction polish are the strongest arguments
4. **WCAG AAA strict.** Enhanced contrast, full `prefers-reduced-motion` support, semantic HTML, keyboard navigation. Signal colors restricted to ≥18px bold text or decorative use
