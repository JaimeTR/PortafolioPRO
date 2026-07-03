/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        'text-primary-700',
        'dark:text-primary-400',
        'text-crusta-800',
        'dark:text-crusta-300',
        'font-bold',
        'underline',
        'text-left',
        'text-center',
        'text-right',
        'text-justify',
        'from-primary-400',
        'via-indigo-400',
        'to-primary-300',
        'bg-clip-text',
        'text-transparent',
        'bg-[length:200%_100%]',
    ],
    theme: {
        extend: {
            animation: {
                'background-shine': 'background-shine 2s linear infinite',
            },
            keyframes: {
                'background-shine': {
                    from: {
                        backgroundPosition: '0 0',
                    },
                    to: {
                        backgroundPosition: '-200% 0',
                    },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                sans: ['"Poppins"', '"Braze"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['"Braze"', '"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                background: '#050505',
                card: '#111111',
                foreground: '#FFFFFF',
                muted: '#A1A1AA',
                accent: '#0820ab',

                primary: {
                    50: '#eef2ff',
                    100: '#e0e6ff',
                    200: '#c7d0fe',
                    300: '#a5b0fc',
                    400: '#8185f8',
                    500: '#6360f3',
                    600: '#4b3fe6',
                    700: '#3d30cc',
                    800: '#0820ab',
                    900: '#071d8f',
                    950: '#041266',
                },
                daintree: {
                    50: '#e9fffe',
                    100: '#c9fffe',
                    200: '#99ffff',
                    300: '#54fbff',
                    400: '#07edff',
                    500: '#00cfef',
                    600: '#00a4c9',
                    700: '#0082a1',
                    800: '#086882',
                    900: '#0c556d',
                    950: '#00171f',
                },
                crusta: {
                    50: '#fff6ed',
                    100: '#ffebd4',
                    200: '#ffd2a9',
                    300: '#ffb272',
                    400: '#fe7f2d',
                    500: '#fd6412',
                    600: '#ee4a08',
                    700: '#c53509',
                    800: '#9c2b10',
                    900: '#7e2610',
                    950: '#440f06',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
        },
    },
    darkMode: 'class',
    animation: {
        'background-shine': 'background-shine 2s linear infinite',
    },
    keyframes: {
        'background-shine': {
            from: {
                backgroundPosition: '0 0',
            },
            to: {
                backgroundPosition: '-200% 0',
            },
        },
    },
    plugins: [],
}
