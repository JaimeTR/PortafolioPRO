/**
 * Configuración Central del Portafolio
 * ======================================
 * Edita este archivo para personalizar TODO el sitio.
 * Los cambios aquí se reflejan automáticamente en toda la web.
 */

const siteConfig = {
  // ========== IDENTIDAD ==========
  identity: {
    name: 'Tu Nombre',
    shortName: 'TuNombre',
    email: 'email@ejemplo.com',
    url: 'https://tudominio.com',
    language: 'es', // idioma por defecto
    phone: '+57 300 000 0000',
  },

  // ========== PROFESIÓN ==========
  profession: {
    es: {
      title: 'Tu Profesión | Especialidad | Área',
      subtitle: '+X años de experiencia.',
      category: 'profesional',
      description: 'Descripción corta de tu profesión y especialidad',
    },
    en: {
      title: 'Your Profession | Specialty | Area',
      subtitle: '+X years of experience.',
      category: 'professional',
      description: 'Short description of your profession and specialty',
    }
  },

  // ========== TEMA VISUAL ==========
  // Opciones: 'tech' | 'medicina' | 'legal' | 'arquitectura' | 'marketing' | 'diseno' | 'personalizado'
  theme: 'tech',

  // ========== BASE DE DATOS ==========
  // Modo: 'supabase' (requiere proyecto Supabase) o 'json' (sin backend, datos locales)
  backend: {
    provider: 'supabase', // 'supabase' | 'json'
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    }
  },

  // ========== SECCIONES DE LA HOME ==========
  // Orden y visibilidad. Comenta o elimina las que no quieras.
  sections: {
    profile: { enabled: true, label: 'Perfil / Hero' },
    aboutme: { enabled: true, label: 'Sobre Mí' },
    experience: { enabled: true, label: 'Experiencia' },
    projects: { enabled: true, label: 'Proyectos' },
    blog: { enabled: true, label: 'Blog / Artículos' },
    skills: { enabled: true, label: 'Tecnologías / Stack' },
  },

  // ========== REDES SOCIALES ==========
  social: {
    linkedin: { enabled: true, url: 'https://linkedin.com/in/tuusuario', icon: 'linkedin' },
    github: { enabled: true, url: 'https://github.com/tuusuario', icon: 'github' },
    email: { enabled: true },
    facebook: { enabled: false, url: '' },
    instagram: { enabled: false, url: '' },
    tiktok: { enabled: false, url: '' },
    custom1: { enabled: false, url: '', label_es: '', label_en: '', icon: 'link' },
    custom2: { enabled: false, url: '', label_es: '', label_en: '', icon: 'link' },
  },

  // ========== CV / HOJA DE VIDA ==========
  cv: {
    enabled: true,
    url: 'https://drive.google.com/tu-cv',
    label_es: 'CV',
    label_en: 'Resume',
    icon: 'file-text',
  },

  // ========== BOTONES DEL HERO ==========
  heroButtons: {
    order: ['cv', 'linkedin', 'github', 'email', 'custom1', 'custom2'],
    custom1: { enabled: true, label_es: 'Proyectos', label_en: 'Projects', link: '/{lang}/projects', icon: 'code' },
    custom2: { enabled: true, label_es: 'Artículos', label_en: 'Articles', link: '/{lang}/posts', icon: 'file-text' },
  },

  // ========== ESTADÍSTICAS ==========
  stats: {
    projectsCompleted: 350,
    happyClients: 120,
    systemsBuilt: 20,
    yearsExperience: 5,
  },

  // ========== CATEGORÍAS DE PROYECTOS ==========
  projectCategories: {
    es: ['Todos', 'Webs', 'Sistemas Web', 'Ecommerce', 'Landing Pages', 'IA', 'Automatizaciones'],
    en: ['All', 'Websites', 'Web Systems', 'Ecommerce', 'Landing Pages', 'AI', 'Automations'],
  },

  // ========== CHATBOT IA ==========
  chatbot: {
    enabled: true,
    provider: 'groq', // 'groq' | 'openai' | 'gemini'
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    maxTokens: 150,
  },

  // ========== SEO ==========
  seo: {
    keywords: ['Portafolio', 'Profesional', 'Servicios'],
    ogImage: '/images/og.png',
    twitterHandle: '',
    googleAnalyticsId: '',
  },

  // ========== MODO DESARROLLO ==========
  dev: {
    adminToken: process.env.ADMIN_TOKEN || 'admin123',
  }
}

export default siteConfig
