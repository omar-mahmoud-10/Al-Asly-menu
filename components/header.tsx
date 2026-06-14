"use client"

import { Facebook, Instagram } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.69 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.06A6.34 6.34 0 0 0 3.23 15.5a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.75a8.26 8.26 0 0 0 4.78 1.48v-3.5a4.83 4.83 0 0 1-1.1-.04z" />
    </svg>
  )
}

export function Header() {
  return (
    <header className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
            <a
              href="https://www.facebook.com/ElaslyResturant/?locale=ar_AR&_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300"
              aria-label="فيسبوك"
            >
              <Facebook className="w-6 h-6 sm:w-8 sm:h-8" />
            </a>
            <a
              href="https://www.instagram.com/elasly_resturant_/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300"
              aria-label="انستغرام"
            >
              <Instagram className="w-6 h-6 sm:w-8 sm:h-8" />
            </a>
            <a
              href="https://www.tiktok.com/@alaslyrestaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300"
              aria-label="تيك توك"
            >
              <TikTokIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </a>
            <CartSheet />
        </div>
      </div>
    </header>
  )
}
