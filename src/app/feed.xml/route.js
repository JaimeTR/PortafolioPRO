import { getAllPostsMetadata } from '@/lib/mdx'

export async function GET() {
    // Generate feed for the Spanish (default) posts
    let posts = getAllPostsMetadata('es')
    posts = posts.filter(post => !post.is_hidden)
    const SITE_URL = 'https://jaimetr.dev'

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de Programación | Jaime Tarazona Rodriguez</title>
    <link>${SITE_URL}</link>
    <description>Aprende desarrollo web con JavaScript, React, Next.js, PHP, Laravel y más. Guías, tutoriales y trucos para desarrolladores.</description>
    <language>es</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
        .map((post) => {
            const postUrl = `${SITE_URL}/es/posts/${post.slug}`
            return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || post.excerpt}]]></description>
      ${post.tags ? (Array.isArray(post.tags) ? post.tags : post.tags.split(',')).map(tag => `<category><![CDATA[${tag.trim()}]]></category>`).join('') : ''}
    </item>`
        })
        .join('')}
  </channel>
</rss>`

    return new Response(feedXml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=86400, stale-while-revalidate',
        },
    })
}
