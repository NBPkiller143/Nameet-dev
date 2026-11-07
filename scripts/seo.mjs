// SEO + AI-discoverability files, all generated from src/data/projects.js and
// the homepage HTML so nothing drifts out of sync:
//   - JSON-LD (homepage graph, per-case-study graph)
//   - public/llms.txt, public/llms-full.txt (https://llmstxt.org)
//   - public/sitemap.xml
import fs from 'node:fs'
import { projects } from '../src/data/projects.js'
import { buildToolData } from '../src/toolkit-data.js'

export const SITE = 'https://nameet.runs-on.dev'
const today = new Date().toISOString().slice(0, 10)

export const PERSON = {
  name: 'Nameet Kumar Behera',
  jobTitle: 'Student Developer',
  email: 'nameetbehera6@gmail.com',
  phone: '+91-6360426243',
  whatsapp: 'https://wa.me/916360426243',
  github: 'https://github.com/NBPkiller143',
  city: 'Bengaluru',
  region: 'Karnataka',
  country: 'IN',
  summary:
    'Nameet Kumar Behera is a student developer in Bengaluru building websites, web games and Python projects with HTML, CSS, JavaScript and Python.',
  stats: { projects: '2', tools: '10+', languages: '3' },
}

export const OFFERS = [
  {
    name: 'Websites',
    description:
      'Clean, fast, mobile-friendly websites with HTML, CSS and JavaScript. Custom design, mobile-first, basic SEO, contact & WhatsApp integration.',
    price: null,
  },
  {
    name: 'AI & computer vision',
    description:
      'OpenCV & YOLO computer vision, Python + Flask backends.',
    price: null,
  },
  {
    name: 'IoT & hardware',
    description:
      'ESP32 / Arduino programming, sensor & device integration, web control panels, Flask backends.',
    price: null,
  },
]

const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/\s+/g, ' ')
    .trim()

/** FAQ exactly as rendered on the page (Google requires schema to match visible text). */
export function readFaq(indexHtml) {
  const items = []
  const re = /<summary>([\s\S]*?)<span class="faq__icon"[\s\S]*?<div class="faq__answer">([\s\S]*?)<\/div>/g
  let m
  while ((m = re.exec(indexHtml))) items.push({ q: stripTags(m[1]), a: stripTags(m[2]) })
  return items
}

const personNode = () => {
  const { tools } = buildToolData()
  return {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: PERSON.name,
    givenName: 'Nameet',
    familyName: 'Kumar Behera',
    jobTitle: PERSON.jobTitle,
    description: PERSON.summary,
    url: `${SITE}/`,
    image: `${SITE}/images/og-image.jpg`,
    email: `mailto:${PERSON.email}`,
    telephone: PERSON.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.city,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    homeLocation: { '@type': 'Place', name: 'Bengaluru, India' },
    sameAs: [PERSON.github],
    knowsLanguage: ['en', 'hi', 'or'],
    knowsAbout: [
      ...tools.map((t) => t.name),
      'Computer Vision',
      'Machine Learning',
      'Flask Backend APIs',
      'ESP32 Robotics',
      'Web Development',
      'JavaScript',
      'Python',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Student Developer',
      occupationLocation: { '@type': 'City', name: 'Bengaluru' },
      skills: 'Python, Flask, OpenCV, YOLO, ESP32, JavaScript, HTML, CSS, SQLite, Git, Arduino IDE',
    },
  }
}

function offerNode(o) {
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: o.name,
      description: o.description,
    },
  }
}

