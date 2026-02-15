#!/usr/bin/env node

/**
 * Publish Blog Post from Draft
 *
 * Usage: node publish-blog-post.js <draft-file> <variation-number>
 * Example: node publish-blog-post.js 2026-02-15-brand-matters.md 2
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node publish-blog-post.js <draft-file> <variation-number>');
  console.error('Example: node publish-blog-post.js 2026-02-15-brand-matters.md 2');
  process.exit(1);
}

const draftFileName = args[0];
const variationNumber = parseInt(args[1]);

if (variationNumber < 1 || variationNumber > 3) {
  console.error('Variation number must be 1, 2, or 3');
  process.exit(1);
}

// Paths
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const draftsDir = path.join(projectDir, 'output', 'blog', 'drafts');
const blogDir = path.join(projectDir, 'src', 'content', 'blog');
const draftPath = path.join(draftsDir, draftFileName);

// Read draft file
if (!fs.existsSync(draftPath)) {
  console.error(`Draft file not found: ${draftPath}`);
  process.exit(1);
}

const draftContent = fs.readFileSync(draftPath, 'utf-8');

// Parse the draft
const metadataMatch = draftContent.match(/---\n([\s\S]*?)\n---/);
if (!metadataMatch) {
  console.error('Could not find metadata section in draft');
  process.exit(1);
}

// Extract metadata
const metadataSection = metadataMatch[1];
const topicMatch = metadataSection.match(/topic:\s*(.+)/);
const dateMatch = metadataSection.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
const tagsMatch = metadataSection.match(/tags:\s*\[([^\]]+)\]/);

const topic = topicMatch ? topicMatch[1] : 'Untitled';
const pubDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

// Extract the specific variation
const variationRegex = new RegExp(`## Variation ${variationNumber}:\\s*(.+?)\\n\\n([\\s\\S]*?)(?=\\n---\\n|$)`);
const variationMatch = draftContent.match(variationRegex);

if (!variationMatch) {
  console.error(`Could not find Variation ${variationNumber} in draft`);
  process.exit(1);
}

const title = variationMatch[1].trim();
const content = variationMatch[2].trim();

// Generate description (first ~150 chars of content, excluding markdown)
const plainContent = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*_`]/g, '');
const description = plainContent.split('\n\n')[0].substring(0, 150).trim() + '...';

// Generate tags from topic
const tags = topic
  .toLowerCase()
  .split(/\s+/)
  .filter(word => word.length > 3)
  .slice(0, 5);

// Add common SaaS/tech tags
tags.push('saas');
if (topic.includes('brand')) tags.push('brand');
if (topic.includes('AI') || topic.includes('ai')) tags.push('ai');

// Create frontmatter
const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: ${pubDate}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---`;

// Combine frontmatter and content
const blogPost = `${frontmatter}\n\n${content}\n`;

// Generate filename from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .substring(0, 50);

const blogFileName = `${slug}.md`;
const blogPath = path.join(blogDir, blogFileName);

// Write the blog post
fs.writeFileSync(blogPath, blogPost, 'utf-8');

console.log(`\n✅ Blog post published!`);
console.log(`📄 File: ${blogFileName}`);
console.log(`📍 Location: src/content/blog/${blogFileName}`);
console.log(`📅 Pub date: ${pubDate}`);
console.log(`🏷️  Tags: ${tags.join(', ')}\n`);

process.exit(0);
