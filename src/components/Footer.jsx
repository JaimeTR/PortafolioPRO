'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useState, useEffect } from 'react'
import { getFooterConfig } from '@/lib/dataService'

export const Footer = () => {
    const { language } = useLanguage()
    const [footerData, setFooterData] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetchFooterData()
    }, [])

    const fetchFooterData = async () => {
        const data = await getFooterConfig()
        setFooterData(data)
    }

    if (!mounted) return null

    const defaultLinks = [
        { id: 'l1', url_es: '/', url_en: '/', label_es: 'Inicio', label_en: 'Home', visible: true },
        { id: 'l2', url_es: '/#experience', url_en: '/#experience', label_es: 'Experiencia', label_en: 'Experience', visible: true },
        { id: 'l3', url_es: '/projects', url_en: '/projects', label_es: 'Proyectos', label_en: 'Projects', visible: true }
    ]

    const links = footerData?.footer_links || defaultLinks
    const textEs = footerData?.footer_text_es || 'Portafolio Profesional'
    const textEn = footerData?.footer_text_en || 'Professional Portfolio'

    return (
        <footer id="contacto" className="container mx-auto px-2 lg:px-28 2xl:px-52 mt-14 mb-8">
            <div className="rounded-lg border-dark-100 dark:border-dark-700 shadow dark:shadow-dark-700 mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between ">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    <Link href="/" className="hover:underline">
                        {language === 'es' ? textEs : textEn}
                    </Link>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    {links.filter(l => l.visible !== false).map(link => (
                        <li key={link.id}>
                            <Link href={language === 'es' ? link.url_es : link.url_en} className="mr-4 hover:underline md:mr-6">
                                {language === 'es' ? link.label_es : link.label_en}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}
