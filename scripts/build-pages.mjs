// Builds the homepage work cards and every /work/<slug>/ case-study page
// from src/data/projects.js. Runs automatically before `dev` and `build`.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { projects } from '../src/data/projects.js'
import { homeJsonLd, caseJsonLd, writeSeoFiles } from './seo.mjs'
import { UPDATED, PRIVACY_INTRO, PRIVACY_SECTIONS } from './privacy.mjs'

const SITE = 'https://nameet.runs-on.dev'
const pad = (n) => String(n).padStart(2, '0')
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function picture(base, widths, sizes, alt, { lazy = true, attrs = '' } = {}) {
  const set = (ext) => widths.map((w) => `/images/${base}-${w}.${ext} ${w}w`).join(', ')
  const fallback = `/images/${base}-${widths[Math.min(1, widths.length - 1)]}.webp`
  return `<picture>
                <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}" />
                <img src="${fallback}" srcset="${set('webp')}" sizes="${sizes}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"${attrs} />
              </picture>`
}

// Height of each full-page capture (1200px wide), for scroll-through previews if present
const fullHeights = {}
for (const p of projects) {
  const file = path.join('public', `images/cases/${p.slug}-full-1200.webp`)
  if (fs.existsSync(file)) fullHeights[p.slug] = (await sharp(file).metadata()).height
}

/* ---------------------------------------------------------
   Homepage cards
   --------------------------------------------------------- */
function card(p, i) {
  const isCode = (p.url || '').includes('github.com')
  const actionLabel = isCode ? 'Code ↗' : 'Live site ↗'
  const liveLink = p.url ? `\n                  <a class="card__live" href="${p.url}" target="_blank" rel="noopener">${actionLabel}<span class="sr-only"> (opens in a new tab)</span></a>` : ''

  return `            <article class="card" style="--i:${i}" data-card>
              <div class="card__info">
                <p class="card__meta"><b>${pad(i + 1)}</b><span>${esc(p.industry)}</span>${p.location ? `<span>${esc(p.location)}</span>` : ''}</p>
                <h3>${esc(p.name)}</h3>
                <p class="card__line">${esc(p.line)}</p>
                <dl class="card__facts">
                  <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
                  <div><dt>Stack</dt><dd>${esc(p.stack.join(' · '))}</dd></div>
                </dl>
                <div class="card__actions">
                  <a class="card__cta" href="/work/${p.slug}/">Read the case study <span aria-hidden="true">→</span></a>${liveLink}
                </div>
              </div>
              <a class="shot" href="/work/${p.slug}/" tabindex="-1" aria-hidden="true" data-slug="${p.slug}"${fullHeights[p.slug] ? ` data-full="/images/cases/${p.slug}-full-1200" data-full-h="${fullHeights[p.slug]}"` : ''}>
                <span class="shot__bar"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></span>
                <span class="shot__media">
              ${picture(p.image || p.slug, [480, 960, 1440, 1920], '(min-width: 1360px) 700px, (min-width: 860px) 52vw, 90vw', p.slug === 'nature-unisex-salon' ? 'Nature Unisex Salon website homepage' : `${p.name} screenshot`, { attrs: ' width="1440" height="900" data-shot' })}
                </span>
              </a>
            </article>`
}

const indexPath = 'index.html'
if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8')
  const cards = projects.map(card).join('\n')
  let updated = indexHtml.replace(
    /(<!-- work:start -->)[\s\S]*?(\s*<!-- work:end -->)/,
    (_, start, end) => `${start}\n${cards}\n${end}`,
  )

  const ld = JSON.stringify(homeJsonLd(updated), null, 2).replace(/\n/g, '\n  ').replace(/</g, '\\u003c')
  updated = updated.replace(
    /<!-- ld:start -->[\s\S]*?<!-- ld:end -->/,
    () => `<!-- ld:start -->\n  <script type="application/ld+json">\n  ${ld}\n  </script>\n  <!-- ld:end -->`,
  )
  writeSeoFiles(updated)
  if (updated !== indexHtml) fs.writeFileSync(indexPath, updated)
}

/* ---------------------------------------------------------
   Case-study pages
   --------------------------------------------------------- */
const nav = `  <header class="nav" data-nav>
    <div class="nav__inner">
      <a href="/" class="nav__logo">
        <span class="nav__mark" aria-hidden="true">NB</span>
        <span class="nav__name">Nameet Behera</span>
      </a>
      <nav class="nav__links" aria-label="Primary">
        <a href="/#work">Work</a>
        <a href="/#process">Process</a>
        <a href="/#toolkit">Toolkit</a>
        <a href="/#pricing">What I do</a>
        <a href="/#note">About</a>
        <a href="/#faq">FAQ</a>
      </nav>
      <div class="nav__actions">
        <a href="/#contact" class="btn btn--light btn--sm"><span>Get in touch</span><span class="btn__chip" aria-hidden="true">↗</span></a>
        <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
          <span class="sr-only">Open menu</span>
          <span class="nav__toggle-line"></span>
          <span class="nav__toggle-line"></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden data-menu>
      <nav aria-label="Mobile">
        <a href="/"><small>00</small> Home</a>
        <a href="/#work"><small>01</small> The work</a>
        <a href="/#process"><small>03</small> How I work</a>
        <a href="/#toolkit"><small>04</small> Toolkit</a>
        <a href="/#pricing"><small>05</small> What I do</a>
        <a href="/#note"><small>06</small> About me</a>
        <a href="/#faq"><small>07</small> Questions</a>
        <a href="/#contact"><small>08</small> Contact</a>
      </nav>
      <p class="hud">nameetbehera6@gmail.com</p>
    </div>
  </header>`

