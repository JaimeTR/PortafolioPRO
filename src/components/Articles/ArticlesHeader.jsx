'use client'
import Link from 'next/link'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useEffect, useState } from 'react'

export default function ArticlesHeader() {
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <h2 className=" text-3xl font-bold text-dark-700 dark:text-primary-50">
        {language === 'es' ? 'Artículos' : 'Articles'}
      </h2>
    </>
  )
}
