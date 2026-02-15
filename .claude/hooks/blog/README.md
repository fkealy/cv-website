# Blog Post Automation

This folder contains hooks and scripts to streamline the blog post workflow.

## How It Works

### 1. Writing Blog Posts

Use the `/blog-post` command to research and write blog posts:

```
/blog-post why brand matters in the age of cheap to build saas
```

This will:
1. Research latest AI/SaaS industry news
2. Interview you to get personal insights
3. Create 3 variations (personal, industry, contrarian)
4. Humanize all variations
5. Save drafts to `/output/blog/drafts/YYYY-MM-DD-topic-slug.md`

### 2. Automatic Notification

After the draft is saved, the `publish-draft.js` hook automatically runs and notifies you:

```
✨ Blog post draft detected!
📄 Draft saved to: 2026-02-15-brand-matters.md

💡 To publish, tell Claude:
   "Publish variation [1|2|3] from the draft"
```

### 3. Publishing

To publish a variation to your blog, Claude can run:

```bash
node .claude/scripts/publish-blog-post.js <draft-filename> <variation-number>
```

Or just tell Claude:
- "Publish variation 2 from the draft"
- "Create blog post from variation 1"

This will:
1. Extract the chosen variation
2. Generate proper Astro frontmatter (title, description, pubDate, tags)
3. Create the blog post in `src/content/blog/`
4. Use a URL-friendly slug for the filename

## Files

- `publish-draft.js` - Hook that runs after drafts are created
- `../scripts/publish-blog-post.js` - Script to publish a specific variation

## Frontmatter Format

Blog posts are created with this frontmatter structure:

```yaml
---
title: "Your Post Title"
description: "Auto-generated from first paragraph (150 chars)"
pubDate: 2026-02-15
tags: ["saas", "brand", "ai"]
---
```

The schema is defined in `src/content/config.ts`.
