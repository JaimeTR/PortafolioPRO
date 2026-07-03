import fs from 'fs'
import path from 'path'

// Estructura ESM para uso desde CLI
export async function generateBlogMdx({
  topic,
  tone = 'profesional',
  keywords = [],
  audience = 'desarrolladores y clientes técnicos',
  brand = 'Jaime Tarazona',
  provider = process.env.AI_PROVIDER || 'gemini',
  titleOverride,
}) {
  const date = new Date().toISOString().slice(0, 10)
  const slug = slugify(topic)

  const tagsList = keywords.length ? keywords : inferTagsFromTopic(topic)
  const titleForContent = titleOverride ? String(titleOverride).trim() : proposeTitle(topic)
  const system = [
    'Eres Jaime Tarazona, un Ingeniero de Software Senior, Tech Lead y experto en SEO especializado en desarrollo web avanzado, IA y Arquitectura de Software con más de 10 años de experiencia.',
    'Escribe en español neutro, tono ' + tone + ', preciso, didáctico y muy detallado. Tu audiencia son desarrolladores intermedios/avanzados y Tech Leads.',
    '',
    'ESTRUCTURA DEL ARTÍCULO (OBLIGATORIO):',
    '1. Introducción contextual (2-3 párrafos): Explica el problema de ingeniería, su relevancia y por qué es importante resolverlo hoy.',
    '2. Fundamentos y Arquitectura (sección H2): Conceptos clave, decisiones de diseño, trade-offs (ventajas/desventajas).',
    '3. Implementación práctica (sección H2): Paso a paso detallado con código listo para producción.',
    '4. Casos de uso reales (sección H2): 3-4 escenarios empresariales del mundo real con soluciones específicas.',
    '5. Escalabilidad y Performance (sección H2): Recomendaciones de performance (Core Web Vitals, Big O), seguridad y mantenibilidad.',
    '6. Comparativas (sección H2 si aplica): Comparar enfoques, librerías o arquitecturas alternativas.',
    '7. Anti-patrones y Errores comunes (sección H2): Errores frecuentes en producción y cómo solucionarlos.',
    '8. Recursos adicionales (sección H2): Enlaces a documentación oficial, repositorios.',
    '9. Conclusión (2 párrafos): Resumen ejecutivo y siguientes pasos.',
    '',
    'REQUISITOS DE CONTENIDO:',
    '- Extensión mínima: 1500-2000 palabras (artículo extenso, profundo y muy técnico).',
    '- Incluir 4-6 ejemplos de código avanzado con sintaxis correcta (TypeScript, React, Node, Python, etc. según el tema).',
    '- Cada ejemplo de código debe ser robusto (incluir manejo de errores, tipado estricto si aplica) y tener comentarios.',
    '- Usar encabezados H2 para secciones principales, H3 para subsecciones.',
    '- Incluir tablas comparativas cuando sea relevante (sintaxis markdown).',
    '- Explicar el "por qué" detrás de cada decisión técnica (Trade-offs).',
    '',
    'CÓDIGO DE EJEMPLO:',
    '- Todos los bloques de código deben usar sintaxis markdown: ```typescript, ```javascript, ```python, ```bash',
    '- Código completo y funcional, apto para un entorno empresarial.',
    '- Mostrar evolución: de un enfoque "naive" (básico) a uno "optimizado" (avanzado).',
    '',
    'SEO Y ENGAGEMENT:',
    '- Título optimizado <60 caracteres, atractivo y descriptivo.',
    '- Descripción 150-160 caracteres que resuma el valor técnico del artículo.',
    '- Usar keywords naturalmente.',
    '- Incluir llamados a la acción sutiles al final: "Si necesitas ayuda escalando [tema], contáctame para consultoría o desarrollo especializado".',
    '- Referencias a servicios: desarrollo full-stack, Next.js, IA, optimización, arquitectura cloud.',
    '',
    'ESTILO DE ESCRITURA:',
    '- Usa un tono de mentoría técnica. Habla de "ingeniero a ingeniero".',
    '- Evita el relleno ("fluff"). Ve directo al grano técnico.',
    '- Incluye "💡 Pro Tips" o "⚡ Performance Tips" para destacar consejos de nivel Senior.',
    '',
    'ALINEACIÓN AL TÍTULO (CRÍTICO E INQUEBRANTABLE):',
    `- El contenido debe estar estricta, absoluta y completamente alineado con el título exacto: "${titleForContent}"`,
    '- NO hables de temas fuera del alcance del título.',
    '- Mantén el foco conceptual y semántico del título durante todo el artículo.',
  ].join('\\n')
  const user = `Tema sugerido: ${topic}\\n\\nTítulo EXACTO a desarrollar: ${titleForContent}\\n\\nAudiencia: ${audience}\\n\\nPalabras clave: ${tagsList.join(', ')}\\n\\nAutor: ${brand}\\n\\nIMPORTANTE: Eres Jaime Tarazona. Genera un artículo de ingeniería de software EXTENSO (mín. 1500 palabras), estrictamente alineado con el título "${titleForContent}". No te desvíes. Optimiza para SEO técnico en español. Incluye ejemplos de código robustos, análisis de trade-offs, casos de uso empresariales y mejores prácticas de nivel Senior.`

  let body = ''
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000, // Incrementado para artículos extensos
          },
        })
        const prompt = `${system}\n\n${user}\n\nGenera el cuerpo completo del artículo en formato MDX sin frontmatter. El artículo debe ser EXTENSO (mínimo 1500 palabras), con todas las secciones mencionadas, múltiples ejemplos de código bien comentados, casos de uso reales y análisis profundo de cada aspecto técnico, manteniendo la coherencia con el título indicado.`
        const result = await model.generateContent(prompt)
        body = result?.response?.text() || ''
      } else {
        body = sampleBody(topic, titleForContent)
      }
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY
      if (apiKey) {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          temperature: 0.7,
          max_tokens: 4000, // Incrementado para contenido más extenso
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\n\nGenera el cuerpo completo del artículo en formato MDX sin frontmatter. Asegúrate de incluir todas las secciones requeridas con profundidad y múltiples ejemplos de código.' },
          ],
        })
        body = completion.choices?.[0]?.message?.content || ''
      } else {
        body = sampleBody(topic, titleForContent)
      }
    } else {
      body = sampleBody(topic, titleForContent)
    }
  } catch {
    body = sampleBody(topic, titleForContent)
  }

  const title = titleForContent
  const description = proposeDescription(body)

  const frontmatter = `---\n` +
    `title: ${escapeYaml(title)}\n` +
    `date: '${date}'\n` +
    `description: >-\n    ${escapeYaml(description)}\n` +
    `toc: true\n` +
    `tags:\n${tagsList.map(t => `    - ${escapeYaml(t)}`).join('\n')}\n` +
    `cover: '/images/og.png'\n` +
    `author: 'jaimetrdev'\n` +
    `---\n\n`

  const mdx = frontmatter + body.trim() + '\n'
  return { slug, mdx, title, description, date, tags: tagsList }
}

