# 📊 SEO & Configuración de Búsqueda

## Google Search Console

### Pasos para configurar Google Search Console:

1. **Ir a Google Search Console**: https://search.google.com/search-console/about
2. **Agregar propiedad**:
   - Método: URL (https://jaimetr.dev)
   - O usar Verificación DNS para dominio completo

3. **Verificación recomendada - Archivo HTML**: 
   - Next.js sirve archivos en `public/` automáticamente
   - Coloca el archivo HTML en `public/`

4. **Enviar sitemap**:
   - Ir a Sitemaps
   - Agregar: `https://jaimetr.dev/sitemap.xml`
   - También está en `/sitemap.js` (dinámico)

### Optimizaciones implementadas:

✅ **Metadata completa**:
- Title, Description, Keywords dinámicas
- Open Graph tags (og:image, og:title, og:description, og:url)
- Twitter Cards
- Canonical URLs

✅ **Structured Data (JSON-LD)**:
- Person schema (home)
- BlogPosting schema (posts)
- SoftwareApplication schema (projects)

✅ **Robot directives**:
- robots.txt con sitemap reference
- robots meta en metadata config
- googleBot directives (max-image-preview, max-snippet, etc)

✅ **Sitemap dinámico**:
- Genera automáticamente en `/sitemap.js`
- Incluye todos los posts y projects
- Prioridades configuradas (1.0 home, 0.9 pages, 0.8 content)
- changeFrequency configurada

✅ **Manifest PWA**:
- `public/manifest.json` para instalación en dispositivos
- Apple Web App capable

✅ **Performance SEO**:
- Next.js Image optimization
- Compresión de imágenes
- CSS-in-JS optimizado
- Code splitting automático

## Bing Webmaster Tools

1. Ir a https://www.bing.com/webmasters/
2. Agregar sitio: https://jaimetr.dev
3. Verificar mediante:
   - Archivo XML en `public/`
   - Meta tag en layout
   - CNAME DNS

Agregar sitemap: `https://jaimetr.dev/sitemap.xml`

## Verificaciones DNS recomendadas

Para máxima confiabilidad, agrega estos records DNS:

```
# Bing verification (ejemplo)
Type: CNAME
Name: 0dc0cf2e2bfa9d03
Value: verify.bing.com

# Google verification (si usas DNS)
Type: TXT
Name: @
Value: google-site-verification=xxxxx
```

## Palabras clave por sección

### Home Page
- Jaime Tarazona, Desarrollador Full-Stack, Ingeniero de Sistemas, Web Developer
- React, Next.js, JavaScript, PHP, Laravel, WordPress, IA

### Blog (/posts)
- Blog programación, desarrollo web, tutorials, JavaScript, React, Next.js

### Proyectos (/projects)
- Portafolio proyectos, desarrollo full-stack, aplicaciones web

### Posts individuales
- Generadas dinámicamente desde tags y título del post
- Ej: `if tags=['JavaScript', 'React']` → keywords incluyen ambas

## Monitoreo recomendado

1. **Google Search Console**:
   - Revisar clicks, impresiones, posición media
   - Core Web Vitals
   - Cobertura (errores de rastreo)

2. **Google Analytics 4**:
   - Configurar evento de scroll tracking
   - Event tracking en botones CTA
   - Demografía de visitantes

3. **Lighthouse**:
   - Ejecutar: `npm run build && npx lighthouse https://jaimetr.dev`
   - Objetivo: 90+ en Performance, SEO, Accessibility

## Variables de entorno para verificación

En `.env.local` puedes agregar códigos de verificación:

```
# Google Search Console
NEXT_PUBLIC_GOOGLE_VERIFICATION=xxxxx

# Bing Webmaster Tools
NEXT_PUBLIC_BING_VERIFICATION=xxxxx

# Meta tags de verificación
NEXT_PUBLIC_VERIFY_META_BING=xxxxx
```

Luego usar en `layout.js`:

```javascript
verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
}
```

## Checklist SEO Final

- [ ] Google Search Console: Sitio verificado
- [ ] Bing Webmaster Tools: Sitio agregado
- [ ] Sitemap.xml: En Google Search Console
- [ ] robots.txt: Permitiendo crawling
- [ ] Manifest.json: Configurado para PWA
- [ ] Core Web Vitals: Optimizados
- [ ] Open Graph: Testeado en debugger de Facebook
- [ ] Twitter Cards: Testeado en Twitter Card Validator
- [ ] Structured Data: Validado en Schema.org validator
- [ ] Mobile: Responsive en todos los tamaños

## Enlaces útiles

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook OG Debugger](https://developers.facebook.com/tools/debug/og/object/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
