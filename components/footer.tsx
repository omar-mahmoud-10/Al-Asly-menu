"use client"

import Image from "next/image"
import { MapPin, Store, Phone, PhoneCall } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact">
      <div className="bg-foreground text-card py-5 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Image
            src="/logo.jpg"
            alt="حاتي الأصلي"
            width={120}
            height={120}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-2 border-primary/20 mb-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
            <div className="text-center sm:text-right">
              <p className="font-bold text-card mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                <Store className="w-4 h-4 text-primary shrink-0" /> الفرع الأول: بركة السبع غرب
              </p>
              <p className="text-card/70 text-xs flex items-center justify-center sm:justify-start gap-1 mb-1.5">
                <MapPin className="w-3 h-3 shrink-0" /> بركة السبع غرب - طريق شبين الكوم
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span dir="ltr" className="text-xs text-card/70">01061465200</span>
                <a href="tel:01061465200" className="text-[10px] flex items-center gap-0.5 bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-full transition-colors">
                  <PhoneCall className="w-2.5 h-2.5" /> اتصال
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span dir="ltr" className="text-xs text-card/70">01279547317</span>
                <a href="tel:01279547317" className="text-[10px] flex items-center gap-0.5 bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-full transition-colors">
                  <PhoneCall className="w-2.5 h-2.5" /> اتصال
                </a>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="font-bold text-card mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                <Store className="w-4 h-4 text-primary shrink-0" /> الفرع الثاني: بركة السبع شرق
              </p>
              <p className="text-card/70 text-xs flex items-center justify-center sm:justify-start gap-1 mb-1.5">
                <MapPin className="w-3 h-3 shrink-0" /> بركة السبع شرق - موقف مصر
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span dir="ltr" className="text-xs text-card/70">0482991771</span>
                <a href="tel:0482991771" className="text-[10px] flex items-center gap-0.5 bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-full transition-colors">
                  <PhoneCall className="w-2.5 h-2.5" /> اتصال
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span dir="ltr" className="text-xs text-card/70">01206170001</span>
                <a href="tel:01206170001" className="text-[10px] flex items-center gap-0.5 bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-full transition-colors">
                  <PhoneCall className="w-2.5 h-2.5" /> اتصال
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-card/50 text-[10px] mt-3 border-t border-card/10 pt-2 w-full">
            جميع أيام الأسبوع ٨:٣٠ ص - ١١:٠٠ م
          </div>
        </div>
      </div>
    </footer>
  )
}
