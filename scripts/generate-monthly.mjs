#!/usr/bin/env node
// Genera un post mensual eligiendo un tema relacionado aleatoriamente

import { MONTHLY_TOPICS } from '../src/helpers/topics.js'
import { generateBlogMdx, writePost } from '../src/services/ai.mjs'
import { generateCover } from '../src/services/cover.mjs'

function pickTopic() {
  const idx = Math.floor(Math.random() * MONTHLY_TOPICS.length)
  return MONTHLY_TOPICS[idx]
}

async function main() {
  const topic = pickTopic()
  const provider = process.env.AI_PROVIDER || 'gemini'
  console.log('Generando post mensual')
  console.log('Tema:', topic)
  console.log('Proveedor IA:', provider)

  const { slug, mdx, title, tags } = await generateBlogMdx({ topic, provider })
  const file = writePost({ slug, mdx })
  const coverPath = await generateCover({ slug, title, tags })
  console.log('Portada generada en:', coverPath)
  console.log('Artículo generado en:', file)
}

main().catch((e) => {
  console.error('Error generando post mensual:', e)
  process.exit(1)
})