export function writePost({ slug, mdx, language = 'es' }) {
  const outDir = path.join(process.cwd(), 'src', 'posts')
  const extension = language === 'en' ? '.en.mdx' : '.mdx'
  const outFile = path.join(outDir, `${slug}${extension}`)
  fs.writeFileSync(outFile, mdx, 'utf-8')
  return outFile
}

export async function generateEnglishVersion({ topic, mdx, provider = process.env.AI_PROVIDER || 'gemini' }) {
  // Extraer frontmatter y body con matter
  const frontmatterMatch = mdx.match(/^---([\s\S]*?)---/)
  const frontmatterBlock = frontmatterMatch ? frontmatterMatch[1] : ''
  const body = mdx.replace(/^---[\s\S]*?---/, '').trim()

  // Generar traducción al inglés del cuerpo solamente
  const system = [
    'Eres un traductor técnico experto especializado en documentación de desarrollo web.',
    'Tu tarea es traducir un artículo de blog técnico del español al inglés de manera profesional y precisa.',
    'Mantén la estructura, headers, código y ejemplos exactamente igual.',
    'Solo traduce el texto, comentarios y descripciones.',
    'Usa terminología técnica en inglés estándar de la industria.',
    'Los bloques de código deben permanecer intactos con sus comentarios traducidos.',
  ].join('\n')

  const user = `Traduce este artículo de desarrollo web del español al inglés, manteniendo toda la estructura, headers y código:\n\n${body}`

  let translatedBody = ''

  try {
    // Traducir cuerpo del artículo
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { temperature: 0.3, maxOutputTokens: 8000 },
        })
        const result = await model.generateContent(`${system}\n\n${user}`)
        translatedBody = result?.response?.text() || body
      } else {
        translatedBody = body
      }
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY
      if (apiKey) {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey })
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          temperature: 0.3,
          max_tokens: 4000,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        })
        translatedBody = completion.choices?.[0]?.message?.content || body
      } else {
        translatedBody = body
      }
    } else {
      translatedBody = body
    }
  } catch (error) {
    console.warn('No se pudo traducir con IA, usando original:', error.message)
    translatedBody = body
  }

  // Mantener el frontmatter original (mismo YAML, mismo formato)
  // Esto asegura que YAML sea válido y que podamos editar título/descripción después si es necesario
  const englishMdx = `---${frontmatterBlock}---\n\n${translatedBody.trim()}\n`
  return englishMdx
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

