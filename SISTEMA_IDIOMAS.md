# 🌍 Sistema de Idiomas Multi-Lenguaje (ES/EN)

## 📋 Descripción General

Se ha implementado un sistema completo de cambio de idioma en tu portafolio que permite a los usuarios ver el contenido en español o inglés. El sistema detecta automáticamente el idioma del navegador del usuario al abrir la página por primera vez.

## ✨ Características Principales

### 1. **Detección Automática de Idioma**
- Al abrir la página, el sistema detecta el idioma del navegador
- Si es español (es-ES, es-MX, etc.), muestra el contenido en español
- Si es inglés (en-US, en-GB, etc.), muestra el contenido en inglés
- Por defecto, usa español si el idioma no es detectado
- La preferencia se guarda en `localStorage` para persistencia

### 2. **Selector de Idioma Visual**
- Ubicado en la navbar al lado del botón de tema (selector derecha)
- Botones "ES" e "EN" para cambiar entre idiomas
- Botón activo se resalta con color primario
- Funciona en versiones desktop y móvil

### 3. **Persistencia de Preferencia**
- La selección de idioma se guarda en `localStorage`
- Se mantiene al recargar la página
- Se mantiene entre sesiones

## 🏗️ Estructura de Archivos Implementados

### Providers
- **`src/app/providers/LanguageProvider.jsx`** - Context provider para manejar estado global de idioma

### Componentes
- **`src/components/LanguageSwitch.jsx`** - Botón selector de idioma en navbar

### Traducciones
- **`src/helpers/translations.js`** - Diccionario de traducciones (ES/EN)

## 🔧 Implementación en Componentes

### Componentes Traducidos
Se han traducido todos los textos estáticos de:
- ✅ Navbar (Proyectos, Experiencia, Blog, Contacto)
- ✅ Banner (Encabezado principal con descripción)
- ✅ Experience (Sección de experiencia laboral)
- ✅ About (Sección Sobre mí)
- ✅ Projects (Sección de proyectos)
- ✅ Articles (Sección de artículos)
- ✅ Stack (Tecnologías)
- ✅ Footer

## 📝 Cómo Usar las Traducciones

### En un Componente Cliente (Client Component)

```jsx
'use client'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import { useEffect, useState } from 'react'

export const MiComponente = () => {
    const [mounted, setMounted] = useState(false)
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    if (!mounted) return null
    
    return (
        <div>
            <h1>{t('hola')}</h1>
            <p>{t('sobreMi')}</p>
        </div>
    )
}
```

### Usando Condicional Simple

```jsx
<h1>{language === 'es' ? 'Proyectos' : 'Projects'}</h1>
```

## 📚 Claves de Traducción Disponibles

### Navbar
- `proyectos` - Projects
- `experiencia` - Experience
- `blog` - Blog
- `contacto` - Contact

### Banner
- `hola` - Hello
- `soySoy` - I'm Jaime T.R
- `ingeniero` - Engineer description
- `experiencia_anios` - Years of experience
- `experiencia_desc` - Experience description
- `especializado` - Specialized in...
- `dispuesto` - Ready to work
- `articulos` - Articles

### About Section
- `sobreMi` - About Me
- `holaYo` - Hello I'm...
- `ingenieroSistemas` - Engineer, Full-Stack Developer
- `webDeveloper` - Web Developer
- `experienciaAnios` - With X years of experience
- `desarrollando` - Developing from...
- `garantizando` - Guaranteeing...
- `unoPrincipal` - One of my main projects
- `inoia` - InoIA
- `asistente` - Virtual assistant description
- `ofrece` - It offers...
- `tambienProyecto` - Also as a personal project
- `articulos_desc` - Articles about...
- `compartir` - When you share knowledge...
- `ultimamente` - Finally...
- `cv` - Resume

### Sections
- `misPro` - My Projects
- `misArticulos` - My Articles
- `experienciaSeccion` - Experience
- `miStack` - My Tech Stack

### Footer
- `derechos` - All rights reserved
- `hecho` - Made with
- `por` - by Jaime Tarazona

## 🔄 Agregar Nuevas Traducciones

1. Abre `src/helpers/translations.js`
2. Agrega la clave en ambos idiomas:

```javascript
export const translations = {
    es: {
        miNuevaClave: 'Texto en español',
        // ... más claves
    },
    en: {
        miNuevaClave: 'Text in English',
        // ... más claves
    }
}
```

3. Usa en tu componente:

```jsx
const t = useTranslation(language)
<p>{t('miNuevaClave')}</p>
```

## 🎯 Flujo de Detección de Idioma

```
Usuario abre la página
    ↓
¿Hay idioma guardado en localStorage?
    ├─ SÍ → Usar idioma guardado
    └─ NO → Detectar idioma del navegador
        ├─ Si es "es" → Usar español
        ├─ Si es "en" → Usar inglés
        └─ Default → Usar español
    ↓
Guardar preferencia en localStorage
    ↓
Mostrar UI traducida
```

## 🧪 Verificación

Para verificar que el sistema funciona:

1. Abre la página en tu navegador
2. El idioma debería coincidir con tu configuración del navegador
3. Haz clic en el selector ES/EN en la navbar
4. El contenido debería cambiar inmediatamente
5. Recarga la página - debería mantener tu selección

## 💡 Notas Importantes

- **Componentes Client**: Todos los componentes que usan `useLanguage()` deben tener `'use client'`
- **Hidratación**: Siempre usa `useEffect` + `useState` para evitar problemas de hidratación
- **Textos Dinámicos**: Los textos del contenido de blogs/proyectos No están traducidos (solo estática)
- **SEO**: El idioma html en el layout está configurado como `lang="es"` por defecto, pero está planeado hacerlo dinámico

## 🚀 Futuras Mejoras

- [ ] Traducir descripción de proyectos y artículos
- [ ] Agregar hreflang para SEO multi-idioma
- [ ] Cambiar lang dinámicamente en el tag html según idioma seleccionado
- [ ] Agregar más idiomas (portugués, francés, etc.)
- [ ] Crear un sistema de ruteo dinámico por idioma (ej: /es/proyectos, /en/projects)

## 📞 Soporte

Si necesitas agregar más traducciones o ajustar algo, recuerda:
1. Todos los cambios de UI estática van en `translations.js`
2. Los componentes cliente necesitan `'use client'` al inicio
3. Siempre importa `useLanguage` y `useTranslation` donde las necesites
