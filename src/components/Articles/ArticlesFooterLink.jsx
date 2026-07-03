'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import ArticleIcon from '@/components/icons/Article'

import { FaBlog } from 'react-icons/fa'

export default function ArticlesFooterLink() {
    const { language } = useLanguage()
    
    return (
        <Link href="/posts" className="w-full block group mt-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl shadow-sm border border-dark-200 dark:border-dark-800
            transition-all duration-300 ease-out
            hover:shadow-md hover:border-primary-500/30 hover:bg-primary-50/30 dark:hover:bg-primary-900/10
            bg-white/60 dark:bg-dark-800/60 backdrop-blur-md">
                
                <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <FaBlog className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark-800 dark:text-dark-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {language === 'es' ? 'Explora más contenido' : 'Explore more content'}
                        </h3>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5 line-clamp-1">
                            {language === 'es' 
                                ? 'Descubre más artículos sobre desarrollo, tecnología e IA.' 
                                : 'Discover more articles about development, technology and AI.'}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className="rounded-full text-dark-800 dark:text-dark-200 border border-gray-300/60 dark:border-white/20 shadow-sm hover:shadow-md flex justify-center items-center gap-x-2 py-2 px-5 md:py-3 text-sm md:text-base md:px-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 hover:scale-105 transition-all font-bold w-full sm:w-auto">
                        {language === 'es' ? 'Ver más blogs' : 'View more blogs'}
                        <ArticleIcon className="w-5 h-5 transition-transform" />
                    </span>
                </div>

            </div>
        </Link>
    )
}
