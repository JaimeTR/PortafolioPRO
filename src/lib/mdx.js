import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

// List all files in posts directory
export const getPostsFiles = () => fs.readdirSync(path.join(root, 'src/posts'))

// Get slugs (without extension) for a language. For 'en', we map files ending in .en.mdx to base slug.
export const getPosts = (lang = 'es') => {
    const files = getPostsFiles()
    if (lang === 'en') {
        // Use English files if present; map slug.en.mdx -> slug
        const enFiles = files.filter((f) => f.endsWith('.en.mdx'))
        // Fallback: if no en files exist, use ES files to ensure routes build
        if (enFiles.length === 0) {
            return files.filter((f) => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))
        }
        return enFiles.map((f) => f.replace('.en.mdx', '.mdx'))
    }
    // Spanish default: ignore .en.mdx
    return files.filter((f) => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))
}

// Read a post by slug in requested language; fallback to Spanish if EN not found
export const getPostBySlug = async (slug, lang = 'es') => {
    const basePath = path.join(root, 'src/posts')
    const enPath = path.join(basePath, `${slug}.en.mdx`)
    const esPath = path.join(basePath, `${slug}.mdx`)
    let mdxSource = ''
    if (lang === 'en' && fs.existsSync(enPath)) {
        mdxSource = fs.readFileSync(enPath, 'utf-8')
    } else {
        mdxSource = fs.readFileSync(esPath, 'utf-8')
    }
    const { data, content } = matter(mdxSource)
    return {
        content,
        frontmatter: {
            slug,
            ...data,
        },
    }
}

// Get metadata list for language; prefer EN file when available, else ES
export const getAllPostsMetadata = (lang = 'es') => {
    const files = getPostsFiles()
    // Build a set keyed by base slug to choose language-specific file
    const baseMap = new Map()
    files.forEach((file) => {
        if (file.endsWith('.en.mdx')) {
            const base = file.replace('.en.mdx', '')
            baseMap.set(base, { file, lang: 'en' })
        } else if (file.endsWith('.mdx')) {
            const base = file.replace('.mdx', '')
            // Only set ES if EN not already set for this base
            if (!baseMap.has(base)) baseMap.set(base, { file, lang: 'es' })
        }
    })
    const entries = Array.from(baseMap.entries())

    return entries.reduce((allPosts, [base, info]) => {
        // Always read the requested language file if it exists
        let chosenFile
        let pathToRead

        if (lang === 'en') {
            chosenFile = `${base}.en.mdx`
            pathToRead = path.join(root, 'src/posts', chosenFile)
            // If EN version doesn't exist, fallback to ES
            if (!fs.existsSync(pathToRead)) {
                pathToRead = path.join(root, 'src/posts', `${base}.mdx`)
            }
        } else {
            // For Spanish, always use .mdx (skip .en.mdx files)
            chosenFile = `${base}.mdx`
            pathToRead = path.join(root, 'src/posts', chosenFile)
        }

        const mdxSource = fs.readFileSync(pathToRead, 'utf-8')
        const { data } = matter(mdxSource)
        return [{ ...data, slug: base }, ...allPosts]
    }, [])
}
