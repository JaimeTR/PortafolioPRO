# Guía de Configuración - Portafolio Profesional

Esta guía te ayudará a personalizar tu portafolio para venderlo como template a profesionales de cualquier carrera.

---

## Índice
1. [Primeros Pasos](#1-primeros-pasos)
2. [Configuración Rápida](#2-configuración-rápida)
3. [Personalización Visual (Temas)](#3-personalización-visual-temas)
4. [Base de Datos (Supabase)](#4-base-de-datos-supabase)
5. [Modo Sin Backend (JSON)](#5-modo-sin-backend-json)
6. [Personalización del Chatbot IA](#6-personalización-del-chatbot-ia)
7. [Estructura de Archivos](#7-estructura-de-archivos)
8. [FAQ / Problemas Comunes](#8-faq--problemas-comunes)

---

## 1. Primeros Pasos

### Requisitos
- Node.js 18+ instalado
- Git (opcional)
- Una cuenta en Vercel (recomendado para deploy)

### Instalación

```bash
# Clonar o descargar el proyecto
cd portafolio-pro

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## 2. Configuración Rápida

Edita el archivo `src/config/site.config.js`:

```js
const siteConfig = {
  identity: {
    name: 'Dr. Juan Pérez',           // Tu nombre completo
    shortName: 'JuanPerez',            // Nombre corto
    email: 'drjuan@ejemplo.com',       // Tu email
    url: 'https://drjuanperez.com',    // Tu dominio
    phone: '+57 300 000 0000',         // Tu teléfono
  },
  profession: {
    es: {
      title: 'Médico Cardiólogo | Especialista en Ecocardiografía',
      description: 'Cardiólogo con 15 años de experiencia...',
    },
    en: {
      title: 'Cardiologist | Echocardiography Specialist',
      description: 'Cardiologist with 15 years of experience...',
    }
  },
  theme: 'medicina',  // Elige tu tema visual
}
```

### Temas disponibles:
- `tech` - Tecnología/Desarrollo (azul moderno)
- `medicina` - Medicina/Salud (verde limpio)
- `legal` - Derecho/Legal (azul marino elegante)
- `arquitectura` - Arquitectura (tonos tierra)
- `marketing` - Marketing/Negocios (vibrante)
- `diseno` - Diseño/Creativo (rosa/violeta)
- `personalizado` - Tú defines los colores

---

## 3. Personalización Visual (Temas)

Cada tema incluye:
- Paleta de colores (primario, secundario, acento)
- Fuente tipográfica
- Estilo visual (moderno, elegante, clásico, etc.)

### Cambiar el tema:
1. Abre `src/config/site.config.js`
2. Cambia `theme: 'medicina'` por el que prefieras
3. Reinicia el servidor: `npm run dev`

### Tema personalizado:
Si ningún tema te convence, puedes definir tus propios colores en `src/config/themes.js` o desde el panel de administración.

---

## 4. Base de Datos (Supabase)

### Opción A: Usar Supabase (recomendado)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. En el panel de administración del portafolio, ve a la pestaña **"Base de Datos"**
4. Pega tu URL, Anon Key y Service Role Key
5. Haz clic en **"Crear Tablas Automáticamente"**

### Variables de entorno (.env.local):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
ADMIN_TOKEN=tu_contraseña_admin_secreta
```

### Tablas creadas automáticamente:
- `profile` - Datos del profesional (nombre, foto, CV, etc.)
- `projects` - Proyectos/Portafolio
- `experience` - Experiencia laboral
- `skills` - Habilidades/Tecnologías
- `posts` - Blog/Artículos
- `chatbot_config` - Configuración del asistente IA
- `messages` - Bandeja de contacto

---

### Opción B: Modo sin Backend (JSON)

Si no quieres usar Supabase, el portafolio funciona con archivos JSON locales.

1. Abre `src/config/site.config.js`
2. Cambia `backend.provider` a `'json'`:

```js
backend: {
  provider: 'json',
}
```

3. Crea/edita los archivos JSON en `src/data/`:
   - `src/data/profile.json` - Tus datos personales
   - `src/data/projects.json` - Tus proyectos
   - `src/data/experience.json` - Tu experiencia
   - `src/data/skills.json` - Tus habilidades

---

## 5. Modo Sin Backend (JSON)

### Estructura de los archivos JSON:

**profile.json:**
```json
{
  "hero_title_es": "Médico Cardiólogo | Especialista",
  "hero_title_en": "Cardiologist | Specialist",
  "name_es": "Dr. Juan Pérez",
  "name_en": "Dr. Juan Perez",
  "greeting_es": "Hola",
  "greeting_en": "Hello",
  "email": "drjuan@ejemplo.com",
  "cv_url": "https://drive.google.com/tu-cv",
  "linkedin_url": "https://linkedin.com/in/tuusuario",
  "github_url": "https://github.com/tuusuario",
  "about_me_paragraphs": [
    { "es": "<p>Texto en español...</p>", "en": "<p>Text in English...</p>" }
  ],
  "is_cv_visible": true,
  "is_linkedin_visible": true,
  "is_github_visible": false,
  "is_particles_visible": true
}
```

**projects.json:**
```json
[
  {
    "id": 1,
    "slug": "proyecto-ejemplo",
    "title_es": "Proyecto Ejemplo",
    "title_en": "Example Project",
    "description_es": "Descripción...",
    "description_en": "Description...",
    "image_url": "/images/projects/ejemplo.png",
    "category_es": "Webs",
    "category_en": "Websites",
    "technologies": ["React", "Node.js"],
    "link_url": "https://ejemplo.com",
    "is_featured": true,
    "is_visible": true
  }
]
```

**experience.json:**
```json
[
  {
    "id": 1,
    "role_es": "Cardiólogo Jefe",
    "role_en": "Chief Cardiologist",
    "company_es": "Hospital Central",
    "company_en": "Central Hospital",
    "description_es": "Responsable del departamento...",
    "description_en": "Responsible for the department...",
    "date_es": "2020 - Presente",
    "date_en": "2020 - Present",
    "is_active": true,
    "is_featured": true
  }
]
```

**skills.json:**
```json
[
  { "id": 1, "name": "Ecocardiografía", "category": "Especialidad", "icon_name": "heart", "sort_order": 0 },
  { "id": 2, "name": "Electrocardiograma", "category": "Diagnóstico", "icon_name": "activity", "sort_order": 1 }
]
```

---

## 6. Personalización del Chatbot IA

Desde el panel admin, pestaña **"Chatbot IA"**:

### Activar/Desactivar
Toggle para mostrar u ocultar el botón flotante.

### Configuraciones clave:
- **Nombre del bot**: "MediBot", "LegalAI", etc.
- **Saludos**: Personaliza el mensaje de bienvenida en español e inglés
- **Acciones rápidas**: Botones sugeridos (ej: "Agendar cita", "Ver servicios")
- **Datos de entrenamiento**: El campo más importante. Aquí vuelcas toda la info que quieres que la IA sepa sobre ti.

### Ejemplo de training data para un médico:
```
DATOS DEL PROFESIONAL:
- Nombre: Dr. Juan Pérez
- Especialidad: Cardiología
- Consultorio: Av. Principal 123, Lima
- Horario: Lun-Vie 9am-6pm, Sáb 9am-1pm

EXPERIENCIA:
- 15 años de experiencia clínica
- Más de 5,000 pacientes atendidos

SERVICIOS Y PRECIOS:
- Consulta general: S/150 (incluye electrocardiograma)
- Ecocardiograma: S/200
- Prueba de esfuerzo: S/250
- Holter 24h: S/180

FAQ:
- ¿Aceptan seguros? Sí, Rímac, Pacífico y Mapfre
- ¿Cómo agendar? Por WhatsApp al +51 999 888 777
```

### Modelo IA:
- **Groq** (recomendado): Rápido y gratuito. Usa Llama 3.
- **OpenAI**: Requiere API key de pago. Modelos: GPT-4o, GPT-4o-mini.
- **Gemini**: API key gratuita de Google.

---

## 7. Estructura de Archivos

```
src/
  config/
    site.config.js       ← CONFIGURACIÓN PRINCIPAL (edita esto primero)
    themes.js            ← Paletas de colores por profesión
  data/                  ← Datos JSON (modo standalone)
    profile.json
    projects.json
    experience.json
    skills.json
    sections.json        ← Orden/visibilidad de secciones
  components/            ← Componentes reutilizables
  app/                   ← Rutas y páginas (Next.js App Router)
  helpers/               ← Utilidades (traducciones, datos estáticos)
  lib/                   ← Librerías (Supabase, MDX, dataService)
public/
  images/                ← Imágenes y assets
supabase_schema.sql     ← Esquema de base de datos
```

---

## 8. FAQ / Problemas Comunes

### ¿Cómo cambio el color principal?
Edita `src/config/site.config.js` y cambia `theme`. O crea un tema personalizado en `src/config/themes.js`.

### ¿Cómo agrego/quito secciones de la homepage?
Desde el panel admin, usa el botón de editar secciones (ícono de lápiz). Arrastra para reordenar, toggle para mostrar/ocultar.

### El chatbot no funciona
Verifica que tengas configurada la API key del proveedor IA en `.env.local`:
- `GROQ_API_KEY` para Groq
- `OPENAI_API_KEY` para OpenAI
- `GEMINI_API_KEY` para Gemini

### ¿Cómo despliego en Vercel?
1. Sube el proyecto a GitHub
2. Conecta el repo en Vercel
3. Agrega las variables de entorno en Vercel Dashboard
4. Deploy automático en cada push

### ¿Cómo cambio el favicon?
Reemplaza `public/favicon.ico` por tu propio favicon.

### ¿Cómo cambio las imágenes por defecto?
Reemplaza los archivos en `public/images/`. Las imágenes principales:
- `og.png` - Imagen para compartir en redes sociales
- `profile.svg` - Logo/icono
- `projects-cover.jpg` - Portada de proyectos

---

## Soporte

Si tienes dudas sobre la personalización, revisa los comentarios en `src/config/site.config.js` - cada opción está documentada allí.
