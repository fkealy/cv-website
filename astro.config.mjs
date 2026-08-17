// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // /extra was the old name for the concepts page; keep inbound links working.
  redirects: {
    '/extra': '/concepts',
  },
});
