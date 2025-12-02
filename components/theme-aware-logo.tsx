"use client"

import { useEffect, useState } from "react"

import { useTheme } from "@/components/theme-provider"

interface ThemeAwareLogoProps {
  alt: string
  height?: number
  className?: string
}

export function ThemeAwareLogo({ alt, height = 48, className = "" }: ThemeAwareLogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const logoSrc = theme === "dark" ? "/magic-hat-logo-02.png" : "/magic-hat-logo-01.png"

  return (
    <img
      src={logoSrc || "/placeholder.svg"}
      alt={alt}
      height={height}
      className={`object-contain ${className}`.trim()}
      style={{ height, width: "auto" }}
    />
  )
}
