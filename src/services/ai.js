// Servicio de IA para generar contenido MDX con SEO
// Soporta OpenAI vía env OPENAI_API_KEY; si no hay clave, devuelve contenido de ejemplo.

import fs from 'fs'
import path from 'path'

// Genera MDX usando el proveedor indicado: 'gemini' | 'openai' | fallback
export async function generateBlogMdx({
  topic,
  tone = 'profesional',
  keywords = [],
  audience = 'desarrolladores y clientes técnicos',
  brand = 'Jaime Tarazona',
  provider = process.env.AI_PROVIDER || 'gemini',
}) {
  const date = new Date().toISOString().slice(0, 10)
  const slug = slugify(topic)
  // Usamos un cover seguro existente (puedes cambiarlo a una imagen específica por post)
  const cover = `/images/og.png`
  const tagsList = keywords.length ? keywords : inferTagsFromTopic(topic)

  const system = [
    'Eres un redactor técnico senior y SEO especializado en desarrollo web.',
    'Escribe en español neutro, tono ' + tone + ', claro y conciso.',
    'Estructura en MDX con encabezados H2/H3, listas, y algún bloque de código cuando aplique.',
    'Incluye ejemplos prácticos y mejores prácticas.',
    'Optimiza para SEO: título <60 caracteres, descripción 150-160, keywords relevantes.',
    'Incluye llamados a la acción hacia servicios: desarrollo web, optimización, WordPress, Next.js.',
  ].join(' ')

  const user = `Tema: ${topic}\nAudiencia: ${audience}\nPalabras clave: ${tagsList.join(', ')}\nMarca: ${brand}\n`

  let body = ''
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
        const model = genAI.getGenerativeModel({ model: modelName })
        const prompt = `${system}\n\n${user}\nGenera el cuerpo del artículo en MDX sin frontmatter.`
        const result = await model.generateContent(prompt)
        body = result?.response?.text() || ''
      } else {
        body = sampleBody(topic)
      }
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY
      if (apiKey) {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          temperature: 0.7,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\nGenera el cuerpo del artículo en MDX sin frontmatter.' },
          ],
        })
        body = completion.choices?.[0]?.message?.content || ''
      } else {
        body = sampleBody(topic)
      }
    } else {
      body = sampleBody(topic)
    }
  } catch (e) {
    body = sampleBody(topic)
  }

  const title = proposeTitle(topic)
  const description = proposeDescription(body)

  const frontmatter = `---\n` +
    `title: ${escapeYaml(title)}\n` +
    `date: '${date}'\n` +
    `description: >-\n    ${escapeYaml(description)}\n` +
    `toc: true\n` +
    `tags:\n${tagsList.map(t => `    - ${escapeYaml(t)}`).join('\n')}\n` +
    `cover: '${cover}'\n` +
    `author: 'jaimetrdev'\n` +
    `---\n\n`

  const mdx = frontmatter + body.trim() + '\n'

  // Persistencia opcional en Supabase (si hay credenciales)
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_ANON_KEY
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      await supabase.from('posts').insert({
        slug,
        title,
        description,
        date,
        cover,
        tags,
        author: 'jaimetrdev',
      })
    }
  } catch {}

  return { slug, mdx }
}

