"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById("menu")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/mainBackground.jpg"
          alt="مشويات الأصلي - أصل المشويات"
          fill
          className="object-cover"
          style={{ objectPosition: 'top center', top: '12%' }}
          priority
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <p className="text-secondary/90 uppercase tracking-[0.3em] text-sm md:text-base mb-4">
       مشويات الأصلي - أصل المشويات
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-card mb-6 leading-tight text-balance">
          تذوق طعم الشرق الأصيل
        </h1>
        <p className="text-secondary/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          اكتشف أصل المشويات  المصنوعة بحب وعناية،
          بأجود المكونات ووصفات تقليدية توارثناها عبر الأجيال.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#menu" onClick={scrollToMenu}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              تصفح القائمة
            </Button>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-card/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-card/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
