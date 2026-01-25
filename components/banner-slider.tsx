import React, { useEffect, useRef, useState } from "react"

const filenames = [
  "Artboard 1-100.jpg",
  "Artboard 2-100.jpg",
  "Artboard 3-100.jpg",
  "Artboard 4-100.jpg",
]

export default function BannerSlider() {
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef<number | null>(null)
  const delay = 5000

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % filenames.length), delay)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [index])

  const goPrev = () => setIndex((i) => (i - 1 + filenames.length) % filenames.length)
  const goNext = () => setIndex((i) => (i + 1) % filenames.length)

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-64 md:h-96">
        {filenames.map((name, i) => (
          <img
            key={name}
            src={encodeURI(`/assets/covers/${name}`)}
            alt={`slide-${i}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
      </div>

      {/* Black overlay over slides */}
      <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />

      {/* Top transparent overlay with headline, description and CTA */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-20 flex justify-center px-4">
        <div className="max-w-4xl text-center text-white drop-shadow-lg pointer-events-auto">
          <h1 className="mb-2 text-3xl md:text-[60px] font-extralight leading-tight">Transform Your Brand with Magic Hat</h1>
          <p className="mb-4 text-[20px] font-light">
            At Magic Hat, we pull extraordinary results out of thin air. Our expertise in Social Media Strategic
            Marketing, Brand Solutions, Personal Branding, and Booking.com/Airbnb Account Management empowers
            businesses and individuals to stand out in a crowded world.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:hello@magichat.agency"
              className="inline-flex items-center rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm transition-colors duration-200 hover:bg-[#96b51a] hover:text-white"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={goPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/50 z-30"
      >
        ‹
      </button>

      <button
        onClick={goNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/50 z-30"
      >
        ›
      </button>

      {/* <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2 z-30">
        {filenames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-8 rounded-full transition-opacity ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div> */}
    </div>
  )
}
