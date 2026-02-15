#!/usr/bin/env node

/**
 * Blog Post Draft Publisher Hook
 *
 * This hook runs after the blog-post command completes.
 * It helps publish a draft from /output/blog/drafts to src/content/blog
 * with proper Astro frontmatter formatting.
 */

const fs = require('fs');
const path = require('path');

// Get the file that was just written from the hook environment
const toolUse = process.env.CLAUDE_TOOL_USE ? JSON.parse(process.env.CLAUDE_TOOL_USE) : null;

// Check if this was a Write operation to the drafts folder
if (!toolUse || toolUse.tool !== 'Write') {
  process.exit(0);
}

const filePath = toolUse.parameters?.file_path || '';

// Only proceed if we're writing to the blog drafts folder
if (!filePath.includes('/output/blog/drafts/')) {
  process.exit(0);
}

// Read the draft file
const draftContent = fs.readFileSync(filePath, 'utf-8');

// Check if this is a draft file with metadata (from blog-post command)
if (!draftContent.includes('---\ntopic:') && !draftContent.includes('## Variation')) {
  process.exit(0);
}

console.log('\n✨ Blog post draft detected!');
console.log(`📄 Draft saved to: ${path.basename(filePath)}`);
console.log('\n💡 To publish, tell Claude:');
console.log('   "Publish variation [1|2|3] from the draft"');
console.log('   or');
console.log('   "Create blog post from variation 2 of the draft"\n');

process.exit(0);
