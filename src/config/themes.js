/**
 * Sistema de Temas por Profesión
 * ==============================
 * Cada tema define colores, fuentes y estilos visuales.
 * El usuario selecciona su tema en site.config.js → theme: 'nombre'
 */

const themes = {
  tech: {
    name: 'Tecnología / Desarrollo',
    description: 'Moderno, azul tecnológico, para ingenieros y devs',
    font: 'Onest Variable',
    fontImport: '@fontsource-variable/onest',
    headingFont: 'Onest Variable',
    style: 'modern',
    colors: {
      primary: {
        50: '#effaff', 100: '#def3ff', 200: '#b6eaff',
        300: '#75dbff', 400: '#2cc9ff', 500: '#00a8e8',
        600: '#008fd4', 700: '#0072ab', 800: '#00608d',
        900: '#065074', 950: '#04334d',
      },
      secondary: {
        50: '#fff6ed', 100: '#ffebd4', 200: '#ffd2a9',
        300: '#ffb272', 400: '#fe7f2d', 500: '#fd6412',
        600: '#ee4a08', 700: '#c53509', 800: '#9c2b10',
        900: '#7e2610', 950: '#440f06',
      },
      accent: {
        50: '#e9fffe', 100: '#c9fffe', 200: '#99ffff',
        300: '#54fbff', 400: '#07edff', 500: '#00cfef',
        600: '#00a4c9', 700: '#0082a1', 800: '#086882',
        900: '#0c556d', 950: '#00171f',
      },
      background: '#050505',
      foreground: '#FFFFFF',
      card: '#111111',
      muted: '#A1A1AA',
    }
  },

  medicina: {
    name: 'Medicina / Salud',
    description: 'Verde azulado, limpio y profesional',
    font: 'Inter',
    fontImport: '@fontsource/inter',
    headingFont: 'Inter',
    style: 'clean',
    colors: {
      primary: {
        50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc',
        300: '#67e8f9', 400: '#22d3ee', 500: '#0891b2',
        600: '#0e7490', 700: '#155e75', 800: '#164e63',
        900: '#083344', 950: '#042f2e',
      },
      secondary: {
        50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4',
        300: '#5eead4', 400: '#2dd4bf', 500: '#0d9488',
        600: '#0f766e', 700: '#115e59', 800: '#134e4a',
        900: '#042f2e', 950: '#022c22',
      },
      accent: {
        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
        300: '#86efac', 400: '#4ade80', 500: '#14b8a6',
        600: '#0d9488', 700: '#0f766e', 800: '#115e59',
        900: '#134e4a', 950: '#042f2e',
      },
      background: '#fafafa',
      foreground: '#0f172a',
      card: '#ffffff',
      muted: '#64748b',
    },
  },

  legal: {
    name: 'Derecho / Legal',
    description: 'Azul marino y dorado, elegante y serio',
    font: 'Lora',
    fontImport: '@fontsource/lora',
    headingFont: 'Lora',
    style: 'elegant',
    colors: {
      primary: {
        50: '#f0f4f8', 100: '#d9e2ec', 200: '#bcccdc',
        300: '#9fb3c8', 400: '#829ab1', 500: '#1e3a5f',
        600: '#1a3355', 700: '#152b47', 800: '#11233a',
        900: '#0c1929', 950: '#060d15',
      },
      secondary: {
        50: '#fefce8', 100: '#fef9c3', 200: '#fef08a',
        300: '#fde047', 400: '#facc15', 500: '#c9a227',
        600: '#b89429', 700: '#a17a2a', 800: '#8a6628',
        900: '#6d4c20', 950: '#422a0f',
      },
      accent: {
        50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
        300: '#a5b4fc', 400: '#818cf8', 500: '#3b5998',
        600: '#335088', 700: '#2b4575', 800: '#233a62',
        900: '#1a2f4f', 950: '#0e1a2e',
      },
      background: '#faf9f7',
      foreground: '#1a1a2e',
      card: '#ffffff',
      muted: '#6b7280',
    },
  },

  arquitectura: {
    name: 'Arquitectura / Diseño',
    description: 'Tonos tierra, elegante y minimalista',
    font: 'Playfair Display',
    fontImport: '@fontsource/playfair-display',
    headingFont: 'Playfair Display',
    style: 'classic',
    colors: {
      primary: {
        50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4',
        300: '#d6d3d1', 400: '#a8a29e', 500: '#292524',
        600: '#231f1e', 700: '#1c1917', 800: '#141110',
        900: '#0c0a09', 950: '#050403',
      },
      secondary: {
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a',
        300: '#fcd34d', 400: '#fbbf24', 500: '#d97706',
        600: '#b45309', 700: '#92400e', 800: '#78350f',
        900: '#451a03', 950: '#2d0f00',
      },
      accent: {
        50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4',
        300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c',
        600: '#57534e', 700: '#44403c', 800: '#292524',
        900: '#1c1917', 950: '#0c0a09',
      },
      background: '#faf9f8',
      foreground: '#292524',
      card: '#ffffff',
      muted: '#78716c',
    },
  },

  marketing: {
    name: 'Marketing / Negocios',
    description: 'Vibrante, colores vivos, enérgico',
    font: 'Poppins',
    fontImport: '@fontsource/poppins',
    headingFont: 'Poppins',
    style: 'bold',
    colors: {
      primary: {
        50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
        300: '#c4b5fd', 400: '#a78bfa', 500: '#7c3aed',
        600: '#6d28d9', 700: '#5b21b6', 800: '#4c1d95',
        900: '#3b0764', 950: '#1e0440',
      },
      secondary: {
        50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
        300: '#fdba74', 400: '#fb923c', 500: '#f97316',
        600: '#ea580c', 700: '#c2410c', 800: '#9a3412',
        900: '#7c2d12', 950: '#431407',
      },
      accent: {
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8',
        300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899',
        600: '#db2777', 700: '#be185d', 800: '#9d174d',
        900: '#831843', 950: '#500724',
      },
      background: '#0a0a0a',
      foreground: '#fafafa',
      card: '#171717',
      muted: '#a3a3a3',
    },
  },

  diseno: {
    name: 'Diseño / Creativo',
    description: 'Rosa y violeta, moderno y expresivo',
    font: 'DM Sans',
    fontImport: '@fontsource/dm-sans',
    headingFont: 'DM Sans',
    style: 'creative',
    colors: {
      primary: {
        50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8',
        300: '#f9a8d4', 400: '#f472b6', 500: '#db2777',
        600: '#be185d', 700: '#9d174d', 800: '#831843',
        900: '#500724', 950: '#330417',
      },
      secondary: {
        50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
        300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6',
        600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6',
        900: '#4c1d95', 950: '#2e1065',
      },
      accent: {
        50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc',
        300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4',
        600: '#0891b2', 700: '#0e7490', 800: '#155e75',
        900: '#164e63', 950: '#083344',
      },
      background: '#050508',
      foreground: '#fafafa',
      card: '#121212',
      muted: '#a1a1aa',
    },
  },

  personalizado: {
    name: 'Personalizado',
    description: 'Tú defines los colores manualmente en el admin',
    font: null,
    fontImport: null,
    headingFont: null,
    style: null,
    colors: null,
  }
}

export default themes

/**
 * Obtiene el tema actual desde la configuración
 * @param {string} themeName - Nombre del tema en site.config.js
 * @returns {object} Tema completo con colores y fuentes
 */
export function getTheme(themeName) {
  return themes[themeName] || themes.tech
}

/**
 * Genera la configuración de colores para Tailwind
 * @param {string} themeName 
 * @returns {object} Objeto de colores para tailwind.config.js
 */
export function getTailwindColors(themeName) {
  const theme = getTheme(themeName)
  if (!theme.colors) return {}
  
  return {
    primary: theme.colors.primary,
    daintree: theme.colors.accent,
    crusta: theme.colors.secondary,
    background: theme.colors.background,
    foreground: theme.colors.foreground,
    card: theme.colors.card,
    muted: theme.colors.muted,
    accent: theme.colors.primary[500],
  }
}
