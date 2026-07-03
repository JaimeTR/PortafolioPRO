import { getAllPostsMetadata } from '@/lib/mdx'
import { PROJECTS } from '@/helpers/projects'
import siteConfig from '@/config/site.config'

export default function sitemap() {
    const baseUrl = siteConfig.identity.url

    const locales = ['es', 'en']
    const sitemapEntries = []

    locales.forEach((locale) => {
        // Static pages
        const routes = ['', '/posts', '/projects'].map((route) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: route === '' ? 'weekly' : 'monthly',
            priority: route === '' ? 1.0 : 0.9,
            alternates: {
                languages: {
                    es: `${baseUrl}/es${route}`,
                    en: `${baseUrl}/en${route}`,
                },
            },
        }))
        sitemapEntries.push(...routes)

        // Get all posts
        let posts = getAllPostsMetadata()
        posts = posts.filter(post => !post.is_hidden)

        const postUrls = posts.map((post) => ({
            url: `${baseUrl}/${locale}/posts/${post.slug}`,
            lastModified: post.date || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    es: `${baseUrl}/es/posts/${post.slug}`,
                    en: `${baseUrl}/en/posts/${post.slug}`,
                },
            },
        }))
        sitemapEntries.push(...postUrls)

        // Get all projects
        const projectUrls = PROJECTS.map((project) => ({
            url: `${baseUrl}/${locale}/projects/${project.slug}`,
            lastModified: project.date || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    es: `${baseUrl}/es/projects/${project.slug}`,
                    en: `${baseUrl}/en/projects/${project.slug}`,
                },
            },
        }))
        sitemapEntries.push(...projectUrls)
    })

    return sitemapEntries
}
