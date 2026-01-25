import React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'

export default function AutoplayController({ api, delay = 5000 }: { api: CarouselApi; delay?: number }) {
  React.useEffect(() => {
    if (!api) return
    let mounted = true
    const tick = () => {
      if (!mounted) return
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }
    const id = setInterval(tick, delay)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [api, delay])

  return null
}