const footer = `  <footer class="footer">
    <div class="container" data-footer>
      <div class="footer__top">
        <p class="hud">[ End of story — for now ]</p>
        <nav class="footer__links" aria-label="Footer">
          <a href="/#work">Work</a>
          <a href="/#pricing">What I do</a>
          <a href="/#contact">Contact</a>
          <a href="/privacy/">Privacy</a>
          <button type="button" class="footer__cookie" data-cookie-settings>Cookie settings</button>
          <a href="https://github.com/NBPkiller143" target="_blank" rel="noopener">GitHub ↗<span class="sr-only"> (opens in a new tab)</span></a>
          <a href="https://wa.me/916360426243" target="_blank" rel="noopener">WhatsApp ↗<span class="sr-only"> (opens in a new tab)</span></a>
        </nav>
      </div>
      <p class="footer__word" aria-hidden="true">Nameet Behera</p>
      <div class="footer__bottom hud">
        <span>© <span data-year>2026</span> Nameet Kumar Behera · Designed &amp; developed in Bengaluru</span>
        <a href="/">Back to the homepage ↑</a>
      </div>
    </div>
  </footer>`

function section(num, kicker, title, body) {
  if (!body) return ''
  return `      <section class="cs-section" data-reveal>
        <h2><small>${pad(num)} — ${kicker}</small>${title}</h2>
        ${body}
      </section>`
}

