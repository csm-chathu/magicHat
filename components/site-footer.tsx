import React from "react"

import { ScrollReveal } from "@/components/scroll-reveal"
import content from "@/lib/content.json"

function SiteFooter() {
  return (
    <ScrollReveal>
      <footer className="border-t border-border px-4 py-12">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="font-serif text-2xl font-bold text-foreground mb-4">
                {content.site.title}
              </div>
              <p className="text-muted-foreground text-pretty">
                {content.footer.description}
              </p>
            </div>
            {content.footer.sections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {section.links.map((link: string) => (
                    <li key={link}>{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground space-y-2">
            <p dangerouslySetInnerHTML={{ __html: content.footer.copyright }} />
            <p>
              Designed by{" "}
              <a
                href="http://lmuc-innovations.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                lmuc-innovations.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  )
}

export default SiteFooter
