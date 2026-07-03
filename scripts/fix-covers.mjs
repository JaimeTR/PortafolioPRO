#!/usr/bin/env node
// Script para actualizar el campo cover en todos los MDX que tengan imagen pero cover incorrecto

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'src', 'posts')
const imagesDir = path.join(process.cwd(), 'public', 'images', 'posts')

async function fixCovers() {
  const files = fs.readdirSync(postsDir)
  const mdxFiles = files.filter(f => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))
  
  let updated = 0
  
  for (const file of mdxFiles) {
    const slug = file.replace('.mdx', '')
    const mdxPath = path.join(postsDir, file)
    const imagePath = path.join(imagesDir, `${slug}.webp`)
    
    // Verificar si existe la imagen
    if (fs.existsSync(imagePath)) {
      const content = fs.readFileSync(mdxPath, 'utf-8')
      const { data, content: body } = matter(content)
      
      const expectedCover = `/images/posts/${slug}.webp`
      
      // Solo actualizar si el cover no existe o es diferente
      if (!data.cover || data.cover !== expectedCover) {
        data.cover = expectedCover
        
        // Reconstruir el archivo
        const newContent = matter.stringify(body, data)
        fs.writeFileSync(mdxPath, newContent, 'utf-8')
        
        console.log(`✅ Actualizado: ${slug}`)
        updated++
      }
    }
  }
  
  console.log(`\n🎉 Proceso completado. ${updated} archivos actualizados.`)
}

fixCovers().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
