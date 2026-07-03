import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 800

// Paletas de colores para las 3 variantes premium
const COLOR_THEMES = {
  variant1: {
    name: 'Cyber Neon',
    primary: '#00FFA3', // Verde neón
    accent: '#00B8FF', // Azul cyber
    bg1: '#0A0A0F',
    bg2: '#12121A'
  },
  variant2: {
    name: 'Dark Glass',
    primary: '#F0F0F0', // Blanco humo
    accent: '#FF3366', // Rosa vibrante
    bg1: '#09090E',
    bg2: '#1A1A24'
  },
  variant3: {
    name: 'Tech Gold',
    primary: '#FFD700', // Dorado
    accent: '#8A2BE2', // Púrpura eléctrico
    bg1: '#050505',
    bg2: '#161616'
  }
}

export async function generateCoverVariants({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const variants = []
  
  for (const [key, theme] of Object.entries(COLOR_THEMES)) {
    const variantSlug = `${slug}-${key}`
    const outFile = path.join(outDir, `${variantSlug}.webp`)
    const svg = generateSVG({ title, theme, slug, tags })
    
    const svgBuffer = Buffer.from(svg)
    const buffer = await sharp(svgBuffer)
      .webp({ quality: 90 })
      .toBuffer()

    fs.writeFileSync(outFile, buffer)
    
    variants.push({
      name: theme.name,
      url: `/images/posts/${variantSlug}.webp`,
      filename: `${variantSlug}.webp`
    })
  }

  return variants
}

function generateSVG({ title, theme, slug, tags = [] }) {
  const safeTitle = String(title || slug)
  const brand = 'jaimetr.dev'

  const { primary, accent, bg1, bg2 } = theme

  function splitTextIntoLines(text, maxCharsPerLine) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    
    if (currentLine) lines.push(currentLine)
    return lines
  }

  let fontSize = 72
  let maxCharsPerLine = 28
  let lineHeight = 85
  
  if (safeTitle.length > 70) {
    fontSize = 54
    maxCharsPerLine = 38
    lineHeight = 65
  } else if (safeTitle.length > 40) {
    fontSize = 64
    maxCharsPerLine = 32
    lineHeight = 75
  }

  const titleLines = splitTextIntoLines(safeTitle, maxCharsPerLine).slice(0, 4)

  const tagsString = tags && tags.length > 0 
    ? tags.slice(0,3).map(t => `#${String(t).toUpperCase()}`).join('  ') 
    : '#SOFTWARE  #ENGINEERING'

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
      <stop offset="0%" stop-color="${bg2}"/>
      <stop offset="100%" stop-color="${bg1}"/>
    </radialGradient>
    
    <!-- Pattern de Grid -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.1"/>
    </pattern>

    <!-- Filtro de resplandor neón -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Fondo base con gradiente radial y Grid -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Orbes de luz decorativos -->
  <circle cx="1000" cy="150" r="250" fill="${accent}" opacity="0.08" filter="blur(80px)"/>
  <circle cx="150" cy="700" r="300" fill="${primary}" opacity="0.05" filter="blur(100px)"/>

  <!-- Elementos de interfaz HUD -->
  <path d="M 1100 50 L 1150 50 L 1150 100" fill="none" stroke="${primary}" stroke-width="3" opacity="0.5"/>
  <path d="M 50 750 L 50 700 L 100 700" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
  
  <text x="1050" y="70" font-family="monospace" font-size="12" fill="${accent}" opacity="0.6">
    SYS_ID: ${slug.substring(0, 8).toUpperCase()}
  </text>
  <text x="1050" y="90" font-family="monospace" font-size="12" fill="${accent}" opacity="0.6">
    v2.0.4 // OK
  </text>

  <!-- Título principal -->
  ${titleLines.map((line, index) => `
  <text 
    x="100" 
    y="${280 + (index * lineHeight)}" 
    font-family="'Inter', 'Arial Black', sans-serif" 
    font-size="${fontSize}" 
    font-weight="900" 
    fill="${primary}"
    letter-spacing="-1.5"
  >
    ${escapeXml(line)}
  </text>
  `).join('')}

  <!-- Tags -->
  <text 
    x="100" 
    y="${280 + (titleLines.length * lineHeight) + 20}" 
    font-family="monospace" 
    font-size="16" 
    fill="${accent}"
    letter-spacing="2"
    opacity="0.8"
  >
    ${escapeXml(tagsString)}
  </text>

  <!-- Branding Footer -->
  <rect x="100" y="${HEIGHT - 120}" width="60" height="4" fill="${primary}"/>
  
  <text 
    x="100" 
    y="${HEIGHT - 80}" 
    font-family="'Inter', 'Arial', sans-serif" 
    font-size="24" 
    font-weight="700"
    fill="#FFFFFF"
    opacity="0.9"
  >
    ${escapeXml(brand)}
  </text>
  
  <text 
    x="100" 
    y="${HEIGHT - 55}" 
    font-family="'Inter', 'Arial', sans-serif" 
    font-size="16" 
    fill="#A0A0A0"
  >
    INGENIERÍA DE SOFTWARE Y DESARROLLO WEB
  </text>
</svg>`
}

export async function generateCover({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${slug}.webp`)

  // Usar el tema clásico por defecto
  const theme = COLOR_THEMES.variant1
  const svg = generateSVG({ title, theme, slug, tags })

  // Convertir SVG a imagen con sharp
  const svgBuffer = Buffer.from(svg)
  const buffer = await sharp(svgBuffer)
    .webp({ quality: 90 })
    .toBuffer()

  fs.writeFileSync(outFile, buffer)
  return `/images/posts/${slug}.webp`
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default: return c
    }
  })
}

