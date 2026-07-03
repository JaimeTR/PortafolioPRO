# 👨‍💻 Portafolio Jaime Tarazona - jaimetr.dev

Este proyecto está desarrollado con [Next.js](https://nextjs.org/) v14 usando el App Router.

## 🚀 Características

- ⚡️ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos
- 🌙 Dark Mode con next-themes
- 📝 Blog con MDX
- 🎯 SEO optimizado con metadata dinámica
- 🔒 Headers de seguridad configurados
- 📱 Diseño responsive
- ♿️ Accesibilidad mejorada

## 📋 REQUISITOS PREVIOS

- Node.js 18.17 o superior
- npm, yarn o pnpm

## 🔧 INSTALACIÓN

Primero, instale las dependencias:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🏃 INICIAR PROYECTO

Ejecute el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) y verá el resultado del proyecto en ejecución.

Puede comenzar a editar la página modificando `app/page.js`. La página se actualiza automáticamente a medida que edita el archivo.

## 📦 BUILD Y PRODUCCIÓN

Para crear una versión optimizada para producción:

```bash
npm run build
npm start
```

## 🌐 DEPLOYMENT

La forma más sencilla de implementar su aplicación Next.js es utilizar [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Ver más detalles en la [documentación de deployment de Next.js](https://nextjs.org/docs/deployment).

## 📁 ESTRUCTURA DEL PROYECTO

```
├── public/              # Archivos estáticos
│   ├── images/         # Imágenes del sitio
│   ├── robots.txt      # SEO - Instrucciones para bots
│   └── sitemap.xml     # SEO - Mapa del sitio (legacy)
├── src/
│   ├── app/            # App Router de Next.js
│   │   ├── layout.js   # Layout principal
│   │   ├── page.js     # Página de inicio
│   │   ├── sitemap.js  # Sitemap dinámico
│   │   ├── posts/      # Blog
│   │   └── projects/   # Portafolio de proyectos
│   ├── components/     # Componentes React
│   ├── helpers/        # Utilidades y datos
│   ├── lib/            # Librerías y funciones
│   └── posts/          # Artículos del blog en MDX
├── .env.example        # Variables de entorno de ejemplo
├── next.config.js      # Configuración de Next.js
└── tailwind.config.js  # Configuración de Tailwind
```

## 🔐 SEGURIDAD

El proyecto incluye:
- Headers de seguridad HTTP
- Protección contra clickjacking
- Política de referrer configurada
- Enlaces externos con rel="noopener noreferrer"

## 🎯 SEO

- Metadata dinámica por página
- Sitemap dinámico generado automáticamente
- robots.txt configurado
- Open Graph tags
- Twitter Cards
- JSON-LD structured data

## 👨‍💻 AUTOR

**Jaime Tarazona Rodriguez**
- Ingeniero de Sistemas
- Desarrollador Full-Stack
- Web Developer

---

`Ingeniero de Sistemas` | `Jaime Tarazona` | `FullStack developer`

## 🧠 Generador de Blogs con IA

- Genera artículos MDX con frontmatter optimizado para SEO.
- Usa OpenAI (configurable vía `OPENAI_API_KEY`).
- Genera automáticamente la imagen de portada en `public/images/posts/<slug>.webp` (OG 1200x630) con tu branding.

### Uso rápido

1. Configura tu `.env.local` (elige proveedor y modelo):

```
# Proveedor (gemini recomendado)
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AI_GEMINI_MODEL=gemini-1.5-pro

# (Opcional) OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# (Opcional) Supabase para persistir metadatos
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Genera un artículo (Gemini por defecto):

```
npm run generate:blog -- "Optimización de rendimiento en Next.js"
Tras generar, verás:
- MDX: `src/posts/<slug>.mdx`
- Cover: `public/images/posts/<slug>.webp`

Puedes personalizar colores/plantilla en `src/services/cover.mjs`.
```

También puedes forzar el proveedor por bandera:

```
npm run generate:blog -- --provider openai "Guía avanzada de SEO técnico"
```

El archivo se guardará en `src/posts/<slug>.mdx` con:
- `title`, `description`, `date`, `cover`, `tags`, `author`.
- Cuerpo en MDX con secciones H2/H3, listas y ejemplos.

Puedes programar generación mensual con GitHub Actions o Vercel Cron ejecutando el mismo comando.
