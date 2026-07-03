/**
 * Traducciones generalizadas del Portafolio
 * =========================================
 * NO contiene referencias personales.
 * Los placeholders se reemplazan desde site.config.js
 */

export const translations = {
  es: {
    // Navbar
    proyectos: 'Proyectos',
    experiencia: 'Experiencia',
    blog: 'Blog',
    contacto: 'Contacto',
    servicios: 'Servicios',
    rutaProyectos: 'proyectos',
    rutaArticulos: 'articulos',

    // Home Banner
    hola: 'Hola',
    soySoy: 'soy',
    ingeniero: 'Profesional',
    experiencia_anios: '+X años de experiencia.',
    experiencia_desc: 'Profesional especializado en soluciones de calidad',
    especializado: 'Especializado en crear soluciones profesionales y eficaces',
    dispuesto: 'Dispuesto a trabajar en tu proyecto y aportar mis habilidades.',
    linkedin: 'LinkedIn',
    github: 'GitHub',

    // Botones en Banner
    articulos: 'Artículos',

    // Experience
    experienciaSeccion: 'Experiencia',

    // About
    sobreMi: 'Sobre mí',
    holaYo: 'Hola, soy un profesional apasionado por lo que hago.',
    parrafo1: 'Con experiencia en el sector, me dedico a ofrecer servicios de calidad, adaptados a las necesidades específicas de cada cliente.',
    parrafo2: 'Mi enfoque está en la excelencia, la comunicación clara y los resultados medibles.',
    parrafo3: 'Además, comparto contenido y artículos sobre mi área de especialidad para ayudar a otros profesionales y clientes a tomar mejores decisiones.',
    parrafo4: 'Si quieres conocer más sobre mi trayectoria y formación, te invito a descargar mi hoja de vida actualizada.',

    // Projects
    misPro: 'Mis Proyectos',
    verTodosProyectos: 'Ver todos los proyectos',
    verProyecto: 'VER PROYECTO',
    mas: 'más',
    resumen: 'Resumen',
    descripcionProyecto: 'Descripción del proyecto',
    tecnologiasUsadas: 'Tecnologías usadas',
    tecnologia: 'Tecnología',
    uso: 'Uso',
    caracteristicasPrincipales: 'Características principales',
    galeria: 'Galería',
    irAlSitio: 'Ir al sitio',
    repo: 'Repositorio',

    // Animated Portfolio Categories
    todos: 'Todos',
    webs: 'Webs',
    sistemasWeb: 'Sistemas Web',
    softwareAMedida: 'Software a Medida',
    ecommerce: 'Ecommerce',
    ia: 'Inteligencia Artificial',
    landingPages: 'Landing Pages',
    automatizaciones: 'Automatizaciones',
    categoria: 'Categoría:',
    noProyectos: 'Aún no hay proyectos en esta categoría',
    proyectosCompletados: '+ {count} Proyectos entregados',
    clientesSatisfechos: '+ {count} Clientes satisfechos',
    codigoEficiente: 'Código eficiente y escalable',
    experienciaContinua: 'Experiencia continua en proyectos personales y profesionales.',

    // Blog
    misArticulos: 'Mis Artículos',
    leidos: 'artículos publicados',
    leerMas: 'Leer más',
    blogProgramacion: 'Blog Profesional',

    // Stack
    miStack: 'Mi Stack Tecnológico',

    // Footer
    derechos: 'Todos los derechos reservados',
    hecho: 'Hecho con',

    // Common
    inicio: 'Inicio',
    cv: 'CV',
    descargarCV: 'Descargar CV',
  },

  en: {
    // Navbar
    proyectos: 'Projects',
    experiencia: 'Experience',
    blog: 'Blog',
    contacto: 'Contact',
    servicios: 'Services',
    rutaProyectos: 'projects',
    rutaArticulos: 'posts',

    // Home Banner
    hola: 'Hello',
    soySoy: "I'm",
    ingeniero: 'Professional',
    experiencia_anios: '+X years of experience.',
    experiencia_desc: 'Professional specialized in quality solutions',
    especializado: 'Specialized in creating professional and efficient solutions',
    dispuesto: 'Ready to work on your project and contribute my skills.',
    linkedin: 'LinkedIn',
    github: 'GitHub',

    // Botones en Banner
    articulos: 'Articles',

    // Experience
    experienciaSeccion: 'Experience',

    // About
    sobreMi: 'About Me',
    holaYo: 'Hello, I am a professional passionate about what I do.',
    parrafo1: 'With experience in the field, I dedicate myself to offering quality services tailored to each client\'s specific needs.',
    parrafo2: 'My focus is on excellence, clear communication, and measurable results.',
    parrafo3: 'Additionally, I share content and articles about my area of expertise to help other professionals and clients make better decisions.',
    parrafo4: 'If you want to know more about my career and training, I invite you to download my updated resume.',

    // Projects
    misPro: 'My Projects',
    verTodosProyectos: 'View all projects',
    verProyecto: 'VIEW PROJECT',
    mas: 'more',
    resumen: 'Summary',
    descripcionProyecto: 'Project description',
    tecnologiasUsadas: 'Technologies used',
    tecnologia: 'Technology',
    uso: 'Use',
    caracteristicasPrincipales: 'Main features',
    galeria: 'Gallery',
    irAlSitio: 'Go to site',
    repo: 'Repository',

    // Animated Portfolio Categories
    todos: 'All',
    webs: 'Websites',
    sistemasWeb: 'Web Systems',
    softwareAMedida: 'Custom Software',
    ecommerce: 'Ecommerce',
    ia: 'Artificial Intelligence',
    landingPages: 'Landing Pages',
    automatizaciones: 'Automations',
    categoria: 'Category:',
    noProyectos: 'No projects found in this category',
    proyectosCompletados: '+ {count} Delivered Projects',
    clientesSatisfechos: '+ {count} Happy Clients',
    codigoEficiente: 'Efficient & Scalable Code',
    experienciaContinua: 'Continuous experience in personal and professional projects.',

    // Blog
    misArticulos: 'My Articles',
    leidos: 'articles published',
    leerMas: 'Read more',
    blogProgramacion: 'Professional Blog',

    // Stack
    miStack: 'My Tech Stack',

    // Footer
    derechos: 'All rights reserved',
    hecho: 'Made with',

    // Common
    inicio: 'Home',
    cv: 'Resume',
    descargarCV: 'Download Resume',
  }
}

export const useTranslation = (language) => {
  return (key, replacements = {}) => {
    let text = translations[language]?.[key] || translations['es'][key] || key
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }
}
