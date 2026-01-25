import React from 'react'

export default function ModalCarousel({ images = [], delay = 3000 }: { images: string[]; delay?: number }) {
  const [index, setIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    if (!images || images.length === 0) return
    const id = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % images.length)
        setIsTransitioning(false)
      }, 300)
    }, delay)
    return () => clearInterval(id)
  }, [images, delay])

  if (!images || images.length === 0) return null

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img 
          src={images[index]} 
          alt={`Slide ${index + 1}`} 
          className={`h-full w-full object-cover transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setIsTransitioning(true)
          setTimeout(() => {
            setIndex((i) => (i - 1 + images.length) % images.length)
            setIsTransitioning(false)
          }, 300)
        }}
        className="absolute top-1/2 -left-6 -translate-y-1/2 bg-background/80 backdrop-blur size-8 rounded-full"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => {
          setIsTransitioning(true)
          setTimeout(() => {
            setIndex((i) => (i + 1) % images.length)
            setIsTransitioning(false)
          }, 300)
        }}
        className="absolute top-1/2 -right-6 -translate-y-1/2 bg-background/80 backdrop-blur size-8 rounded-full"
        aria-label="Next"
      >
        ›
      </button>
      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => {
              if (i !== index) {
                setIsTransitioning(true)
                setTimeout(() => {
                  setIndex(i)
                  setIsTransitioning(false)
                }, 300)
              }
            }}
            className={`h-12 w-20 overflow-hidden rounded ${i === index ? 'ring-2 ring-accent' : ''}`}
          >
            <img src={src} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