export function writePost({ slug, mdx }) {
  const outDir = path.join(process.cwd(), 'src', 'posts')
  const outFile = path.join(outDir, `${slug}.mdx`)
  fs.writeFileSync(outFile, mdx, 'utf-8')
  return outFile
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function escapeYaml(str) {
  const s = String(str)
  // Si contiene caracteres especiales de YAML como :, -, #, etc., envolver en comillas
  if (s.includes(':') || s.includes('#') || s.includes('-') || s.includes('\n') || s.includes('"')) {
    return `'${s.replace(/'/g, "''")}'`
  }
  return s
}

function inferTagsFromTopic(topic) {
  const topicLower = topic.toLowerCase()
  const tags = new Set()
  
  // Frameworks y librerías
  if (/react/i.test(topic)) tags.add('react')
  if (/next\.?js|nextjs/i.test(topic)) tags.add('next.js')
  if (/vue/i.test(topic)) tags.add('vue')
  if (/angular/i.test(topic)) tags.add('angular')
  if (/svelte/i.test(topic)) tags.add('svelte')
  if (/astro/i.test(topic)) tags.add('astro')
  
  // Backend
  if (/node\.?js|nodejs/i.test(topic)) tags.add('node.js')
  if (/express/i.test(topic)) tags.add('express')
  if (/php/i.test(topic)) tags.add('php')
  if (/laravel/i.test(topic)) tags.add('laravel')
  if (/wordpress/i.test(topic)) tags.add('wordpress')
  if (/django|python/i.test(topic)) tags.add('python')
  
  // Lenguajes
  if (/javascript|js(?!\w)/i.test(topic)) tags.add('javascript')
  if (/typescript|ts(?!\w)/i.test(topic)) tags.add('typescript')
  
  // CSS y estilos
  if (/tailwind/i.test(topic)) tags.add('tailwind')
  if (/css/i.test(topic)) tags.add('css')
  if (/sass|scss/i.test(topic)) tags.add('sass')
  if (/styled[\s-]components/i.test(topic)) tags.add('styled-components')
  
  // Bases de datos
  if (/mongodb|mongo/i.test(topic)) tags.add('mongodb')
  if (/postgres|postgresql/i.test(topic)) tags.add('postgresql')
  if (/mysql/i.test(topic)) tags.add('mysql')
  if (/prisma/i.test(topic)) tags.add('prisma')
  if (/supabase/i.test(topic)) tags.add('supabase')
  if (/firebase/i.test(topic)) tags.add('firebase')
  
  // Conceptos y patrones
  if (/seo/i.test(topic)) tags.add('seo')
  if (/performance|rendimiento|optimización/i.test(topic)) tags.add('performance')
  if (/seguridad|security/i.test(topic)) tags.add('seguridad')
  if (/testing|tests|pruebas/i.test(topic)) tags.add('testing')
  if (/api|rest|graphql/i.test(topic)) tags.add('api')
  if (/microservicios|microservices/i.test(topic)) tags.add('arquitectura')
  if (/monolito|mvc/i.test(topic)) tags.add('arquitectura')
  if (/deploy|deployment|despliegue/i.test(topic)) tags.add('devops')
  if (/docker|kubernetes/i.test(topic)) tags.add('devops')
  
  // IA y Machine Learning
  if (/ia|inteligencia\s*artificial|ai/i.test(topic)) tags.add('ia')
  if (/gemini|gpt|openai|chatgpt/i.test(topic)) tags.add('ia')
  if (/machine\s*learning|ml/i.test(topic)) tags.add('machine learning')
  
  // E-commerce
  if (/ecommerce|e-commerce|tienda|shop/i.test(topic)) tags.add('ecommerce')
  if (/stripe|paypal|pago/i.test(topic)) tags.add('pagos')
  
  // Frontend general
  if (/html/i.test(topic)) tags.add('html')
  if (/accesibilidad|accessibility|a11y/i.test(topic)) tags.add('accesibilidad')
  if (/responsive|adaptable/i.test(topic)) tags.add('responsive')
  if (/animación|animation/i.test(topic)) tags.add('animaciones')
  
  // Herramientas
  if (/git/i.test(topic)) tags.add('git')
  if (/vscode|visual\s*studio\s*code/i.test(topic)) tags.add('herramientas')
  if (/webpack|vite|esbuild/i.test(topic)) tags.add('build-tools')
  
  // Siempre agregar "desarrollo web" como base si no hay suficientes tags
  if (tags.size < 3) {
    tags.add('desarrollo web')
  }
  
  // Si menciona "guía", "tutorial", "paso a paso", agregar tag educativo
  if (/guía|tutorial|paso\s*a\s*paso|aprende|cómo/i.test(topic)) {
    tags.add('tutorial')
  }
  
  // Convertir a array y limitar a 6 tags máximo
  return Array.from(tags).slice(0, 6)
}

function proposeTitle(topic) {
  // Título breve optimizado
  const clean = topic.replace(/\.$/, '')
  return clean.length <= 60 ? clean : clean.slice(0, 57) + '…'
}

function proposeDescription(body) {
  // Limpiar markdown y símbolos
  let plain = body
    .replace(/^---[\s\S]*?---/m, '') // Quitar frontmatter si existe
    .replace(/#{1,6}\s+/g, '') // Quitar headers de markdown (# ## ###)
    .replace(/\*\*(.+?)\*\*/g, '$1') // Quitar negritas **texto**
    .replace(/\*(.+?)\*/g, '$1') // Quitar cursivas *texto*
    .replace(/`{1,3}(.+?)`{1,3}/g, '$1') // Quitar código `texto`
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Convertir links a texto [texto](url)
    .replace(/>\s+/g, '') // Quitar blockquotes >
    .replace(/[-*+]\s+/g, '') // Quitar bullets de listas
    .replace(/\d+\.\s+/g, '') // Quitar números de listas
    .replace(/\n+/g, ' ') // Convertir saltos de línea a espacios
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim()
  
  const max = 160
  return plain.length <= max ? plain : plain.slice(0, max - 1) + '…'
}

function sampleBody(topic) {
  // Genera un cuerpo extenso, único y adaptado al tema
  return `# ${topic}\n\n` +
    `## Introducción\n\n` +
    `Este artículo profundiza en el tema "${topic}" con un enfoque práctico y detallado. Aquí encontrarás una guía completa, desde los conceptos fundamentales hasta casos de uso avanzados, todo adaptado a las necesidades reales de desarrolladores y empresas.\n\n` +
    `---\n\n` +
    `## 1. ¿Qué es ${topic}?\n\n` +
    `Explicación detallada sobre el concepto de ${topic}, su origen, evolución y relevancia actual en el desarrollo web y software moderno.\n\n` +
    `## 2. Importancia de ${topic} en proyectos reales\n\n` +
    `- Mejora la calidad y mantenibilidad del código\n` +
    `- Permite escalar soluciones de forma eficiente\n` +
    `- Impacta directamente en la experiencia de usuario y el SEO\n\n` +
    `## 3. Fundamentos técnicos de ${topic}\n\n` +
    `- Principios clave\n` +
    `- Terminología esencial\n` +
    `- Relación con otras tecnologías\n\n` +
    `## 4. Implementación práctica\n\n` +
    `A continuación, se muestra un ejemplo realista de cómo aplicar ${topic} en un proyecto:\n\n` +
    '```js\n// Ejemplo de implementación de ' + topic + '\nfunction ejemplo' + topic.replace(/\s/g, '') + '() {\n  // Lógica principal aquí\n  return true;\n}\n```\n\n' +
    `### Explicación del código\n` +
    `- Se detalla cada parte del ejemplo anterior, explicando el propósito de cada línea y cómo se relaciona con el objetivo del tema.\n\n` +
    `## 5. Casos de uso avanzados\n\n` +
    `- Caso 1: Aplicación de ${topic} en sistemas de gran escala\n` +
    `- Caso 2: Integración de ${topic} con frameworks modernos\n` +
    `- Caso 3: Optimización de procesos usando ${topic}\n\n` +
    `## 6. Buenas prácticas y errores comunes\n\n` +
    `- Recomendaciones para implementar ${topic} de forma eficiente\n` +
    `- Errores frecuentes y cómo evitarlos\n\n` +
    `## 7. Recursos adicionales\n\n` +
    `- Documentación oficial\n` +
    `- Tutoriales avanzados\n` +
    `- Comunidades y foros especializados\n\n` +
    `---\n\n` +
    `> Si necesitas ayuda profesional para implementar ${topic} en tu proyecto, contáctame para una consultoría personalizada.\n`;
}
