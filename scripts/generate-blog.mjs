#!/usr/bin/env node
// Script CLI para generar un post MDX con IA y guardarlo en src/posts

import { generateBlogMdx, writePost } from '../src/services/ai.mjs'
import { generateCover } from '../src/services/cover.mjs'

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Uso: npm run generate:blog -- "Tema del artículo" [--provider gemini|openai] [--lang es|en|both]')
    process.exit(1)
  }

  // Parseo de banderas
  let provider = process.env.AI_PROVIDER || 'gemini'
  let language = 'both' // por defecto genera EN ambos idiomas
  const topicParts = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--') {
      continue
    } else if (args[i] === '--provider' && i + 1 < args.length) {
      provider = args[i + 1]
      i++
    } else if (args[i] === '--lang' && i + 1 < args.length) {
      language = args[i + 1]
      i++
    } else {
      topicParts.push(args[i])
    }
  }
  const topic = topicParts.join(' ').trim()
  console.log('Generando artículo para tema:', topic)
  console.log('Proveedor IA:', provider)
  console.log('Idioma(s):', language)

  const { slug, mdx, title, tags } = await generateBlogMdx({ topic, provider })
  
  // Generar versión en español
  if (language === 'es' || language === 'both') {
    const esFile = writePost({ slug, mdx, language: 'es' })
    console.log('✅ Artículo en español generado en:', esFile)
  }

  // Generar versión en inglés
  if (language === 'en' || language === 'both') {
    const { generateEnglishVersion } = await import('../src/services/ai.mjs')
    const englishMdx = await generateEnglishVersion({ topic, mdx, provider })
    const enFile = writePost({ slug, mdx: englishMdx, language: 'en' })
    console.log('✅ Artículo en inglés generado en:', enFile)
  }

  const coverPath = await generateCover({ slug, title, tags })
  console.log('✅ Portada generada en:', coverPath)
  console.log('\n✨ Artículos creados exitosamente en ambos idiomas')
}

main().catch((e) => {
  console.error('Error generando artículo:', e)
  process.exit(1)
})
