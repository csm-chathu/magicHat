import React, { useMemo } from "react"
import { Helmet } from "react-helmet-async"

import content from "@/lib/content.json"

type JsonLd = Record<string, unknown>

type SEOProps = {
  title?: string
  description?: string
  canonical?: string
  image?: string
  type?: "website" | "article" | "profile" | "product"
  keywords?: string[]
  robots?: string
  appendSiteName?: boolean
  structuredData?: JsonLd | JsonLd[]
}

const DEFAULT_ORIGIN = "https://magichat.agency"
const DEFAULT_IMAGE = "/magic-hat-logo.png"

export function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  keywords,
  robots = "index,follow",
  appendSiteName = true,
  structuredData,
}: SEOProps) {
  const resolved = useMemo(() => {
    const siteTitle = content.site.title
    const siteDescription = content.site.description
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : DEFAULT_ORIGIN

    const absoluteCanonical = (() => {
      if (!canonical) {
        if (typeof window !== "undefined") {
          const path = `${window.location.pathname}${window.location.search}`
          return `${origin}${path}`
        }
        return origin
      }

      if (canonical.startsWith("http")) {
        return canonical
      }

      const normalized = canonical.startsWith("/") ? canonical : `/${canonical}`
      return `${origin}${normalized}`
    })()

    const absoluteImage = (() => {
      const selected = image ?? DEFAULT_IMAGE
      if (selected.startsWith("http")) {
        return selected
      }
      const normalized = selected.startsWith("/") ? selected : `/${selected}`
      return `${origin}${normalized}`
    })()

    const fullTitle = (() => {
      if (!title) {
        return siteTitle
      }
      return appendSiteName && !title.includes(siteTitle) ? `${title} | ${siteTitle}` : title
    })()

    const metaDescription = description ?? siteDescription
    const metaKeywords = keywords?.filter(Boolean).join(", ")

    const jsonLdPayload = (() => {
      if (!structuredData) {
        return undefined
      }
      const payload = Array.isArray(structuredData) ? structuredData : [structuredData]
      return payload.length > 0 ? JSON.stringify(payload) : undefined
    })()

    return {
      siteTitle,
      absoluteCanonical,
      absoluteImage,
      fullTitle,
      metaDescription,
      metaKeywords,
      jsonLdPayload,
    }
  }, [appendSiteName, canonical, description, image, keywords, structuredData, title])

  return (
    <Helmet>
      <title>{resolved.fullTitle}</title>
      <meta name="description" content={resolved.metaDescription} />
      <meta property="og:title" content={resolved.fullTitle} />
      <meta property="og:description" content={resolved.metaDescription} />
      <meta property="og:url" content={resolved.absoluteCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={resolved.siteTitle} />
      <meta property="og:image" content={resolved.absoluteImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolved.fullTitle} />
      <meta name="twitter:description" content={resolved.metaDescription} />
      <meta name="twitter:image" content={resolved.absoluteImage} />
      <meta name="robots" content={robots} />
      {resolved.metaKeywords ? <meta name="keywords" content={resolved.metaKeywords} /> : null}
      <link rel="canonical" href={resolved.absoluteCanonical} />
      {resolved.jsonLdPayload ? <script type="application/ld+json">{resolved.jsonLdPayload}</script> : null}
    </Helmet>
  )
}

export default SEO
