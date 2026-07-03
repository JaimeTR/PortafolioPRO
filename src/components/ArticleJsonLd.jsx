export function ArticleJsonLd({ frontmatter, slug }) {
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [])
    
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: frontmatter.title,
        description: frontmatter.description,
        image: frontmatter.cover,
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
        author: {
            '@type': 'Person',
            name: 'Jaime Tarazona Rodriguez',
            url: 'https://jaimetr.dev',
            sameAs: [
                'https://github.com/jaimetrdev',
                'https://linkedin.com/in/jaimetrdev',
            ],
        },
        publisher: {
            '@type': 'Organization',
            name: 'Jaime Tarazona Dev',
            logo: {
                '@type': 'ImageObject',
                url: 'https://jaimetr.dev/images/logo.svg',
                width: 200,
                height: 60,
            },
        },
        keywords: tags.join(', ') || 'programación',
        url: `https://jaimetr.dev/posts/${slug}`,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
