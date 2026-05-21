"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>المنوفية</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>مفتوح يومياً: ٨:٣٠ ص - ١١:٠٠ م</span>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              محل مشويات حاتي الأصلي
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("branches")} className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer bg-transparent border-none p-0">فروعنا</button>
            <button onClick={() => scrollToSection("menu")} className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer bg-transparent border-none p-0">القائمة</button>
            <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer bg-transparent border-none p-0">من نحن</button>
            <Button variant="outline" onClick={() => scrollToSection("contact")} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              تواصل معنا
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="فتح القائمة"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection("branches")} className="text-left text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none p-0">فروعنا</button>
              <button onClick={() => scrollToSection("menu")} className="text-left text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none p-0">القائمة</button>
              <button onClick={() => scrollToSection("about")} className="text-left text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none p-0">من نحن</button>
              <Button variant="outline" onClick={() => scrollToSection("contact")} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                تواصل معنا
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
