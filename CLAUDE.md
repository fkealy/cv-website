# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal CV/portfolio website for Freddie Kealy, built with Astro 5, showcasing projects, work experience, and blog posts. Dark, animation-heavy design (GSAP + three.js), deployed to Cloudflare Pages.

## Tech Stack

- **Astro 5**: Static site generator
- **Bun**: JavaScript runtime and package manager (use Bun, not npm/yarn)
- **GSAP** (ScrollTrigger) for scroll choreography, **three.js** for the WebGL particle-wave backdrop
- **TypeScript**: Strict mode enabled
- Styling is hand-rolled CSS in each page/layout (CSS custom properties, no Tailwind in the live pages)

## Development Commands

```bash
# Install dependencies
bun install

# Start dev server at http://localhost:4321
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Build and deploy to Cloudflare Pages
bun run deploy
```

## Architecture

### Content Collections

Blog posts are managed via Astro Content Collections:
- Schema defined in `src/content/config.ts` with Zod validation
- Posts stored as markdown in `src/content/blog/`
- Frontmatter fields: `title`, `description`, `pubDate`, `author`, `tags`, `draft`

### Layout & Pages

- `src/layouts/V2Layout.astro`: shared shell for every page — head/meta, fonts (Space Grotesk + JetBrains Mono), WebGL canvas, grain overlay, custom cursor, auto-hiding topbar, design tokens (CSS custom properties) and base styles. Takes `title`, `description`, and `waveAmp` (particle wave intensity) props.
- `src/scripts/v2.ts`: shared client behavior — `initGL()` (three.js particle wave), `initCursor()`, `initTopbar()`, `splitChars()` for text reveals, and the `reduceMotion` flag.
- Pages (`index.astro`, `blog/index.astro`, `blog/[...slug].astro`) hold their own section markup, page styles, and GSAP animation scripts.

### Animation conventions

- All animation honors `prefers-reduced-motion`; appending `?static` to any URL takes the same no-animation path (useful for testing/screenshots).
- Intro timelines have a `setTimeout` fallback that jumps them to completion if `requestAnimationFrame` stalls — keep this when adding new intros so content never stays hidden.
- Scroll reveals use the `data-reveal` / `data-row` attributes; hover targets that should enlarge the custom cursor use `data-hover`; magnetic elements use `data-magnetic`.

### Static Assets

Located in `public/`:
- `CV/`: PDF versions of CV
- `flappy-bee/`: HTML5 game
- `assets/`: Images and other static resources
- `bee-favicon.svg`: Site favicon

## Deployment

Deploys to Cloudflare Pages via Wrangler:
- Config in `wrangler.toml`
- Build output: `dist/` directory
- Deploy command: `bun run deploy` (builds then runs `npx wrangler pages deploy dist`)

## Important Notes

- Always use `bun` for package management, not npm or yarn
- Blog posts must match the Zod schema in `src/content/config.ts`
- Cloudflare analytics token is embedded in V2Layout (token: 35fae063ae114a9cb2bee51bb088071c)

IMPORTANT: everytime you write some content - Make sure you use the humanizer skill in cv-website/.claude/skills/humanizer
