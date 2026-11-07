# Nameet Kumar Behera — Personal Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-nameet.runs--on.dev-00f5d4?style=for-the-badge&logo=vercel&logoColor=black)](https://nameet.runs-on.dev)
[![GitHub](https://img.shields.io/badge/GitHub-NBPkiller143%2FNameet--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NBPkiller143/Nameet-dev)

> 🌐 **Live Website:** [https://nameet.runs-on.dev](https://nameet.runs-on.dev)

A handcrafted, dark editorial personal portfolio website for **Nameet Kumar Behera**, a Class 12 student developer based in Bengaluru building websites, web games, and Python applications with HTML, CSS, JavaScript, and Python.

Built with Vite, Three.js, GSAP, Lenis, and modern ES modules.

---

## 🌟 Architecture & Features

- **Modern Vite Stack**: Fast HMR during development, Rollup-optimized production builds with preloaded fonts and modern bundle splitting.
- **Design System**: Dark editorial palette (`#070708` background, `#f4f4f5` text, and `#00f5d4` cyan accent), `@fontsource-variable/archivo` and `@fontsource-variable/doto`, live IST clock, Lenis smooth scrolling, and GSAP micro-animations.
- **Page Structure (Chapters 00–08)**:
  1. `CH 00 Hello`: Live status pill with IST clock, editorial H1, bio, thumbnail strip linking to case studies, stats.
  2. `Marquee`: `[ Built with real tools ]` marquee ticker with pause/play button.
  3. `[ 01 ] The work`: Real projects with live code and case-study links:
     - **01 — Shadow Trail: The Clean Path** (Featured): Swachh Bharat mission web game (HTML, CSS, JavaScript).
     - **02 — Nature Unisex Salon**: Local business web application (Python).
  4. `[ 02 ] The problem`: Editorial statement on building things for real people vs. stopping at tutorials.
  5. `[ 03 ] How I work`: 5-step engineering process: Understand → Plan → Build → Test → Improve.
  6. `[ 04 ] Toolkit`: Interactive Three.js 3D constellation orbit with tool inspection side panel and static fallback list.
  7. `[ 05 ] What I do`: Capabilities breakdown (Websites [Most picked], AI & Computer Vision, IoT & Hardware), trust checklist, and stats.
  8. `[ 06 ] About me`: Education (Class 12 CBSE PCM + CS at PM SHRI Kendriya Vidyalaya ASC Centre, Bengaluru), technical strengths, and spoken languages.
  9. `[ 07 ] Questions`: Accessible FAQ accordion with schema markup.
  10. `[ 08 ] Your turn`: Project need selector chips, contact form (with Formspree support and `mailto:` fallback), WhatsApp direct chat link, and email copy-to-clipboard.
  11. `Footer`: Monogram, copyright, privacy policy link, back-to-top button.
- **Dedicated Pages**:
  - `/work/shadow-trail/` — Swachh Bharat adventure web game case study (Featured).
  - `/work/nature-unisex-salon/` — Local business web portal case study.
  - `/privacy/` — Privacy policy covering form submissions, consent, and rights under Indian DPDP Act.
  - `/404.html` — Custom dark editorial 404 error page.

---

## 📁 Directory Structure

```
Portfolio Website/
├── public/
│   ├── favicon.svg             # Vector NB monogram favicon
│   ├── favicon.ico             # Generated ICO favicon
│   ├── apple-touch-icon.png    # iOS touch icon
│   ├── icon-192.png            # PWA manifest icon (192px)
│   ├── icon-512.png            # PWA manifest icon (512px)
│   ├── icon-maskable-512.png   # PWA maskable icon (512px)
│   ├── site.webmanifest        # Web App Manifest
│   ├── robots.txt              # Search engine directives & AI bot permissions
│   ├── sitemap.xml             # Generated sitemap
│   ├── llms.txt                # Plain-text summary for LLMs
│   ├── llms-full.txt           # Comprehensive LLM context
│   └── images/                 # AVIF & WebP responsive project shots and headshot
│       └── cases/              # Full-page case study previews
├── scripts/
│   ├── build-pages.mjs         # Generates index cards, case studies, privacy, 404, & SEO
│   ├── generate-placeholders.mjs # Sharp script generating all responsive WebP/AVIFs
│   ├── icons.mjs               # Sharp script generating PWA icons from favicon.svg
│   ├── privacy.mjs             # Privacy policy content and generator
│   └── seo.mjs                 # Structured data (Schema.org JSON-LD), sitemap, llms.txt
├── src/
│   ├── consent.js              # Privacy consent manager
│   ├── contact.js              # Contact form handling with Formspree / mailto fallback
│   ├── main.js                 # GSAP animations, Lenis smooth scrolling, clock, nav
│   ├── styles.css              # Master dark editorial stylesheet
│   ├── toolkit.js              # Three.js 3D constellation orbit
│   ├── toolkit-data.js         # Tool definitions & project mappings
│   └── data/
│       └── projects.js         # Project definitions, case studies, and metadata
├── index.html                  # Main homepage template
├── 404.html                    # Generated 404 page
├── vercel.json                 # Vercel routing, security headers & CSP
├── vite.config.js              # Vite build config with multi-page Rollup input
└── package.json                # NPM scripts and dependencies
```

---

## 🛠️ Development & Build

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Commands

```bash
# Install dependencies
npm install

# Generate image placeholders & responsive variants
npm run images

# Generate favicons & PWA app icons
npm run icons

# Build subpages (runs automatically on predev / prebuild)
npm run pages

# Start local Vite development server
npm run dev

# Run oxlint linter
npm run lint

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## ⚙️ Configuration & Customization

### 1. Contact Form (Formspree)
In `src/contact.js`, replace:
```javascript
const FORMSPREE_ID = '<!-- TODO: Formspree ID e.g. xvgovwpr -->'
```
with your actual Formspree form ID. If left as a placeholder or if submission fails, the form automatically falls back to an encoded `mailto:nameetbehera6@gmail.com` link.

### 2. Updating Projects & Case Studies
All project information is centralized in [src/data/projects.js](file:///src/data/projects.js). When you add or edit a project, running `npm run pages` (or `npm run dev`) automatically regenerates the homepage cards and case-study pages in `work/<slug>/`.

### 3. Replacing Placeholder Images
Placeholder images are generated into `public/images/` and `public/images/cases/`. To replace them with real screenshots or photos:
- Replace `public/images/headshot-800.webp` and `public/images/headshot-480.webp` with your portrait.
- Replace `public/images/<slug>-<width>.webp` and `.avif` with your actual screenshots.
- Or simply replace the SVG generators in [scripts/generate-placeholders.mjs](file:///scripts/generate-placeholders.mjs) and run `npm run images`.

---

## 🚀 Deployment (Vercel)

1. Push your repository to GitHub (`https://github.com/NBPkiller143/Nameet-dev`).
2. Live at: [https://nameet.runs-on.dev](https://nameet.runs-on.dev) (connected via Vercel).
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Portfolio Website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add custom domain: `nameet.runs-on.dev`.
4. The included [vercel.json](file:///vercel.json) configures clean URLs and strict security headers (Content Security Policy, X-Frame-Options, HSTS).
