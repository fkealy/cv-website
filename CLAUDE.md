# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal CV/portfolio website for Freddie Kealy, built with Astro 5, showcasing projects, work experience, and blog posts. The site features custom view transitions and is deployed to Cloudflare Pages.

## Tech Stack

- **Astro 5**: Static site generator with view transitions enabled
- **Bun**: JavaScript runtime and package manager (use Bun, not npm/yarn)
- **Tailwind CSS v4**: Via `@tailwindcss/vite` plugin (no separate config file needed)
- **TypeScript**: Strict mode enabled

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

### View Transitions

Custom view transition animations are implemented in `src/layouts/BaseLayout.astro`:
- Global transitions enabled via `viewTransitions: true` in `astro.config.mjs`
- Custom animation logic handles directional transitions (left/right) based on navigation path
- Animations are defined using CSS custom properties: `--blog-old-animation`, `--blog-slide-in`
- Event listeners: `astro:before-preparation` sets up animations, `astro:page-load` resets them

Key navigation patterns:
- Home ↔ Blog: Slide left/right (blog is "to the right" of home)
- Blog ↔ Post: Slide left/right (posts are "to the right" of blog index)

### Component Structure

- `BaseLayout.astro`: Main layout with head, nav, analytics, and transition logic
- `Nav.astro`: Navigation component (included in all pages via BaseLayout)
- Page components: `Hero.astro`, `Projects.astro`, `Experience.astro`, `Footer.astro`
- Pages use `transition:name` and `transition:persist` for smooth animations

### Styling

- Global styles in `src/styles/global.css`
- Tailwind CSS v4 configured via Vite plugin (no tailwind.config.js needed)
- Custom animations defined in global.css for view transitions

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
- View transitions require careful handling of animation state - check BaseLayout for patterns
- Blog posts must match the Zod schema in `src/content/config.ts`
- Cloudflare analytics token is embedded in BaseLayout (token: 35fae063ae114a9cb2bee51bb088071c)

IMPORTANT: everytime you write some content - Make sure you use the humanizer skill in cv-website/.claude/skills/humanizer
