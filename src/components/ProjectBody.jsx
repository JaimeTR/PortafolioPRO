'use client'
import { useEffect } from 'react'
import Prism from 'prismjs'
import '@/helpers/prism.css'
import Image from 'next/image'
import { BASE_API_URL } from '@/config'
import { FaGithub } from 'react-icons/fa'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'

export const ProjectBody = ({ data }) => {
    const { language } = useLanguage()
    const t = useTranslation(language)
    const title = language === 'en' && data?.title_en ? data.title_en : data.title
    const category = language === 'en' && data?.category_en ? data.category_en : data.category
    const abstract = language === 'en' && data?.content?.abstract_en ? data.content.abstract_en : data?.content?.abstract
    const description = language === 'en' && data?.content?.description_en ? data.content.description_en : data?.content?.description
    const featuresIntro = language === 'en' && data?.content?.features?.intro_en ? data.content.features.intro_en : data?.content?.features?.intro
    const featuresList = language === 'en' && data?.content?.features?.list_en ? data.content.features.list_en : data?.content?.features?.list
    const {
        content: { images },
    } = data
    useEffect(() => {
        Prism.highlightAll()
    }, [])

    return (
        <section className="container mx-auto px-2 lg:px-22 xl:px-28 2xl:max-w-[1200px] mt-10">
            <header className="mt-24 lg:mt-28 mb-8 lg:mb-12 max-w-[800px] mx-auto lg:flex lg:items-center lg:gap-6">
                <Image
                    src={data?.content?.images?.cover || '/images/default.webp'}
                    alt={title}
                    width={800}
                    height={450}
                    className="rounded-lg h-auto w-full lg:w-1/3 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div>
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 my-4 lg:my-0 lg:mb-4">
                        {title}
                    </h1>
                    <ul className="list-none md:flex md:gap-8 mb-4">
                        <li className="flex gap-1 items-center text-dark-700 dark:text-dark-200 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                />
                            </svg>
                            {data.date}
                        </li>
                        <li className="flex gap-1 items-center text-dark-700 dark:text-dark-200 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                            {category}
                        </li>
                        <li className="flex gap-1  text-dark-700 dark:text-dark-200 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                                />
                            </svg>

                            <p className="flex gap-1 flex-wrap">
                                {data?.content?.technologies.map((item, idx) => (
                                    <span key={idx}>{item.name + ','}</span>
                                ))}
                            </p>
                        </li>
                    </ul>
                    <div className="flex gap-2">
                        {data?.link && (
                            <a
                                href={data?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all duration-200"
                            >
                                {t('irAlSitio')}{' '}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                </svg>
                            </a>
                        )}
                        {data?.repo && (
                            <a
                                href={data?.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all duration-200"
                            >
                                {t('repo')}{' '}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <main id="article-body" className="max-w-[800px] mx-auto">
                <article className="">
                    <h2>{t('resumen')}</h2>
                    <p>{abstract}</p>
                </article>
                {data?.content?.images?.screenshot && (
                    <Image
                        src={data.content.images.screenshot}
                        alt={title}
                        width={1200}
                        height={675}
                        className="rounded-xl overflow-hidden my-6 w-full shadow-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                    />
                )}

                <article className="">
                    <h2>{t('descripcionProyecto')}</h2>
                    <p className="whitespace-pre-line">{description}</p>
                </article>

                <figure className="table">
                    <h2>{t('tecnologiasUsadas')}</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>{t('tecnologia')}</td>
                                <td>{t('uso')}</td>
                            </tr>
                            {data?.content?.technologies.map((item) => (
                                <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{language === 'en' && item?.use_en ? item.use_en : item.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </figure>
                <section className="mb-6">
                    <h2>{t('caracteristicasPrincipales')}</h2>
                    <p>{featuresIntro}</p>
                    <ul>
                        {featuresList?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </section>

                <h2>{t('galeria')}</h2>
                <section className="grid md:grid-cols-2 md:grid-rows-2 gap-4">
                    {Object.values(images).map((image, idx) => (
                        <Image
                            key={idx}
                            src={image}
                            alt={`${title} - image ${idx + 1}`}
                            width={800}
                            height={450}
                            className="w-full rounded-lg object-cover shadow-md my-0"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                        />
                    ))}
                </section>
            </main>
        </section>
    )
}
