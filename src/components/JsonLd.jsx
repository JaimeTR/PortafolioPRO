import siteConfig from '@/config/site.config'

export default function JsonLd() {
    const identity = siteConfig.identity
    const profession = siteConfig.profession
    const social = siteConfig.social

    const sameAs = []
    if (social.linkedin?.enabled) sameAs.push(social.linkedin.url)
    if (social.github?.enabled) sameAs.push(social.github.url)
    if (social.facebook?.enabled) sameAs.push(social.facebook.url)
    if (social.instagram?.enabled) sameAs.push(social.instagram.url)

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: identity.name,
        url: identity.url,
        image: `${identity.url}/images/og.png`,
        jobTitle: profession.es.title,
        description: profession.es.description,
        sameAs: sameAs.filter(Boolean),
        knowsAbout: siteConfig.seo.keywords,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
