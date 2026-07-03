#!/usr/bin/env node
// Script para traducir todos los posts existentes al inglés

import fs from 'fs'
import path from 'path'
import { generateEnglishVersion, writePost } from '../src/services/ai.mjs'

const postsDir = path.join(process.cwd(), 'src', 'posts')

async function main() {
  const provider = process.env.AI_PROVIDER || 'gemini'
  console.log('Iniciando traducción de blogs existentes...')
  console.log('Proveedor IA:', provider)
  console.log('---\n')

  // Leer todos los archivos .mdx (excluyendo .en.mdx)
  const files = fs.readdirSync(postsDir)
  const spanishFiles = files.filter(f => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))

  console.log(`Encontrados ${spanishFiles.length} blogs en español para traducir.\n`)

  let successCount = 0
  let errorCount = 0

  for (const file of spanishFiles) {
    const filePath = path.join(postsDir, file)
    const slug = file.replace('.mdx', '')
    const enFile = `${slug}.en.mdx`
    const enFilePath = path.join(postsDir, enFile)

    // Saltar si ya existe la versión en inglés
    if (fs.existsSync(enFilePath)) {
      console.log(`⏭️  ${file} -> ${enFile} (ya existe)`)
      continue
    }

    try {
      console.log(`⏳ Traduciendo: ${file}...`)
      const mdx = fs.readFileSync(filePath, 'utf-8')
      
      // Extraer tema del título para contexto
      const titleMatch = mdx.match(/title:\s*(?:["'])?([^"'\n]+)/)
      const topic = titleMatch ? titleMatch[1] : file

      const englishMdx = await generateEnglishVersion({ topic, mdx, provider })
      writePost({ slug, mdx: englishMdx, language: 'en' })

      console.log(`✅ ${file} -> ${enFile}\n`)
      successCount++

      // Pequeña pausa entre traducciones para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`❌ Error traduciendo ${file}:`, error.message, '\n')
      errorCount++
    }
  }

  console.log('---')
  console.log(`\n✨ Proceso completado:`)
  console.log(`✅ Traducidos: ${successCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`⏭️  Ya existentes: ${spanishFiles.length - successCount - errorCount}`)
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
