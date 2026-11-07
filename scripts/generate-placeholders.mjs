// Generates tasteful dark placeholder images matching reference sizes & formats
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const OUT = 'public/images'
const CASES = 'public/images/cases'
await fs.mkdir(OUT, { recursive: true })
await fs.mkdir(CASES, { recursive: true })

const SHOT_WIDTHS = [480, 960, 1440, 1920, 2560]

function shadowTrailSvg() {
  return Buffer.from(`<svg width="1920" height="1200" viewBox="0 0 1920 1200" xmlns="http://www.w3.org/2000/svg">
    <rect width="1920" height="1200" fill="#070c0c"/>
    <defs>
      <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#101a1a" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1920" height="1200" fill="url(#grid2)"/>

    <rect x="60" y="50" width="1800" height="70" rx="10" fill="#0b1414" stroke="#162928" stroke-width="1.5"/>
    <circle cx="95" cy="85" r="7" fill="#ff5f56"/>
    <circle cx="120" cy="85" r="7" fill="#ffbd2e"/>
    <circle cx="145" cy="85" r="7" fill="#27c93f"/>
    <text x="185" y="91" fill="#00f5d4" font-family="'Archivo Variable', sans-serif" font-size="22" font-weight="700">SHADOW TRAIL: THE CLEAN PATH</text>
    <text x="1380" y="91" fill="#6a918f" font-family="'Archivo Variable', monospace" font-size="16">SWACHH BHARAT WEB GAME · CANVAS &amp; JS</text>

    <rect x="60" y="150" width="1800" height="980" rx="8" fill="#091010" stroke="#162928" stroke-width="1.5"/>
    <text x="120" y="230" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="36" font-weight="700">QUEST 01: ECO ADVENTURE WALKTHROUGH</text>
    <text x="120" y="280" fill="#00f5d4" font-family="monospace" font-size="20">CLEANLINESS INDEX: 94%  |  SCORE: 004820  |  STATUS: PATROL ACTIVE</text>

    <rect x="120" y="330" width="1680" height="680" rx="6" fill="#050808" stroke="#142422" stroke-width="1"/>
    <text x="960" y="660" fill="#3d615f" font-family="'Archivo Variable', sans-serif" font-size="42" font-weight="700" text-anchor="middle">🎮 INTERACTIVE 2D CANVAS PLAYFIELD</text>
    <text x="960" y="720" fill="#2c4745" font-family="monospace" font-size="20" text-anchor="middle">Vanilla HTML5 Canvas &amp; JavaScript Game Loop</text>
  </svg>`)
}

function salonSvg() {
  return Buffer.from(`<svg width="1920" height="1200" viewBox="0 0 1920 1200" xmlns="http://www.w3.org/2000/svg">
    <rect width="1920" height="1200" fill="#0b090b"/>
    <defs>
      <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#191319" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1920" height="1200" fill="url(#grid3)"/>

    <rect x="60" y="50" width="1800" height="70" rx="10" fill="#130e13" stroke="#2a1c2a" stroke-width="1.5"/>
    <circle cx="95" cy="85" r="7" fill="#ff5f56"/>
    <circle cx="120" cy="85" r="7" fill="#ffbd2e"/>
    <circle cx="145" cy="85" r="7" fill="#27c93f"/>
    <text x="185" y="91" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="22" font-weight="700">NATURE UNISEX SALON</text>
    <text x="1460" y="91" fill="#8f728f" font-family="'Archivo Variable', monospace" font-size="16">LOCAL BUSINESS · PYTHON BACKEND</text>

    <rect x="60" y="150" width="1800" height="980" rx="8" fill="#110c11" stroke="#2a1c2a" stroke-width="1.5"/>
    <text x="120" y="240" fill="#00f5d4" font-family="'Archivo Variable', sans-serif" font-size="34" font-weight="700">PREMIUM STYLING &amp; GROOMING SERVICES</text>
    <text x="120" y="290" fill="#b09fb0" font-family="'Archivo Variable', sans-serif" font-size="20">Modern digital presence &amp; customer appointment inquiries.</text>

    <rect x="120" y="360" width="480" height="340" rx="8" fill="#160f16" stroke="#331e33" stroke-width="1.5"/>
    <text x="160" y="420" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="24" font-weight="700">Hair &amp; Styling</text>
    <text x="160" y="460" fill="#8f728f" font-family="'Archivo Variable', sans-serif" font-size="16">Cuts, coloring &amp; hair treatments</text>

    <rect x="640" y="360" width="480" height="340" rx="8" fill="#160f16" stroke="#331e33" stroke-width="1.5"/>
    <text x="680" y="420" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="24" font-weight="700">Skin &amp; Facial</text>
    <text x="680" y="460" fill="#8f728f" font-family="'Archivo Variable', sans-serif" font-size="16">Facials, cleanup &amp; skin therapy</text>

    <rect x="1160" y="360" width="480" height="340" rx="8" fill="#160f16" stroke="#331e33" stroke-width="1.5"/>
    <text x="1200" y="420" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="24" font-weight="700">Grooming Packages</text>
    <text x="1200" y="460" fill="#8f728f" font-family="'Archivo Variable', sans-serif" font-size="16">Complete salon packages</text>
  </svg>`)
}

