'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { Banner } from '@/components/Banner'
import { ListOfPosts } from '@/components/Articles/ListOfPosts'
import { Suspense } from 'react'

export default function PostsPageWrapper() {
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    // Redirigir a /en/posts si el idioma es inglés
    if (language === 'en') {
      router.push('/en/posts')
    }
  }, [language, router])

  // Si está en inglés, no renderizar nada (redirección en progreso)
  if (language === 'en') {
    return null
  }

  return (
    <>
      <Banner title={'Blog de programación'} image={'/images/bloggin.png'} />
      <section className="pt-24 container mx-auto px-2 lg:w-[740px] ">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-dark-600 dark:text-dark-300">Cargando artículos...</p>
          </div>
        }>
          <ListOfPosts posts={[]} basePath="/posts" />
        </Suspense>
      </section>
    </>
  )
}
