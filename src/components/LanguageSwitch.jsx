'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { FiChevronDown } from 'react-icons/fi'

export const LanguageSwitch = ({ show = true }) => {
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { language, changeLanguage } = useLanguage()
    const router = useRouter()
    const pathname = usePathname()
    const dropdownRef = useRef(null)

    useEffect(() => {
        setMounted(true)
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Map route between EN and ES versions
    const getLocalizedPath = (newLang) => {
        if (!pathname) return '/'
        const segments = pathname.split('/')
        // Replace the first segment (which is the current lang 'es' or 'en')
        if (segments[1] === 'es' || segments[1] === 'en') {
            segments[1] = newLang
        } else {
            segments.splice(1, 0, newLang)
        }
        return segments.join('/')
    }

    const handleLanguageChange = (newLang) => {
        changeLanguage(newLang)
        router.push(getLocalizedPath(newLang))
        setIsOpen(false)
    }

    if (!mounted) {
        return null
    }

    const languages = [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'English' }
    ]

    const activeLang = languages.find(l => l.code === language) || languages[0]

    return (
        <div className={`relative ${!show && 'md:hidden'}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-dark-700 hover:text-primary-600 dark:text-dark-200 dark:hover:text-primary-400 bg-dark-100/50 hover:bg-dark-200/50 dark:bg-dark-800/50 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-300"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {activeLang.code.toUpperCase()}
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden z-50">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-200 ${
                                        language === lang.code
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 font-semibold'
                                            : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
                                    }`}
                                >
                                    {lang.label}
                                    {language === lang.code && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