function sampleBody(topic, title) {
  return `# ${title}\n\n` +
    `## Introducción a ${topic}\n\n` +
    `En el desarrollo web moderno, ${topic} se ha convertido en un aspecto fundamental que todo desarrollador debe dominar. ` +
    `Este artículo explora de manera exhaustiva todos los aspectos relacionados con ${topic}, desde los fundamentos básicos ` +
    `hasta técnicas avanzadas de implementación.\n\n` +
    `En las siguientes secciones, abordaremos:\n` +
    `- Fundamentos teóricos y conceptos clave\n` +
    `- Implementación práctica paso a paso\n` +
    `- Casos de uso del mundo real\n` +
    `- Mejores prácticas y optimizaciones\n` +
    `- Errores comunes y cómo evitarlos\n\n` +
    `### ¿Por qué es importante ${topic}?\n\n` +
    `La importancia de ${topic} radica en varios factores críticos:\n\n` +
    `1. **Mejora la experiencia del usuario**: Implementar ${topic} correctamente resulta en una mejor UX.\n` +
    `2. **Optimiza el rendimiento**: Reduce tiempos de carga y mejora métricas de performance.\n` +
    `3. **Aumenta la visibilidad SEO**: Los buscadores priorizan sitios que implementan ${topic} adecuadamente.\n` +
    `4. **Facilita el mantenimiento**: Código bien estructurado es más fácil de mantener a largo plazo.\n\n` +
    `## Fundamentos Técnicos\n\n` +
    `Antes de profundizar en la implementación, es crucial entender los conceptos fundamentales:\n\n` +
    `### Conceptos Clave\n\n` +
    `**Definición**: ${topic} se refiere a [concepto técnico relevante al tema].\n\n` +
    `**Componentes principales**:\n` +
    `- Configuración inicial y setup\n` +
    `- Estructura de datos y patrones de diseño\n` +
    `- Integración con otras tecnologías\n` +
    `- Testing y validación\n\n` +
    `### Prerequisitos\n\n` +
    `Para seguir este tutorial, necesitas:\n` +
    `- Conocimientos básicos de JavaScript/TypeScript\n` +
    `- Familiaridad con el ecosistema de Node.js\n` +
    `- Editor de código (VS Code recomendado)\n` +
    `- Terminal/línea de comandos\n\n` +
    `## Implementación Práctica\n\n` +
    `Vamos a implementar ${topic} paso a paso con ejemplos completos y funcionales.\n\n` +
    `### Paso 1: Configuración Inicial\n\n` +
    `Primero, configuramos el entorno básico:\n\n` +
    `\`\`\`bash\n` +
    `# Instalar dependencias necesarias\n` +
    `npm install --save-dev [paquetes-relevantes]\n\n` +
    `# Inicializar configuración\n` +
    `npx [herramienta] init\n` +
    `\`\`\`\n\n` +
    `### Paso 2: Implementación Básica\n\n` +
    `\`\`\`javascript\n` +
    `// Ejemplo básico de implementación\n` +
    `export function implementacionBasica() {\n` +
    `  // Configuración inicial\n` +
    `  const config = {\n` +
    `    opcion1: true,\n` +
    `    opcion2: 'valor',\n` +
    `    // Más opciones...\n` +
    `  };\n\n` +
    `  // Lógica principal\n` +
    `  return procesarDatos(config);\n` +
    `}\n\n` +
    `function procesarDatos(config) {\n` +
    `  // Implementación detallada\n` +
    `  console.log('Procesando con:', config);\n` +
    `  return { exito: true, data: [] };\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Paso 3: Implementación Avanzada\n\n` +
    `Para casos más complejos, podemos usar un enfoque más robusto:\n\n` +
    `\`\`\`javascript\n` +
    `// Implementación avanzada con manejo de errores\n` +
    `class GestorAvanzado {\n` +
    `  constructor(opciones = {}) {\n` +
    `    this.config = { ...opcionesPorDefecto, ...opciones };\n` +
    `    this.inicializar();\n` +
    `  }\n\n` +
    `  inicializar() {\n` +
    `    // Setup inicial\n` +
    `    this.validarConfiguracion();\n` +
    `    this.prepararRecursos();\n` +
    `  }\n\n` +
    `  async ejecutar() {\n` +
    `    try {\n` +
    `      const resultado = await this.procesamientoAsincrono();\n` +
    `      return this.formatearResultado(resultado);\n` +
    `    } catch (error) {\n` +
    `      this.manejarError(error);\n` +
    `      throw error;\n` +
    `    }\n` +
    `  }\n\n` +
    `  validarConfiguracion() {\n` +
    `    // Validaciones necesarias\n` +
    `    if (!this.config.required) {\n` +
    `      throw new Error('Configuración incompleta');\n` +
    `    }\n` +
    `  }\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `## Casos de Uso Reales\n\n` +
    `Veamos cómo aplicar ${topic} en escenarios del mundo real:\n\n` +
    `### Caso 1: Aplicación E-commerce\n\n` +
    `En una tienda online, ${topic} se usa para optimizar el checkout:\n\n` +
    `\`\`\`javascript\n` +
    `// Implementación para e-commerce\n` +
    `async function procesarPedido(carrito, usuario) {\n` +
    `  // Validar stock disponible\n` +
    `  const stockValido = await validarInventario(carrito);\n` +
    `  \n` +
    `  if (!stockValido) {\n` +
    `    throw new Error('Productos sin stock');\n` +
    `  }\n\n` +
    `  // Calcular total con impuestos\n` +
    `  const total = calcularTotal(carrito, usuario.ubicacion);\n` +
    `  \n` +
    `  // Procesar pago\n` +
    `  return await procesarPago(total, usuario.metodoPago);\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Caso 2: Dashboard Analítico\n\n` +
    `Para dashboards, ${topic} mejora la visualización de datos en tiempo real.\n\n` +
    `### Caso 3: API REST\n\n` +
    `En APIs, ${topic} optimiza el manejo de solicitudes y respuestas.\n\n` +
    `## Mejores Prácticas\n\n` +
    `### Performance y Optimización\n\n` +
    `✅ **Hacer**:\n` +
    `- Cachear resultados cuando sea posible\n` +
    `- Usar lazy loading para recursos pesados\n` +
    `- Implementar paginación en listas grandes\n` +
    `- Monitorear métricas de rendimiento\n\n` +
    `❌ **Evitar**:\n` +
    `- Cargar datos innecesarios\n` +
    `- Múltiples re-renders\n` +
    `- Bloquear el thread principal\n` +
    `- Ignorar memory leaks\n\n` +
    `### Seguridad\n\n` +
    `💡 **Pro Tip**: Siempre valida y sanitiza inputs del usuario.\n\n` +
    `\`\`\`javascript\n` +
    `// Validación de entrada segura\n` +
    `function sanitizarInput(input) {\n` +
    `  return input\n` +
    `    .trim()\n` +
    `    .replace(/[<>]/g, '') // Prevenir XSS\n` +
    `    .slice(0, 1000); // Limitar tamaño\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `## Errores Comunes y Soluciones\n\n` +
    `### Error 1: No manejar estados de carga\n\n` +
    `**Problema**: La UI se congela mientras se cargan datos.\n\n` +
    `**Solución**: Implementar estados de loading:\n\n` +
    `\`\`\`javascript\n` +
    `const [loading, setLoading] = useState(false);\n` +
    `const [data, setData] = useState(null);\n\n` +
    `async function cargarDatos() {\n` +
    `  setLoading(true);\n` +
    `  try {\n` +
    `    const resultado = await fetch('/api/data');\n` +
    `    setData(resultado);\n` +
    `  } finally {\n` +
    `    setLoading(false);\n` +
    `  }\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Error 2: Ignorar compatibilidad de navegadores\n\n` +
    `**Problema**: Código que solo funciona en Chrome.\n\n` +
    `**Solución**: Usar polyfills y feature detection.\n\n` +
    `### Error 3: No optimizar para móviles\n\n` +
    `**Problema**: La experiencia en móvil es deficiente.\n\n` +
    `**Solución**: Diseño responsive y touch-friendly desde el inicio.\n\n` +
    `## Recursos Adicionales\n\n` +
    `Para profundizar más en ${topic}, consulta:\n\n` +
    `- 📚 Documentación oficial\n` +
    `- 🛠️ Herramientas de desarrollo recomendadas\n` +
    `- 💻 Repositorios de ejemplo en GitHub\n` +
    `- 🎓 Cursos y tutoriales avanzados\n\n` +
    `## Conclusión\n\n` +
    `${topic} es una habilidad esencial en el desarrollo web moderno. A lo largo de este artículo, hemos cubierto:\n\n` +
    `- Fundamentos teóricos y conceptos clave\n` +
    `- Implementación práctica con ejemplos completos\n` +
    `- Casos de uso del mundo real\n` +
    `- Mejores prácticas de performance y seguridad\n` +
    `- Errores comunes y cómo evitarlos\n\n` +
    `La clave está en practicar constantemente y mantenerse actualizado con las últimas tendencias del ecosistema.\n\n` +
    `### Próximos Pasos\n\n` +
    `1. Implementa los ejemplos en tu propio proyecto\n` +
    `2. Experimenta con diferentes configuraciones\n` +
    `3. Mide el impacto en performance\n` +
    `4. Comparte tus resultados con la comunidad\n\n` +
    `Si necesitas ayuda profesional para implementar ${topic} en tu proyecto, o requieres consultoría especializada en desarrollo web, ` +
    `optimización de performance, arquitectura de aplicaciones o integración de nuevas tecnologías, no dudes en contactarme. ` +
    `Ofrezco servicios de desarrollo full-stack con React, Next.js, WordPress, y soluciones personalizadas para cada necesidad.`
    // Genera un cuerpo extenso, único y adaptado al tema/título
    return `# ${title}\n\n` +
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
