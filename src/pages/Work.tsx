import React, { useMemo } from "react"
import { useLocation } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import SEO from "@/components/seo"
import content from "@/lib/content.json"
import { ArrowRight } from "lucide-react"

const BASE_URL = "https://magichat.agency"

function WorkPage() {
  const { work } = content
  const location = useLocation()
  const canonicalPath = useMemo(() => `${location.pathname}${location.search}`, [location.pathname, location.search])

  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${content.site.title} Portfolio`,
        description: work.page.description,
        url: `${BASE_URL}${canonicalPath}`,
        hasPart: work.otherProjects.map((project) => ({
          "@type": "CreativeWork",
          name: project.title,
          url: `${BASE_URL}${canonicalPath}#project-${project.id}`,
          description: project.summary,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Portfolio",
            item: `${BASE_URL}${canonicalPath}`,
          },
        ],
      },
    ],
    [canonicalPath, work.otherProjects, work.page.description],
  )

  const seoKeywords = useMemo(() => {
    const serviceKeywords = work.otherProjects.flatMap((project) => project.services)
    return [
      "Magic Hat Portfolio",
      "Marketing Case Studies",
      "Brand Campaigns",
      ...serviceKeywords,
    ]
  }, [work.otherProjects])

  return (
    <>
      <SEO
        title="Portfolio"
        description={work.page.description}
        canonical={canonicalPath}
        image="/modern-dashboard-analytics-interface.jpg"
        keywords={seoKeywords}
        structuredData={structuredData}
      />
      <div className="space-y-0">
      <section className="bg-muted/30 px-4 pt-16 pb-14">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="flex flex-col gap-6 text-center md:text-left">
              <Badge variant="secondary" className="self-center md:self-start uppercase tracking-wide">
                {work.page.badge}
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
                {work.page.headline}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty md:max-w-3xl">
                {work.page.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {work.page.stats.map((stat) => (
                  <Badge key={stat} variant="outline" className="border-accent/40 text-sm text-muted-foreground">
                    {stat}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <a href={work.page.cta.href}>
                    {work.page.cta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="mb-12 text-center md:text-left">
              <Badge variant="secondary" className="mb-4">
                Featured Highlights
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
                Snapshot of recent wins
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {work.projects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 100}>
                <Card className="overflow-hidden border-border/60">
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-pretty">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="mb-12 text-center md:text-left">
              <Badge variant="secondary" className="mb-4">
                Extended Portfolio
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance">
                Other collaborations we are proud of
              </h2>
              <p className="mt-4 text-muted-foreground md:max-w-3xl">
                From hospitality to digital products, these engagements show how we tailor strategy, creative, and technology to the goals of each partner.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2">
            {work.otherProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 120}>
                <Card id={`project-${project.id}`} className="h-full border-border/60">
                  <div className="relative h-56 overflow-hidden rounded-t-xl">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="space-y-3">
                    <Badge variant="secondary" className="w-fit">
                      Case Study
                    </Badge>
                    <CardTitle className="text-2xl font-semibold text-foreground text-balance">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-pretty text-base leading-relaxed">
                      {project.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <Badge key={service} variant="outline" className="border-border/80 text-xs uppercase tracking-wide">
                        {service}
                      </Badge>
                    ))}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                    {project.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="bg-accent/20 text-accent">
                        {metric}
                      </Badge>
                    ))}
                  </CardFooter>
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

export default WorkPage
