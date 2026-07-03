export function ProjectJsonLd({ project, slug }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        url: `https://jaimetr.dev/projects/${slug}`,
        image: project.cover || 'https://jaimetr.dev/og.png',
        applicationCategory: 'WebApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        creator: {
            '@type': 'Person',
            name: 'Jaime Tarazona Rodriguez',
            url: 'https://jaimetr.dev',
        },
        keywords: project.stack?.join(', ') || 'web development, full-stack',
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
