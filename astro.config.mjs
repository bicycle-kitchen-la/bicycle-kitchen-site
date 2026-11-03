import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bicyclekitchen.org',
  // Pages live at clean URLs like /hours, with no trailing slash.
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
});
