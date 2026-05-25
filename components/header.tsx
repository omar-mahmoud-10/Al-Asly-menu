"use client"

import { Facebook, Instagram } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.facebook.com/ElaslyResturant/?locale=ar_AR&_rdc=1&_rdr#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300"
            aria-label="فيسبوك"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/elasly_resturant_/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300"
            aria-label="انستغرام"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>
      </div>
    </header>
  )
}
