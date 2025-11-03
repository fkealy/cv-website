# Freddie Kealy - Personal Website

My personal website and portfolio, built with modern web technologies to showcase my work as a full-stack developer and builder.

## Tech Stack

- **[Astro](https://astro.build)** - Static site generator for fast, content-focused websites
- **[Bun](https://bun.sh)** - Fast all-in-one JavaScript runtime and package manager
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## Features

- 🏠 Modern, responsive homepage with hero section
- 📝 Blog with markdown support
- 🚀 Featured projects showcase (Yotpoint, Latch Log, Emotional Scripture, etc.)
- 💼 Work experience and education timeline
- 🐝 Flappy Bee game (migrated from old site)
- ⚡ Fast build times with Bun
- 🎨 Clean design with Tailwind CSS

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start dev server at http://localhost:4321
bun run dev
```

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
/
├── public/           # Static assets (images, CV, Flappy Bee game)
├── src/
│   ├── components/   # Reusable Astro components
│   ├── content/      # Blog posts (markdown)
│   ├── layouts/      # Page layouts
│   ├── pages/        # Routes and pages
│   └── styles/       # Global styles
├── astro.config.mjs  # Astro configuration
├── tailwind.config.* # Tailwind configuration (auto-generated)
└── tsconfig.json     # TypeScript configuration
```

## Blog

Blog posts are written in Markdown and stored in `src/content/blog/`. Each post has frontmatter for metadata:

```markdown
---
title: "Post Title"
description: "Post description"
pubDate: 2025-11-03
tags: ["tag1", "tag2"]
draft: false
---

Post content here...
```

## Deployment

The site can be deployed to any static hosting provider:

- **AWS S3** (current setup)
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Build the site with `bun run build` and deploy the `dist/` directory.

## License

© 2025 Freddie Kealy. All rights reserved.
