import '@fontsource-variable/onest';
import '@fontsource/poppins';
import '@/app/fonts.css'
import '@/app/globals.css'

export const metadata = {
  title: 'PortafolioPRO | Portafolios Profesionales en Minutos',
  description: 'Crea tu portafolio profesional con plantillas diseñadas para tu profesión. Sin código, sin complicaciones.',
  keywords: ['portafolio', 'profesional', 'curriculum', 'portfolio', 'cv'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `,
        }} />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-950 dark:text-dark-100 font-sans antialiased" style={{ fontFamily: "'Poppins', 'Braze', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
