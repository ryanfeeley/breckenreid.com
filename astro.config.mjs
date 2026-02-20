// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://clay-astro-theme.netlify.app';
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
    site,
    base,
    integrations: [sitemap()],
});
