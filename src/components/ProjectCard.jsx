'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'

export const ProjectCard = ({ project, basePath = '/projects' }) => {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const title = language === 'en' && project?.title_en ? project.title_en : project.title
    const category = language === 'en' && project?.category_en ? project.category_en : project.category
    const abstract =
        language === 'en'
            ? project?.content?.abstract_en || project?.content?.description_en
            : project?.content?.abstract || project?.content?.description
    return (
        <Link
            href={`${basePath}/${project.slug}`}
            className="group max-w-sm lg:max-w-full w-full min-h-full bg-dark-50 rounded-xl shadow-lg hover:shadow-2xl dark:bg-dark-900 dark:border dark:border-dark-800 hover:scale-[1.02] transition-all duration-300"
        >
            <div className="relative h-56 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5">
                <span className="absolute top-3 right-3 backdrop-blur-md bg-dark-600/70 dark:bg-dark-800/80 py-1.5 px-3 rounded-lg z-10 text-sm font-semibold text-dark-50 shadow-lg">
                    {category}
                </span>
                <Image
                    className="group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 object-cover h-full w-full"
                    src={project?.content?.images?.mockup}
                    alt={title}
                    width={600}
                    height={400}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                        {title}
                    </h5>
                </div>
                
                <p className="mb-4 font-normal text-dark-700 dark:text-dark-300 line-clamp-3 text-sm leading-relaxed">
                    {abstract}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project?.content?.technologies.slice(0, 4).map((item, idx) => (
                        <span
                            key={idx}
                            className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/50 px-3 py-1 font-mono text-xs text-primary-700 dark:text-primary-300"
                        >
                            {item.name}
                        </span>
                    ))}
                    {project?.content?.technologies.length > 4 && (
                        <span className="text-xs text-dark-500 dark:text-dark-400 px-2 py-1">
                            +{project?.content?.technologies.length - 4} {t('mas')}
                        </span>
                    )}
                </div>

                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                    {t('verProyecto')}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
