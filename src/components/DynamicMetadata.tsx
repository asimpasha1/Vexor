'use client'

import { useSettings } from '@/hooks/useSettings'
import { useEffect } from 'react'

interface DynamicMetadataProps {
  title?: string
  description?: string
}

export default function DynamicMetadata({ title, description }: DynamicMetadataProps) {
  const { siteName, siteDescription, loading } = useSettings()

  useEffect(() => {
    if (!loading) {
      // تحديث عنوان الصفحة
      document.title = title || `${siteName} - Premium Digital Products`
      
      // تحديث meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description || siteDescription)
      }

      // تحديث Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', title || siteName)
      }

      // تحديث Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', description || siteDescription)
      }
    }
  }, [siteName, siteDescription, loading, title, description])

  return null // هذا component لا يرندر شيئاً
}