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

## Freddie Kealy CV -  PWA Documentation 

This is the documentation for the Freddie Kealy CV - PWA project. 

### Inputs

* **User:** A potential employer or recruiter visiting the CV website.
* **Code:** The code base for the project, containing HTML, CSS, JavaScript, and various assets.

### Outputs

* **Downloadable CV:** A PDF version of my CV can be downloaded from the website.
* **Flappy Bee Game:** A fun, interactive Flappy Bird style game coded in HTML5/JavaScript.
* **Offline Availability:** The PWA is designed to be accessible offline, providing a basic version of the CV website.

### Purpose

The project aims to present my CV in a modern, engaging, and easily accessible format. The PWA functionality allows for offline access and the Flappy Bee game adds a fun element to the experience. This creates a unique and memorable online presence for Freddie Kealy. 

### Usage

* **Users:** Potential employers can easily access and review Freddie Kealy's CV from any device and potentially even offline. They can also play the Flappy Bee game, which demonstrates Freddie Kealy's programming skills and adds a touch of personality to his online presence. 
* **Freddie Kealy:** Freddie Kealy can use the website to easily share his CV with potential employers and showcase his skills in a dynamic and interactive way.
