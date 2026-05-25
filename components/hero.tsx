"use client"

import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/mainBackground.jpg"
          alt="حاتي الأصلي"
          fill
          className="object-cover"
          style={{ objectPosition: 'top center', top: '12%' }}
          priority
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full border-4 border-primary/30 overflow-hidden">
          <Image
            src="/logo_metaTitle.jpg"
            alt="حاتي الأصلي"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-primary-foreground mb-4 leading-tight">
          حاتي الأصلي
        </h1>
        <p className="text-primary-foreground/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
          أصل المشويات الشرقية الأصيلة
        </p>
      </div>
    </section>
  )
}
