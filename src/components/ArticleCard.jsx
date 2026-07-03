import { LocalDate } from '@/lib/local-date'
import Image from 'next/image'
import Link from 'next/link'
import { ShowDate } from './ShowDate'

export const ArticleCard = ({ article, basePath = '/posts' }) => {
    // Seleccionar título y descripción según el archivo disponible
    // Si basePath es /en/posts, priorizar .en.mdx
    const isEnglish = basePath === '/en/posts'
    const tagsList = Array.isArray(article?.tags)
        ? article.tags
        : typeof article?.tags === 'string'
        ? article.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    const tagStyle = (tag) => {
        const t = String(tag).toLowerCase()
        if (/(javascript|js)/.test(t)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        if (/react/.test(t)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        if (/next/.test(t)) return 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        if (/php|laravel/.test(t)) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
        if (/seo/.test(t)) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        if (/desarrollo\s*web|web/.test(t)) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
        return 'bg-dark-200 text-dark-700 dark:bg-dark-700 dark:text-dark-200'
    }
    
    return (
        <Link href={`${basePath}/${article.slug}`} className="w-full block group">
            <article
                key={article.slug}
                className={`relative mt-4 flex flex-col md:flex-row gap-4 md:gap-x-6 px-4 py-5 md:py-6 rounded-2xl shadow-sm border border-transparent 
                transition-all duration-300 ease-out items-center
                hover:shadow-xl hover:-translate-y-1 hover:border-primary-500/30
                bg-white/80 dark:bg-dark-800/80 backdrop-blur-md 
                ${article.is_featured ? 'ring-1 ring-primary-500/50 shadow-primary-500/10' : ''}`}
            >
                <picture className="w-full md:w-1/4 md:min-w-[180px] h-[180px] md:h-[130px] rounded-xl overflow-hidden shadow-md shrink-0">
                    <img 
                        src={article?.cover} 
                        alt={article?.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy" 
                    />
                </picture>
                <section className="w-full md:w-3/4 flex flex-col justify-between">
                    <header>
                        <div className="flex items-center gap-3 mb-1">
                            <ShowDate date={article?.date} className="text-sm font-medium text-dark-500 dark:text-dark-300" />
                            {article.is_featured && (
                                <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ring-1 ring-inset ring-primary-700/10">
                                    ⭐ Destacado
                                </span>
                            )}
                        </div>
                        <h1 className="text-dark-900 dark:text-gray-100 font-bold text-xl md:text-2xl leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {article?.title}
                        </h1>
                    </header>
                    <div className="mt-2">
                        <p className="text-dark-600 dark:text-dark-300 line-clamp-2 text-sm md:text-base leading-relaxed">
                            {article?.description}
                        </p>
                        <ul className="flex flex-wrap gap-2 mt-4">
                            {tagsList.map((tag) => (
                                <li key={tag} className={`rounded-md font-medium text-[11px] px-2.5 py-1 uppercase tracking-wider ${tagStyle(tag)}`}>
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <span className="hidden md:flex absolute top-4 right-4 rounded-full bg-dark-100 dark:bg-dark-900/50 text-[10px] font-semibold px-2 py-1 text-dark-500 dark:text-dark-400 uppercase tracking-widest border border-dark-200 dark:border-dark-700">
                    {article?.author || 'JaimeTR'}
                </span>
            </article>
        </Link>
    )
}
