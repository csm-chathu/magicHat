import React, { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import SEO from "@/components/seo"
import content from "@/lib/content.json"
import { ArrowRight, Award, Facebook, Home as HomeIcon, UserCircle } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-8 w-8" />,
  Award: <Award className="h-8 w-8" />,
  UserCircle: <UserCircle className="h-8 w-8" />,
  Home: <HomeIcon className="h-8 w-8" />,
}

const BASE_URL = "https://magichat.agency"

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroProgress, setHeroProgress] = useState(0)
  const canonicalPath = useMemo(() => `${location.pathname}${location.search}`, [location.pathname, location.search])
  const seoKeywords = useMemo(() => {
    const serviceKeywords = content.services.items.map((service) => service.title)
    return [
      "Magic Hat",
      "Brand Solutions",
      "Creative Agency Sri Lanka",
      "Digital Marketing",
      "Personal Branding Experts",
      ...serviceKeywords,
    ]
  }, [])

  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: content.site.title,
        url: BASE_URL,
        logo: `${BASE_URL}/magic-hat-logo.png`,
        description: content.site.description,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "hello@magichat.agency",
            areaServed: "Worldwide",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: content.site.title,
        url: BASE_URL,
        description: content.hero.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
    [],
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const state = location.state as { scrollTo?: string } | null
    if (!state?.scrollTo) {
      return
    }

    const selector = state.scrollTo

    const scrollToTarget = () => {
      const element = document.querySelector(selector)
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const frame = window.requestAnimationFrame(scrollToTarget)
    navigate(location.pathname, { replace: true })

    return () => window.cancelAnimationFrame(frame)
  }, [location, navigate])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let frame = 0

    const updateProgress = () => {
      const target = heroRef.current
      if (!target) {
        return
      }

      const height = target.offsetHeight || 1
      const offsetTop = target.getBoundingClientRect().top + window.scrollY
      const scrollY = window.scrollY + 80
      const raw = (scrollY - offsetTop) / height
      const clamped = Math.min(Math.max(raw, 0), 1)

      setHeroProgress((previous) => (Math.abs(previous - clamped) > 0.01 ? Number(clamped.toFixed(3)) : previous))
    }

    const schedule = () => {
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(() => {
        updateProgress()
        frame = 0
      })
    }

    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  const heroMotionStyle = useMemo<React.CSSProperties>(() => {
    const progress = Math.min(Math.max(heroProgress, 0), 1)
    const eased = Math.pow(progress, 0.85)
    const clip = eased * 55

    return {
      transform: `translateY(${eased * -48}px) scale(${1 - eased * 0.025})`,
      opacity: Math.max(1 - eased * 1.15, 0),
      clipPath: `inset(${clip}% 0 0 0)`,
      WebkitClipPath: `inset(${clip}% 0 0 0)`,
      willChange: "transform, opacity, clip-path",
    }
  }, [heroProgress])

  return (
    <>
      <SEO
        title="Magic Hat | Brand Solutions"
        appendSiteName={false}
        description={content.hero.description}
        canonical={canonicalPath}
        image="/magic-hat-logo.png"
        keywords={seoKeywords}
        structuredData={structuredData}
      />
      <div className="space-y-0">
      <section className="pt-16 pb-16 px-4">
        <div className="container mx-auto text-center">
          <ScrollReveal>
            <div ref={heroRef} className="max-w-4xl mx-auto" style={heroMotionStyle}>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
                {content.hero.headline}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
                {content.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/work")}>
                  Explore Our Work
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section id="team" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {content.team.badge}
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                {content.team.headline}
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.team.members.map((member, index) => (
              <ScrollReveal key={member.id} delay={index * 100}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                      {iconMap[member.icon]}
                    </div>
                    <CardTitle className="text-2xl">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto mb-4">
                      {member.role}
                    </Badge>
                    <CardDescription className="text-pretty">{member.bio}</CardDescription>
                    <div className="mt-4 flex gap-2 justify-center">
                      {member.links.map((link) => (
                        <Button key={link.label} variant="link" className="text-accent" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.label} →
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <Badge variant="secondary" className="mb-4">
                  {content.story.badge}
                </Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-6 text-balance">
                  {content.story.headline}
                </h2>
                <p className="text-muted-foreground mb-6 text-pretty">{content.story.intro}</p>
                <p className="text-muted-foreground mb-8 text-pretty">{content.story.body}</p>
                <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
                  <p className="font-semibold text-foreground mb-2">{content.story.vision.title}</p>
                  <p className="text-muted-foreground text-pretty">{content.story.vision.description}</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative">
                <img
                  src={content.story.image || "/placeholder.svg"}
                  alt="Magic Hat team collaboration"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {content.services.badge}
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                {content.services.headline}
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {content.services.items.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 100}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                      {iconMap[service.icon]}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-pretty">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={400}>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => navigate("/work")}>
                Learn More About Our Services
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="work" className="py-16 px-4">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {content.work.badge}
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                {content.work.headline}
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.work.projects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg h-48">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-pretty">{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <div className="mt-12 flex justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90" onClick={() => navigate("/work")}>
                View Full Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="case-studies" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                {content.caseStudies.badge}
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                {content.caseStudies.headline}
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.caseStudies.studies.map((study, index) => (
              <ScrollReveal key={study.id} delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={study.image || "/placeholder.svg"}
                      alt={study.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl mb-4">{study.title}</CardTitle>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">Challenge:</p>
                        <CardDescription className="text-pretty">{study.challenge}</CardDescription>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">Solution:</p>
                        <CardDescription className="text-pretty">{study.solution}</CardDescription>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">Result:</p>
                        <CardDescription className="text-pretty">{study.result}</CardDescription>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {study.metrics.map((metric) => (
                            <Badge key={metric} variant="secondary" className="bg-accent/20 text-accent">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default HomePage
