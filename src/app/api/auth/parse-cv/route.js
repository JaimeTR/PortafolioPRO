import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Solo se aceptan archivos PDF' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no puede superar 5MB' }, { status: 400 })
    }

    // Extraer texto del PDF con pdfjs-dist
    const bytes = await file.arrayBuffer()
    const typedArray = new Uint8Array(bytes)
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise
    const numPages = pdf.numPages
    const textParts = []

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str).join(' ')
      textParts.push(pageText)
    }

    const text = textParts.join('\n\n')

    if (!text || text.trim().length < 20) {
      return NextResponse.json({
        success: true,
        data: { raw_text: text.substring(0, 2000), extracted: null },
        message: 'No se pudo extraer suficiente texto del PDF. Rellena los campos manualmente.'
      })
    }

    // Usar Groq/AI para parsear el CV
    let extracted = null
    try {
      const groqKey = process.env.GROQ_API_KEY
      if (groqKey) {
        const groq = new OpenAI({ apiKey: groqKey, baseURL: 'https://api.groq.com/openai/v1' })

        const prompt = `Eres un parser de CVs. Extrae la siguiente información del CV en formato JSON. Si un campo no se encuentra, déjalo como string vacío "" o array vacío [].

CV:
${text.substring(0, 5000)}

Devuelve SOLO un JSON válido con esta estructura exacta:
{
  "full_name": "Nombre completo",
  "email": "email@ejemplo.com",
  "phone": "+51 999 888 777",
  "profession": "Profesión principal (ej: Médico, Ingeniero, Abogado)",
  "summary": "Resumen profesional en 1-2 frases (español)",
  "summary_en": "Professional summary in 1-2 sentences (english)",
  "experience": [
    { "role": "Cargo", "company": "Empresa", "date": "2020 - 2023", "description": "Descripción" }
  ],
  "education": ["Título o universidad"],
  "skills": ["habilidad1", "habilidad2"],
  "languages": ["idiomas"],
  "linkedin": "url de linkedin",
  "github": "url de github"
}`

        const response = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 2000,
        })

        const content = response.choices[0].message.content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          extracted = JSON.parse(jsonMatch[0])
        }
      }
    } catch (aiError) {
      console.warn('AI parsing fallback:', aiError.message)
    }

    return NextResponse.json({
      success: true,
      data: {
        raw_text: text.substring(0, 2000),
        extracted
      }
    })

  } catch (error) {
    console.error('Parse CV error:', error)
    return NextResponse.json({ error: 'Error al procesar el PDF: ' + error.message }, { status: 500 })
  }
}
