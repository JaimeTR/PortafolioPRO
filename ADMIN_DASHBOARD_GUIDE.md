# 📊 Dashboard Admin - Guía de Uso

## 🎯 Descripción

Dashboard administrativo para tu portafolio que permite:
- **📝 Generar blogs** automáticamente con IA (Google Gemini u OpenAI)
- **🚀 Agregar nuevos proyectos**
- **💼 Registrar experiencia laboral**
- **🔒 Acceso protegido** con contraseña

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Agrega a tu archivo `.env.local`:

```env
# Contraseña del Dashboard (por defecto: admin123)
NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_segura

# Token admin
ADMIN_TOKEN=tu_contraseña_segura

# Para generador de blogs (opcional)
AI_PROVIDER=gemini
GOOGLE_GENERATIVE_AI_API_KEY=tu_clave_google
OPENAI_API_KEY=tu_clave_openai
```

### 2. Acceso al Dashboard

```
http://localhost:3000/admin/login
```

- **Contraseña por defecto**: `admin123`
- Después del login, serás redirigido a `/admin/dashboard`

## 📋 Funcionalidades

### 📝 Generar Blogs

1. Selecciona la pestaña "Generar Blogs"
2. Ingresa el tema del artículo
3. Elige el proveedor de IA (Google Gemini o OpenAI)
4. **(Opcional)** Sube una imagen de portada personalizada
   - Formatos soportados: JPG, PNG, WebP, etc.
   - Tamaño máximo: 5MB
   - Si no subes imagen, se generará automáticamente
5. Haz clic en "Generar Artículo"

**Lo que sucede automáticamente:**
- Se genera un artículo MDX completo con IA
- Se crea el archivo en `src/posts/[slug].mdx`
- Se procesa y guarda la portada (personalizada o generada)
- Se asignan tags automáticos

**Archivos generados:**
- `src/posts/[slug].mdx` - Contenido del artículo
- `public/images/posts/[slug].webp` - Portada (se convierte a WebP automáticamente)

### 📚 Gestionar Blogs (NUEVO)

Pestaña "Gestionar Blogs" que permite:

1. **Ver lista de todos tus blogs** con:
   - Miniatura de portada
   - Título
   - Resumen
   - Tags
   - Fecha de publicación

2. **Editar cualquier blog**:
   - Cambiar título
   - Actualizar fecha
   - Modificar extracto y descripción (SEO)
   - Editar tags
   - Cambiar imagen de portada
   - Editar contenido MDX completo

3. **Eliminar blogs** que ya no necesites:
   - Se elimina el archivo MDX
   - Se elimina la imagen de portada
   - Confirmación antes de eliminar

### 🚀 Agregar Proyecto

1. Selecciona la pestaña "Agregar Proyecto"
2. Completa los campos:
   - **Nombre del Proyecto** (requerido)
   - **Descripción** (requerido)
   - **Tecnologías** (separadas por comas)
   - **Link del Proyecto** (opcional)
   - **GitHub** (opcional)
   - **Imagen** (URL, opcional)
3. Haz clic en "Agregar Proyecto"

### 💼 Agregar Experiencia

1. Selecciona la pestaña "Agregar Experiencia"
2. Completa los campos:
   - **Puesto/Rol** (requerido) - Ej: "Web Developer | Wordpress"
   - **Empresa** (requerido)
   - **Período de tiempo** (requerido) - Ej: "Marzo 2024 - Actualidad"
   - **Descripción** (requerido)
3. Haz clic en "Agregar Experiencia"

## 🔐 Seguridad

### Cambiar Contraseña

Edita tu archivo `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=nueva_contraseña_fuerte
ADMIN_TOKEN=nueva_contraseña_fuerte
```

Reinicia el servidor y la nueva contraseña estará activa.

### ⚠️ Importante para Producción

```js
// NUNCA uses NEXT_PUBLIC_ para datos sensibles en producción
// En su lugar, usa variables privadas del servidor
```

En un entorno de producción:
1. Usa un servicio de autenticación (NextAuth, Auth0, etc.)
2. Implementa autenticación basada en JWT
3. Protege con HTTPS
4. Usa una base de datos para almacenar datos

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.js          # Página de login
│   │   └── dashboard/
│   │       └── page.js          # Dashboard principal
│   └── api/
│       └── admin/
│           ├── blog/
│           │   └── route.js      # API para generar blogs
│           └── data/
│               └── route.js      # API para proyectos y experiencia
├── components/
│   └── Admin/
│       ├── AdminHeader.jsx       # Encabezado del dashboard
│       ├── BlogGeneratorForm.jsx # Formulario de blogs
│       ├── ProjectForm.jsx       # Formulario de proyectos
│       └── ExperienceForm.jsx    # Formulario de experiencia
└── posts/
    └── [slug].mdx               # Posts generados
```

## 🎨 Diseño

El dashboard mantiene tu **diseño y estilo actual**:
- Usa los mismos colores de tema oscuro/claro
- Mismas fuentes y componentes
- Interfaz limpia y moderna
- Totalmente responsive
- Validación de archivos e imágenes

## 🔄 Flujo de Trabajo

```
1. Accede a /admin/login
   ↓
2. Ingresa tu contraseña
   ↓
3. Vas a /admin/dashboard
   ↓
4. Selecciona la opción que deseas:
   • Generar Blogs (crear nuevo)
   • Gestionar Blogs (ver, editar, eliminar)
   • Agregar Proyecto
   • Agregar Experiencia
   ↓
5. Completa el formulario
   ↓
6. Los datos se guardan automáticamente
   ↓
7. Se actualizan en tu portafolio
```

## 📝 Próximas Mejoras

- [ ] ~~Editar blogs, proyectos y experiencia existentes~~ ✅ HECHO
- [ ] ~~Visualizar lista de blogs~~ ✅ HECHO
- [ ] ~~Eliminar blogs~~ ✅ HECHO
- [ ] Editar proyectos y experiencia existentes
- [ ] Vista previa de blogs antes de guardar
- [ ] Búsqueda y filtrado de blogs
- [ ] Estadísticas de contenido
- [ ] Backup automático
- [ ] Base de datos para almacenamiento persistente

## ❓ Preguntas Frecuentes

**P: ¿Se mantiene el diseño actual?**
R: Sí, el dashboard usa los mismos colores y estilos de tu portafolio.

**P: ¿Necesito cambiar algo en mi portafolio actual?**
R: No, el dashboard es totalmente independiente. Tu portafolio sigue funcionando igual.

**P: ¿Puedo editar contenido después?**
R: Por ahora puedes acceder directamente a los archivos. En futuras versiones tendrá edición desde el dashboard.

**P: ¿Es seguro para producción?**
R: Para producción, implementa un sistema de autenticación más robusto (NextAuth, Auth0, etc.)

---

**¿Preguntas o sugerencias?** Modifica los componentes según tus necesidades.
