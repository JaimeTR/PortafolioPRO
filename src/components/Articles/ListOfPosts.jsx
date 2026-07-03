import { ArticleCard } from '../ArticleCard'

export const ListOfPosts = async ({ posts, basePath = '/posts' }) => {
    return posts
        .sort((a, b) => {
            if (a.date < b.date) {
                return 1
            }
            if (a.date > b.date) {
                return -1
            }
            // a must be equal to b
            return 0
        })
        .map((post) => <ArticleCard key={post?.slug} article={post} basePath={basePath} />)
}
