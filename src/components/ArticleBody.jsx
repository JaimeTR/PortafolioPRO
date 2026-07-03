'use client'
import Markdown from 'markdown-to-jsx'
import { useEffect } from 'react'
import Prism from 'prismjs'

import Image from 'next/image'
import { LocalDate } from '@/lib/local-date'
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js'

export const ArticleBody = ({ content, frontmatter }) => {
    useEffect(() => {
        hljs.highlightAll()
    }, [])
    
    const timeReading = Math.ceil(content.split(' ').length / 200)
    const tagsList = Array.isArray(frontmatter?.tags) 
        ? frontmatter.tags 
        : typeof frontmatter?.tags === 'string' 
            ? frontmatter.tags.split(',') 
            : []

    return (
        <section className="container mx-auto px-4 lg:px-8 2xl:max-w-[1200px] mt-10">
            <header className="mt-24 lg:mt-28 mb-12 lg:mb-16 max-w-[900px] mx-auto flex flex-col gap-8">
                <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-dark-200/50 dark:ring-dark-700/50 aspect-[21/9]">
                    <Image
                        src={frontmatter?.cover}
                        alt={frontmatter?.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <section className="px-2 lg:px-0">
                    <h1 className="text-dark-900 dark:text-gray-100 font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-6">
                        {frontmatter?.title}
                    </h1>
                    <p className="text-dark-600 dark:text-dark-300 text-lg md:text-xl leading-relaxed mb-8 border-l-4 border-primary-500 pl-4">
                        {frontmatter?.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-y-4 gap-x-6 items-center border-t border-b border-dark-200 dark:border-dark-800 py-4">
                        <div className="flex gap-2 flex-wrap items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            </svg>
                            {tagsList.map(tag => (
                                <span key={tag} className="text-sm font-medium px-2.5 py-0.5 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-md">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-dark-500 dark:text-dark-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {new LocalDate().relativeTime(frontmatter?.date)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-dark-500 dark:text-dark-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Lectura {timeReading} min
                        </div>
                    </div>
                </section>
            </header>
            <main id="article-body" className="max-w-[800px] mx-auto lg:text-lg">
                <Markdown>{content}</Markdown>
            </main>
        </section>
    )
}
