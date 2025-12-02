import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, Facebook, UserCircle, Home, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeAwareLogo } from "@/components/theme-aware-logo"
import { ScrollReveal } from "@/components/scroll-reveal"
import content from "@/lib/content.json"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const iconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-8 w-8" />,
  Award: <Award className="h-8 w-8" />,
  UserCircle: <UserCircle className="h-8 w-8" />,
  Home: <Home className="h-8 w-8" />,
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThemeAwareLogo alt={content.site.title} height={70} />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {content.navigation.links.map((link) => (
                <a key={link.href} href={link.href} className="text-muted-foreground hover:text-accent transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <Button variant="outline" className="hidden md:inline-flex bg-transparent">
                Get Started
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-0 gap-0">
                  <div className="px-4 pt-6 pb-4">
                    <ThemeAwareLogo alt={content.site.title} height={36} />
                  </div>
                  <nav className="border-t border-border px-4 py-6 flex flex-col gap-3">
                    {content.navigation.links.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <a
                          href={link.href}
                          className="text-foreground text-lg font-medium transition-colors hover:text-accent"
                        >
                          {link.label}
                        </a>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="px-4 pb-6 mt-auto">
                    <SheetClose asChild>
                      <Button className="w-full bg-accent hover:bg-accent/90">Get Started</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
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
                <Button variant="outline" size="lg">
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
              <Button variant="outline" size="lg">
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

      <ScrollReveal>
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="font-serif font-bold text-2xl text-foreground mb-4">{content.site.title}</div>
                <p className="text-muted-foreground text-pretty">{content.footer.description}</p>
              </div>
              {content.footer.sections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {section.links.map((link) => (
                      <li key={link}>{link}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p dangerouslySetInnerHTML={{ __html: content.footer.copyright }} />
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  )
}

export default App
