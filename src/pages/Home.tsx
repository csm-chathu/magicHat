import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ScrollReveal } from "@/components/scroll-reveal"
import SEO from "@/components/seo"
import content from "@/lib/content.json"
import projects from "@/lib/projects.json"
import { ArrowRight, Award, Facebook, Home as HomeIcon, Mail, MessageCircle, Star, UserCircle, Linkedin } from "lucide-react"
import ModalCarousel from "../components/ModalCarousel"

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
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
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

  const whatsappConfig = content.contact?.whatsapp
  const whatsappHref = whatsappConfig?.link
    ? `https://wa.me/${whatsappConfig.link}${whatsappConfig.message ? `?text=${encodeURIComponent(whatsappConfig.message)}` : ""}`
    : null

  const handleProjectSelect = (project: (typeof content.work.projects)[number]) => {
    setSelectedProject(project)
  }

  const handleProjectKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, project: (typeof content.work.projects)[number]) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleProjectSelect(project)
    }
  }

  const handleScrollToContact = useCallback(() => {
    if (typeof document === "undefined") {
      return
    }
    const target = document.getElementById("contact")
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

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
                      <div className="mx-auto mb-4">
                        <Avatar className="mx-auto w-24 h-24">
                          <AvatarImage
                            src={
                              member.id === 1
                                ? "/assets/Artboard 1-100.jpg"
                                : "/assets/Artboard 2-100.jpg"
                            }
                            alt={member.name}
                          />
                          <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className="text-2xl">{member.name}</CardTitle>
                      <Badge variant="secondary" className="mx-auto mb-4">
                        {member.role}
                      </Badge>
                      <CardDescription className="text-pretty">{member.bio}</CardDescription>
                      <div className="mt-4 flex gap-2 justify-center">
                        {member.links.map((link) => {
                          const isLinkedIn = /linkedin\.com/i.test(link.url)
                          const isBehance = /behance\.net/i.test(link.url)
                          const icon = isLinkedIn ? (
                            <Linkedin className="h-5 w-5" />
                          ) : isBehance ? (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M3 10.5c0-1.1.9-1.9 2-1.9h2v3.8H5c-1.1 0-2-.9-2-1.9zM3 6.5C3 5.1 4.1 4 5.5 4H8v12H5.5C4.1 16 3 14.9 3 13.5V6.5zM10 4h3.5c1.9 0 3.5 1.6 3.5 3.5 0 1.2-.6 2.3-1.6 2.9V11c1.2.4 2.1 1.6 2.1 3.1 0 1.9-1.6 3.5-3.5 3.5H10V4zm3.5 5.5H13c-.8 0-1.5-.7-1.5-1.5S12.2 6.5 13 6.5h.5V9.5z" />
                            </svg>
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )

                          return (
                            <Button key={link.url} variant="ghost" className="p-2 rounded-full" asChild>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                                <span className="sr-only">{link.label}</span>
                                <span className="inline-flex items-center justify-center text-accent">{icon}</span>
                              </a>
                            </Button>
                          )
                        })}
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
                  <h2 className="font-serif text-[60px] font-thin text-[#96b51a] mb-6 text-balance">
                    {content.story.headline}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-pretty text-[20px] font-light">{content.story.intro}</p>
                  <p className="text-muted-foreground mb-8 text-pretty text-[20px] font-ligh">{content.story.body}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="relative rounded-lg inline-block">
                  <div className="absolute -inset-3 rounded-lg pointer-events-none">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-background/30 via-transparent to-background/10 blur-sm opacity-80" />
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-background shadow-lg">
                    <img
                      src={content.story.image || "/placeholder.svg"}
                      alt="Magic Hat team collaboration"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="services" className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <ScrollReveal>
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-3 text-[15px] font-light">
                  {content.services.badge}
                </Badge>
                <h2 className="font-serif text-[50px] font-extralight text-foreground mb-2 text-balance leading-tight">
                  {content.services.headline}
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-0">
              {content.services.items.map((service, index) => (
                <ScrollReveal key={service.id} delay={index * 100}>
                  <Card className="group relative min-h-[14rem] md:min-h-[18rem] h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden rounded-none border border-black/20">
                    {service.image ? (
                      <div className="absolute inset-0">
                        <img src={service.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-[#96b51a]" />
                      </div>
                    ) : null}
                    <CardHeader className="relative z-10 flex-1 flex flex-col justify-between items-start px-6 py-8 text-[#96b51a] group-hover:text-white transition-colors">
                      <CardTitle className="text-[40px] font-extralight leading-tight group-hover:text-white">{service.title}</CardTitle>
                      <CardDescription className="text-[#96b51a]/90 group-hover:text-white/90 text-[15px] font-light">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
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
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 100}>
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${project.title}`}
                    onClick={() => handleProjectSelect(project)}
                    onKeyDown={(event) => handleProjectKeyDown(event, project)}
                  >
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
          </div>
        </section>

        {content.partners?.items?.length ? (
          <section id="partners" className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  {content.partners.badge ? (
                    <Badge variant="secondary" className="mb-4">
                      {content.partners.badge}
                    </Badge>
                  ) : null}
                  <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                    {content.partners.headline}
                  </h2>
                </div>
              </ScrollReveal>
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent" aria-hidden="true" />
                <div className="marquee" aria-label="Partner logos carousel">
                  {[...content.partners.items, ...content.partners.items].map((partner, index) => (
                    <div key={`${partner.id}-${index}`} className="flex items-center justify-center min-w-32">
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="h-12 w-auto opacity-80 transition-opacity hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {content.reviews?.items?.length ? (
          <section id="reviews" className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  {content.reviews.badge ? (
                    <Badge variant="secondary" className="mb-4">
                      {content.reviews.badge}
                    </Badge>
                  ) : null}
                  <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                    {content.reviews.headline}
                  </h2>
                </div>
              </ScrollReveal>
              <div className="grid gap-6 md:grid-cols-3">
                {content.reviews.items.map((review, index) => (
                  <ScrollReveal key={review.id} delay={index * 100}>
                    <Card className="h-full border border-border/60 bg-background/80">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.name} />
                            <AvatarFallback>{review.name?.slice(0, 2)?.toUpperCase() || "MH"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground leading-tight">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-accent mb-3">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={
                                starIndex < (review.rating || 0)
                                  ? "h-4 w-4 text-accent"
                                  : "h-4 w-4 text-muted-foreground"
                              }
                              fill={starIndex < (review.rating || 0) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <CardDescription className="text-base text-pretty text-foreground">
                          “{review.quote}”
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {content.contact ? (
          <section id="contact" className="py-16 px-4">
            <div className="container mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <Badge variant="secondary" className="mb-4">
                    Contact Us
                  </Badge>
                  <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
                    Let’s collaborate on your next big move
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                    Reach out via email or WhatsApp and the Magic Hat team will respond within one business day.
                  </p>
                </div>
              </ScrollReveal>
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {content.contact.email ? (
                  <ScrollReveal>
                    <Card className="border border-border/60 bg-background/80">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">Email the team</CardTitle>
                            <CardDescription className="text-pretty">Share a few details and we’ll take it from there.</CardDescription>
                          </div>
                          <Mail className="h-6 w-6 text-accent" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <a href={`mailto:${content.contact.email}`}>Contact via Email</a>
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ) : null}
                {whatsappHref ? (
                  <ScrollReveal delay={150}>
                    <Card className="border border-border/60 bg-background/80">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">Chat on WhatsApp</CardTitle>
                            <CardDescription className="text-pretty">
                              Send us a quick message and we’ll reply as soon as possible.
                            </CardDescription>
                          </div>
                          <MessageCircle className="h-6 w-6 text-accent" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                            Open WhatsApp Chat
                          </a>
                        </Button>
                        {content.contact.whatsapp?.number ? (
                          <p className="mt-2 text-xs text-muted-foreground text-center">
                            {content.contact.whatsapp.number}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProject(null) }}>
        <DialogContent className="!w-[70vw] !max-w-[70vw] !max-h-[95vh] overflow-auto">
          {selectedProject ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                {selectedProject.description ? (
                  <DialogDescription>{selectedProject.description}</DialogDescription>
                ) : null}
              </DialogHeader>
              <div className="space-y-6">
                {selectedProject.gallery?.length ? (
                  <div className="relative">
                    <ModalCarousel images={selectedProject.gallery} delay={3000} />
                  </div>
                ) : null}
                {selectedProject.details ? (
                  <div className="text-muted-foreground text-pretty whitespace-pre-line">
                    {selectedProject.details}
                  </div>
                ) : null}
                {selectedProject.services?.length ? (
                  <div>
                    <p className="font-semibold text-foreground mb-2">Services Included</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.services.map((service) => (
                        <Badge key={service} variant="secondary" className="bg-accent/15 text-accent">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                {selectedProject.metrics?.length ? (
                  <div>
                    <Badge variant="secondary" className="mb-3">Key Results</Badge>
                    <ul className="grid gap-2 md:grid-cols-2 text-sm text-foreground">
                      {selectedProject.metrics.map((metric) => (
                        <li key={metric} className="rounded-md border border-border/60 bg-muted/40 px-3 py-2">
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {whatsappHref ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 animate-whatsapp-bounce">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-[#0F766E] via-[#128C7E] to-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(18,140,126,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(18,140,126,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
            aria-label={whatsappConfig?.label ?? "Chat on WhatsApp"}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{whatsappConfig?.label ?? "Chat on WhatsApp"}</span>
            {whatsappConfig?.number ? <span className="sr-only">{whatsappConfig.number}</span> : null}
          </a>
        </div>
      ) : null}
    </>
  )
}

export default HomePage