function caseStudy(p, i) {
  const next = projects[(i + 1) % projects.length]
  const url = `${SITE}/work/${p.slug}/`
  const og = `${SITE}/images/og-image.jpg`
  let n = 0

  const parts = [
    p.context.length ? section(++n, 'Context', 'The background', `<div class="cs-body">${p.context.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`) : '',
    p.challenge.length ? section(++n, 'Challenge', 'The core problem', `<div class="cs-body">${p.challenge.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`) : '',
  ].filter(Boolean)

  const features = !p.features.length ? '' : section(
    ++n,
    'Features',
    'What was built',
    `<div class="cs-features">
${p.features.map((f) => `      <div class="cs-feature"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`).join('\n')}
    </div>`,
  )

  const approach = !p.approach.length ? '' : section(++n, 'Approach', 'How I built it', `<div class="cs-body">${p.approach.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`)
  const delivered = section(
    ++n,
    'Delivered',
    'What shipped',
    `<div class="cs-body">
          <ul class="cs-delivered">${p.delivered.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          <div class="hero__ctas" style="margin-top:24px">
            ${p.url ? `<a class="btn btn--light" href="${p.url}" target="_blank" rel="noopener"><span>View on GitHub</span><span class="sr-only"> (opens in a new tab)</span><span class="btn__chip" aria-hidden="true">↗</span></a>` : ''}
            <a class="btn btn--line" href="/#contact"><span>Get in touch</span></a>
          </div>
        </div>`,
  )

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <title>${esc(p.name)} Case Study — Nameet Kumar Behera</title>
  <meta name="description" content="${esc(p.line)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Nameet Kumar Behera" />
  <meta property="og:title" content="${esc(p.name)} — Case Study by Nameet Kumar Behera" />
  <meta property="og:description" content="${esc(p.line)}" />
  <meta property="og:image" content="${og}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.name)} — Case Study by Nameet Kumar Behera" />
  <meta name="twitter:description" content="${esc(p.line)}" />
  <meta name="twitter:image" content="${og}" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <script type="application/ld+json">
  ${JSON.stringify(caseJsonLd(p, og))}
  </script>
  <script>
    document.documentElement.classList.add('js');
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      e.viewTransition.finished.finally(function () { el.style.viewTransitionName = ''; });
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <section class="cs-hero container" aria-labelledby="cs-title">
      <a class="cs-back" href="/#work">← All work</a>
      <p class="chapter__label hud hero-in"><span class="hud__bracket">[</span> Case study ${pad(i + 1)} / ${pad(projects.length)} <span class="hud__bracket">]</span> ${esc(p.industry)}</p>
      <h1 class="cs-title" id="cs-title"><span class="line"><span class="line__inner">${esc(p.name)}</span></span></h1>
      <p class="cs-intro hero-in hero-in--soft" style="--d:.3s">${esc(p.intro)}</p>
      <dl class="cs-meta hero-in" style="--d:.45s">
        <div><dt>Project</dt><dd>${esc(p.name)}</dd></div>
        <div><dt>Domain</dt><dd>${esc(p.industry)}</dd></div>
        ${p.location ? `<div><dt>Location</dt><dd>${esc(p.location)}</dd></div>` : ''}
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Stack</dt><dd>${esc(p.stack.join(', '))}</dd></div>
        ${p.url ? `<div><dt>Repository</dt><dd><a href="${p.url}" target="_blank" rel="noopener">GitHub ↗<span class="sr-only"> (opens in a new tab)</span></a></dd></div>` : ''}
      </dl>
    </section>

    <section class="cs-cover container hero-in" style="--d:.6s" aria-label="Project Preview">
      <div class="shot" data-cover-shot>
        <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></div>
        <div class="shot__media">
          ${picture(p.image || p.slug, [960, 1440, 1920, 2560], '(min-width: 1320px) 1220px, 92vw', p.slug === 'nature-unisex-salon' ? 'Nature Unisex Salon website homepage' : `${p.name} preview`, { lazy: false, attrs: ' width="1440" height="900" data-shot' })}
        </div>
      </div>
    </section>

    <div class="container">
${parts.join('\n')}
    </div>

    <div class="container">
${features}
    </div>

    <div class="container">
${approach}
${delivered}
    </div>

    <a class="cs-next" href="/work/${next.slug}/">
      <span class="hud">Next project →</span>
      <span class="cs-next__title">${esc(next.name)}</span>
      <span class="cs-next__meta">${esc(next.industry)}${next.location ? ` · ${esc(next.location)}` : ''}</span>
    </a>
  </main>

  <div class="mcta" data-mcta>
    <a class="btn btn--light mcta__main" href="/#contact"><span>Get in touch</span><span class="btn__chip" aria-hidden="true">↗</span></a>
    <a class="mcta__wa" href="https://wa.me/916360426243" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg><span class="sr-only">Chat on WhatsApp (opens in a new tab)</span></a>
  </div>
${footer}
</body>
</html>
`
}

projects.forEach((p, i) => {
  const dir = path.join('work', p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), caseStudy(p, i))
})

// Privacy page
const privacyTitle = 'Privacy Policy — Nameet Kumar Behera'
const privacyDesc = 'Privacy practices and data choices for the portfolio of Nameet Kumar Behera.'
fs.mkdirSync('privacy', { recursive: true })
fs.writeFileSync(
  path.join('privacy', 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <title>${privacyTitle}</title>
  <meta name="description" content="${privacyDesc}" />
  <link rel="canonical" href="${SITE}/privacy/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}/privacy/" />
  <meta property="og:site_name" content="Nameet Kumar Behera" />
  <meta property="og:title" content="${privacyTitle}" />
  <meta property="og:description" content="${privacyDesc}" />
  <meta property="og:image" content="${SITE}/images/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <script>
    document.documentElement.classList.add('js');
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      e.viewTransition.finished.finally(function () { el.style.viewTransitionName = ''; });
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <article class="legal container">
      <header class="legal__head">
        <p class="chapter__label hud"><span class="hud__bracket">[</span> Legal <span class="hud__bracket">]</span> Last updated ${UPDATED}</p>
        <h1 class="legal__title">Privacy policy</h1>
        <p class="legal__intro">${PRIVACY_INTRO}</p>
      </header>
${PRIVACY_SECTIONS.map(
  (sec, i) => `      <section class="legal__section">
        <h2><small>${pad(i + 1)}</small>${sec.title}</h2>
        <div class="legal__body">${sec.body}</div>
      </section>`,
).join('\n')}
    </article>
  </main>

${footer}
</body>
</html>
`,
)

// Branded 404 page
fs.writeFileSync(
  '404.html',
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <meta name="robots" content="noindex" />
  <title>Page not found — Nameet Kumar Behera</title>
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <script>
    document.documentElement.classList.add('js');
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      e.viewTransition.finished.finally(function () { el.style.viewTransitionName = ''; });
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <section class="notfound container" aria-labelledby="nf-title">
      <p class="chapter__label hud"><span class="hud__bracket">[</span> 404 <span class="hud__bracket">]</span> Page not found</p>
      <h1 class="notfound__title" id="nf-title">This page took a <em>wrong turn.</em></h1>
      <p class="notfound__text">The link may be old or mistyped. Everything I’ve built is still one click away.</p>
      <div class="hero__ctas">
        <a class="btn btn--light" href="/#work"><span>See the work</span><span class="btn__chip" aria-hidden="true">↗</span></a>
        <a class="btn btn--line" href="/#contact"><span>Get in touch</span></a>
      </div>
      <ul class="notfound__links" aria-label="Case studies">
${projects.map((p) => `        <li><a href="/work/${p.slug}/">${esc(p.name)}</a></li>`).join('\n')}
      </ul>
    </section>
  </main>

${footer}
</body>
</html>
`,
)
console.log('✓ pages built successfully')
