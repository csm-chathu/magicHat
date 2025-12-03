import React, { useCallback } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeAwareLogo } from "@/components/theme-aware-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import content from "@/lib/content.json"
import HomePage from "./pages/Home"
import WorkPage from "./pages/Work"
import { Menu } from "lucide-react"

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        if (location.pathname !== "/") {
          navigate("/", { state: { scrollTo: href } })
        } else {
          const element = document.querySelector(href)
          element?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        return
      }

      if (href === "/") {
        if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
          navigate("/")
        }
        return
      }

      navigate(href)
    },
    [location.pathname, navigate],
  )

  const renderNavButton = (href: string, label: string) => (
    <button
      key={href}
      type="button"
      onClick={() => handleNavigation(href)}
      className="text-muted-foreground transition-colors hover:text-accent"
    >
      {label}
    </button>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => handleNavigation("/")} className="flex items-center gap-2">
              <ThemeAwareLogo alt={content.site.title} height={64} />
            </button>
            <div className="hidden items-center gap-8 md:flex">
              {content.navigation.links.map((link) => renderNavButton(link.href, link.label))}
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <Button
                variant="outline"
                className="hidden bg-transparent md:inline-flex"
                onClick={() => handleNavigation("/work")}
              >
                Get Started
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="gap-0 px-0">
                  <div className="px-4 pb-4 pt-6">
                    <ThemeAwareLogo alt={content.site.title} height={36} />
                  </div>
                  <nav className="flex flex-col gap-3 border-t border-border px-4 py-6">
                    {content.navigation.links.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <button
                          type="button"
                          onClick={() => handleNavigation(link.href)}
                          className="text-left text-lg font-medium text-foreground transition-colors hover:text-accent"
                        >
                          {link.label}
                        </button>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto px-4 pb-6">
                    <SheetClose asChild>
                      <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => handleNavigation("/work")}>
                        Get Started
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
