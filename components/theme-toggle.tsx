"use client"

import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-muted border border-border p-0 transition-colors hover:bg-muted/80"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background border border-border transition-transform duration-200 ease-in-out flex items-center justify-center ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? <Moon className="h-3 w-3 text-foreground" /> : <Sun className="h-3 w-3 text-foreground" />}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
