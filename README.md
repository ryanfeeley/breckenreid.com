# 🏺 Clay Theme for Astro

[![Netlify Status](https://api.netlify.com/api/v1/badges/098d9ba5-fd1a-4c6b-83c1-0b70fd7e017c/deploy-status)](https://app.netlify.com/projects/clay-astro-theme/deploys)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-orange?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A minimalist, image-centric theme for photographers and artists. Originally a Gatsby theme, now fully ported to **Astro** for superior performance and modern development experience.

> **Note**: This theme is a modern Astro port of the beautiful [Clay Theme](https://github.com/lilxyzz/clay-theme) by `lilxyzz`.

<p align="center">
  <img src="public/img/clay_astro_light.png" width="48%" alt="Light Mode" style="border-radius: 10px; border: 1px solid #ddd;">
  <img src="public/img/clay_astro_dark.png" width="48%" alt="Dark Mode" style="border-radius: 10px; border: 1px solid #333;">
</p>

📺 Check out the [Live Demo](https://clay-astro-theme.netlify.app) or view on the [Astro Themes Portal](https://astro.build/themes/details/clay/)

---

## ✨ Features

- ⚡ **Astro-Powered** - Blazing fast static site generation with zero-JS output by default
- 🎨 **Beautiful Design** - Minimalist and image-centric layout perfect for portfolios
- 🔄 **Client Router** - Seamless client-side navigation for an SPA-like feel
- 📱 **Responsive Design** - Mobile-friendly layout with a collapsible menu
- 🌗 **Dark Mode** - Native dark mode support with toggle switch and persistence
- 📝 **CMS Ready** - Optional **Decap CMS** support (disabled by default, see customization section)
- 🎯 **Scoped CSS** - Modular, component-scoped styles replacing legacy monolithic CSS
- ✍️ **Typography** - Futura for titles/menu (Small Caps) and EB Garamond for body
- 📚 **Content Collections** - Type-safe Markdown content management

---

## 🚀 Getting Started

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/clay-astro-theme.git
cd clay-astro-theme

# Install dependencies and start dev server
npm install && npm run dev
```

Visit `http://localhost:4321` to see your site in action! 🎉

### Detailed Installation

If you prefer a step-by-step approach:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    The output will be in the `dist/` directory, ready for deployment.

---

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[Decap CMS](https://decapcms.org/)** - Headless CMS (optional, disabled by default)
- **[PostCSS](https://postcss.org/)** - CSS Processing
- **TypeScript** - Type Safety
- **Markdown/MDX** - Content Management

### Key Dependencies

- **Core**: `astro`
- **Integrations**: `@astrojs/sitemap`
- **Styling**: `postcss`, `autoprefixer`
  - Plugins: `postcss-color-function`, `postcss-custom-properties`, `postcss-easy-import`

---

## 📁 Project Structure

```text
/
├── public/                 # Static assets (images, admin config)
│   ├── admin/              # Decap CMS configuration
│   └── img/                # Uploaded images
├── src/
│   ├── components/         # Reusable Astro components (PostCard, etc.)
│   ├── content/            # Content Collections (Markdown/MDX)
│   │   ├── news/           # News/blog posts
│   │   ├── pages/          # Static pages
│   │   ├── sold/           # Sold items (for artists)
│   │   └── work/           # Portfolio work items
│   ├── layouts/            # Main layouts (Layout.astro)
│   ├── pages/              # Route definitions
│   │   ├── index.astro     # Home page
│   │   ├── [...slug].astro # Dynamic route for generic pages
│   │   └── work/[slug].astro # Dynamic routes for collections
│   ├── styles/             # Global variables and resets
│   │   ├── content.css     # Typography for markdown content
│   │   └── vars.css        # CSS Variables (Colors, Fonts)
│   └── templates/          # Templates for different content types
├── astro.config.mjs        # Astro configuration
├── postcss.config.cjs      # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🎨 Customization

### Fonts & Colors

Edit `src/styles/vars.css` to update CSS variables for colors, fonts, and breakpoints:

```css
:root {
  --color-primary: #3eb0ef;
  --color-base: #131313;
  --font-serif: 'EB Garamond', Georgia, Times, serif;
  /* ... more variables */
}
```

### Content Management

#### Direct Editing (Recommended)

Add or edit markdown files directly in the `src/content/` folders:
- `src/content/news/` - Blog posts/news items
- `src/content/work/` - Portfolio work items
- `src/content/sold/` - Exhibition/sold items
- `src/content/pages/` - Static pages (bio, contact, etc.)

#### Decap CMS (Optional)

> **⚠️ Note**: The Decap CMS configuration is **disabled by default** (`public/admin/config.yml.disabled`) to ensure smooth deployments.

**For showcase/demo purposes**: The CMS is not needed. Edit content files directly in your repository.

##### Current workflow (exact state)

- **Collection model**: Multi-collection CMS, not pages-only. `public/admin/config.yml.disabled` defines folder collections (`blog`, `work`, `exhibitions`) and a file-based `pages` collection.
- **Config file state**: `public/admin/config.yml` is currently **not present**; the only committed config is `public/admin/config.yml.disabled`.
- **Admin script/package**: This project should use **Decap CMS** (`decap-cms` / `@decapcms/app`) for `/admin`. If you enable CMS, update `public/admin/index.html` to load Decap CMS (instead of legacy Netlify CMS script references).

##### Local backend + production auth requirements

- **Local authoring**:
  1. Enable the config file:
     ```bash
     cp public/admin/config.yml.disabled public/admin/config.yml
     ```
  2. Keep `local_backend: true` in the active config.
  3. Start the local proxy backend in a second terminal:
     ```bash
     npx decap-server
     ```
  4. Run Astro locally and open `/admin`:
     ```bash
     npm run dev
     ```
- **Production**:
  1. Keep `backend.name: github` and set `backend.repo` to your production repository.
  2. Configure GitHub OAuth (client ID/secret) plus any host-specific Decap auth endpoint your platform requires.
  3. Set OAuth callback URL(s) to your deployed admin path (for example, `https://<your-domain>/admin/`).
  4. Restrict login to approved GitHub users/teams with explicit repo access.

##### Decap readiness checklist (pre-launch)

- [ ] `public/admin/config.yml` exists in the deploy context and matches production repo/branch.
- [ ] `/admin` loads with Decap CMS assets (not legacy Netlify CMS assets).
- [ ] OAuth login succeeds for authorized users and fails for unauthorized users.
- [ ] Create/update/delete content operations commit to the expected branch.
- [ ] Uploaded media lands in `public/img` and resolves correctly on the built site.

### Navigation

Edit the `<nav>` section in `src/layouts/Layout.astro` to customize menu links.

---

## 🚀 Deployment

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Deploy to Vercel

```bash
npm run build
# Upload dist/ folder to Vercel
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- **Original Theme**: [Clay Theme](https://github.com/lilxyzz/clay-theme) by `lilxyzz`
- **Framework**: [Astro](https://astro.build)
- **CMS**: [Decap CMS](https://decapcms.org/)



<p align="center">Made with ❤️ using Astro</p>

---

## 🧪 Theme cleanup regression check

Use snapshot comparison to ensure critical routes remain identical during theme purge/refactor work.

### Route manifest

Retained routes and allowed deletion patterns are declared in `qa-routes.manifest.json`.

- `routes`: routes expected to stay content-identical
- `allowedMissingPatterns`: routes that can be intentionally removed (defaults include `/sold/*`, `/news/*`, `/work/*`)

### Commands

```bash
# Capture snapshots to qa-snapshots/current
BASE_URL=http://127.0.0.1:4321 npm run qa:snapshot

# Capture baseline snapshots (typically from main) to qa-snapshots/baseline
BASE_URL=http://127.0.0.1:4321 npm run qa:snapshot:baseline

# Diff baseline vs current and fail on changes
npm run qa:snapshot:diff
```

### Recommended workflow

1. Checkout `main`, run your site locally, and generate baseline snapshots:
   ```bash
   git checkout main
   npm run build && npm run preview
   BASE_URL=http://127.0.0.1:4321 npm run qa:snapshot:baseline
   ```
2. Switch to your cleanup branch and regenerate current snapshots:
   ```bash
   git checkout <purge-branch>
   npm run build && npm run preview
   BASE_URL=http://127.0.0.1:4321 npm run qa:snapshot
   ```
3. Verify no unexpected route changes:
   ```bash
   npm run qa:snapshot:diff
   ```

The diff command exits non-zero if any retained route snapshot changes. Missing routes only pass when they match explicit ignore patterns from the manifest (or `SNAPSHOT_DIFF_IGNORE`).