export function homeJsonLd(indexHtml) {
  const faq = readFaq(indexHtml)
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: PERSON.name,
      description: PERSON.summary,
      inLanguage: 'en',
      publisher: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: 'Nameet Kumar Behera — Student Developer in Bengaluru | Web & Python',
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${SITE}/#person` },
      primaryImageOfPage: `${SITE}/images/og-image.jpg`,
      inLanguage: 'en',
    },
    personNode(),
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE}/#service`,
      name: 'Nameet Kumar Behera — Student Developer',
      url: `${SITE}/`,
      description: PERSON.summary,
      image: `${SITE}/images/og-image.jpg`,
      email: PERSON.email,
      telephone: PERSON.phone,
      founder: { '@id': `${SITE}/#person` },
      address: {
        '@type': 'PostalAddress',
        addressLocality: PERSON.city,
        addressRegion: PERSON.region,
        addressCountry: PERSON.country,
      },
      areaServed: ['Bengaluru', 'India', 'Worldwide'],
      knowsAbout: ['Web Development', 'Python', 'Computer Vision', 'IoT Hardware', 'JavaScript'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services & Capabilities',
        itemListElement: OFFERS.map(offerNode),
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'general inquiry',
        email: PERSON.email,
        telephone: PERSON.phone,
        availableLanguage: ['English', 'Hindi', 'Odia'],
        url: `${SITE}/#contact`,
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#work`,
      name: 'Case studies',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/work/${p.slug}/`,
        name: `${p.name} — ${p.industry}`,
      })),
    },
  ]
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function caseJsonLd(p, og) {
  const url = `${SITE}/work/${p.slug}/`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: `${p.name} case study: ${p.line}`.slice(0, 110),
        description: p.intro,
        url,
        image: og,
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': `${SITE}/#person`, name: PERSON.name, url: `${SITE}/` },
        publisher: { '@type': 'Person', '@id': `${SITE}/#person`, name: PERSON.name },
        isPartOf: { '@id': `${SITE}/#website` },
        keywords: [p.industry, ...p.stack].join(', '),
        articleSection: 'Case study',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE}/#work` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
    ],
  }
}

export function llmsTxt() {
  const offerings = OFFERS.map((o) => `- **${o.name}**: ${o.description}`).join('\n')

  return `# Nameet Kumar Behera — Student Developer (Bengaluru, India)

> ${PERSON.summary}

Key facts:
- Name: Nameet Kumar Behera · Role: Student Developer · Based in Bengaluru, India (IST, UTC+5:30)
- Education: Class 12 (CBSE, PCM + Computer Science) at PM SHRI Kendriya Vidyalaya ASC Centre, Bengaluru
- Core focus: websites, web games, Python development, computer vision, IoT hardware
- Stack: Python, Flask, OpenCV, YOLO, ESP32, JavaScript, HTML, CSS, SQLite, Git, Arduino IDE
- Contact: ${PERSON.email} · WhatsApp ${PERSON.whatsapp} · ${SITE}/#contact

## Capabilities & Projects

${offerings}

## Case studies

${projects.map((p) => `- [${p.name}](${SITE}/work/${p.slug}/): ${p.line} (${p.industry}; ${p.stack.join(', ')})`).join('\n')}

## Pages

- [Home](${SITE}/): portfolio — process, work, toolkit, what I do, about, FAQ and contact
- [Contact](${SITE}/#contact): contact form, WhatsApp and email
- [Privacy policy](${SITE}/privacy/): how personal information is handled

## Optional

- [Full case-study text](${SITE}/llms-full.txt): case studies in plain text
- [Sitemap](${SITE}/sitemap.xml)
`
}

export function llmsFullTxt(indexHtml) {
  const faq = readFaq(indexHtml)
  const block = (p) => {
    const out = [`## ${p.name} — ${p.industry}${p.location ? ` (${p.location})` : ''}`, '', `URL: ${SITE}/work/${p.slug}/`, ...(p.url ? [`Code: ${p.url}`] : []), `Role: ${p.role}`, `Stack: ${p.stack.join(', ')}`, '', p.intro, '']
    if (p.context.length) out.push('### Context', '', ...p.context.flatMap((t) => [t, '']))
    if (p.challenge.length) out.push('### Challenge', '', ...p.challenge.flatMap((t) => [t, '']))
    if (p.features.length) out.push('### What was built', '', ...p.features.map((f) => `- **${f.title}**: ${f.text}`), '')
    if (p.approach.length) out.push('### Approach', '', ...p.approach.flatMap((t) => [t, '']))
    if (p.results?.length) out.push('### Results', '', ...p.results.map((r) => `- ${r.value}: ${r.label}`), '')
    out.push('### Delivered', '', p.delivered.join(' · '), '')
    return out.join('\n')
  }
  return `${llmsTxt()}
---

# Case studies (full text)

${projects.map(block).join('\n---\n\n')}
---

# Frequently asked questions

${faq.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`
}

export function sitemapXml() {
  const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/work/${p.slug}/`), `${SITE}/privacy/`]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${i === 0 ? '1.0' : u.endsWith('/privacy/') ? '0.3' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`
}

export function writeSeoFiles(indexHtml) {
  fs.writeFileSync('public/llms.txt', llmsTxt())
  fs.writeFileSync('public/llms-full.txt', llmsFullTxt(indexHtml))
  fs.writeFileSync('public/sitemap.xml', sitemapXml())
}