function headshotSvg() {
  return Buffer.from(`<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="800" fill="#07080a"/>
    <circle cx="400" cy="400" r="320" fill="#0d1117" stroke="#1f2937" stroke-width="2"/>
    <circle cx="400" cy="400" r="280" fill="#0a0d12" stroke="#00f5d4" stroke-opacity="0.3" stroke-width="1.5"/>
    <text x="400" y="445" text-anchor="middle" font-family="'Archivo Variable', sans-serif" font-size="140" font-weight="700" letter-spacing="-3" fill="#00f5d4">NB</text>
  </svg>`)
}

function ogSvg() {
  return Buffer.from(`<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#07080a"/>
    <rect x="40" y="40" width="1120" height="550" rx="16" fill="#0c1017" stroke="#1f2937" stroke-width="1.5"/>
    <text x="90" y="120" fill="#00f5d4" font-family="monospace" font-size="18" font-weight="700" letter-spacing="2">[ NAMEET KUMAR BEHERA — BENGALURU, IN ]</text>
    <text x="90" y="230" fill="#f4f4f1" font-family="'Archivo Variable', sans-serif" font-size="60" font-weight="700" letter-spacing="-2">Building things for the</text>
    <text x="90" y="305" fill="#00f5d4" font-family="'Archivo Variable', sans-serif" font-size="60" font-weight="700" letter-spacing="-2">web and the real world.</text>
    <text x="90" y="390" fill="#8896a8" font-family="'Archivo Variable', sans-serif" font-size="24">Student Developer · Web &amp; Python</text>
    <rect x="90" y="460" width="360" height="54" rx="27" fill="#00f5d4"/>
    <text x="270" y="495" fill="#07080a" font-family="'Archivo Variable', sans-serif" font-size="20" font-weight="700" text-anchor="middle">nameet.runs-on.dev</text>
  </svg>`)
}

const jobs = [
  { slug: 'shadow-trail', svg: shadowTrailSvg },
  { slug: 'nature-unisex-salon', svg: salonSvg },
]

for (const job of jobs) {
  const buf = job.svg()
  for (const w of SHOT_WIDTHS) {
    const resized = sharp(buf).resize(w)
    await resized.clone().webp({ quality: 85 }).toFile(path.join(OUT, `${job.slug}-${w}.webp`))
    await resized.clone().avif({ quality: 70 }).toFile(path.join(OUT, `${job.slug}-${w}.avif`))
  }
  // Full capture preview for case study
  await sharp(buf).resize(1200).webp({ quality: 80 }).toFile(path.join(CASES, `${job.slug}-full-1200.webp`))
  console.log('✓ images', job.slug)
}

// Neutral "NB" Monogram Headshot
const headshotBuf = headshotSvg()
for (const w of [480, 800]) {
  const resized = sharp(headshotBuf).resize(w)
  await resized.clone().webp({ quality: 85 }).toFile(path.join(OUT, `headshot-${w}.webp`))
  await resized.clone().avif({ quality: 70 }).toFile(path.join(OUT, `headshot-${w}.avif`))
}
console.log('✓ headshot placeholder')

// Social OG image
await sharp(ogSvg()).jpeg({ quality: 85 }).toFile(path.join(OUT, 'og-image.jpg'))
console.log('✓ og-image')
