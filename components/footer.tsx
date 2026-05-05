"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, MapPin, Clock, Facebook, Instagram, Store } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const deliveryPrices = [
  { area: "بركة السبع", price: "١٥ جنيهاً" },
  { area: "كفر عليم", price: "٣٠ جنيهاً" },
  { area: "هورين", price: "٤٠ جنيهاً" },
  { area: "الحلامشة", price: "٥٠ جنيهاً" },
  { area: "الحاج داود", price: "٥٠ جنيهاً" },
  { area: "الروضة", price: "٣٥ جنيهاً" },
  { area: "الشهيد فكري", price: "٤٠ جنيهاً", bookingPrice: "داخل البلد ٤٥ جنيهاً" },
  { area: "جنزور", price: "٥٠ جنيهاً" },
  { area: "أبو مشهور", price: "٥٠ جنيهاً" },
  { area: "الغوري", price: "٣٥ جنيهاً" },
  { area: "كفر مليج", price: "٥٠ جنيهاً" },
  { area: "مليج", price: "٥٠ جنيهاً" },
  { area: "شنتنا الحجر", price: "٣٥ جنيهاً" },
  { area: "ميت أم صالح", price: "٤٥ جنيهاً" },
  { area: "ميت فارس", price: "٤٥ جنيهاً" },
  { area: "كفر هورين", price: "٤٠ جنيهاً" },
  { area: "طوخ طنبشا", price: "٤٠ جنيهاً" },
  { area: "طنبشا", price: "٤٥ جنيهاً" },
  { area: "الدبابية", price: "٤٥ جنيهاً" },
  { area: "عزبة راتب", price: "٤٠ جنيهاً" },
  { area: "كفر الحمادية", price: "٤٥ جنيهاً" },
  { area: "كفر نفرة", price: "٦٠ جنيهاً" },
  { area: "الجعفرية", price: "٨٥ جنيهاً" },
  { area: "مصطاي", price: "٨٥ جنيهاً" },
  { area: "الرمالي", price: "٨٠ جنيهاً" },
  { area: "كفر هلال", price: "٩٠ جنيهاً" },
  { area: "حنون", price: "٩٠ جنيهاً" },
  { area: "قويسنا", price: "١٠٠ جنيهاً", bookingPrice: "سعر الحجز ٦٥ جنيهاً" },
  { area: "شبين الكوم", price: "١٠٠ جنيهاً", bookingPrice: "سعر الحجز ٦٥ جنيهاً" },
  { area: "طنطا", price: "١٥٠ جنيهاً", bookingPrice: "سعر الحجز ٩٠ جنيهاً" },
  { area: "بنها", price: "١٧٠ جنيهاً", bookingPrice: "سعر الحجز ٩٠ جنيهاً" },
]

export function Footer() {
  const [showDelivery, setShowDelivery] = useState(false)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer id="contact" className="bg-foreground text-card py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div id="branches" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4">سلسلة متاجر حلويات ياقوت</h3>
            <p className="text-card/70 text-sm leading-relaxed mb-4">
              اهلاً بك في حلويات ياقوت ❤️ نقدم أشهى الحلويات الشرقية الأصيلة في المنوفية.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/yakootsweet/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                aria-label="انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://web.facebook.com/YakootSweet/?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                aria-label="فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">فروعنا</h4>
            <div className="space-y-6">
              <div className="text-card/70">
                <p className="font-medium text-card mb-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" /> فرع بركة السبع
                </p>
                <p className="text-sm flex items-center gap-2 mb-1">
                  <Phone className="w-3 h-3 flex-shrink-0" /> 
                  <span dir="ltr">048/2991500</span>
                </p>
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-1 flex-shrink-0" /> 
                  شارع عبد المنعم رياض بجوار موقف مصر
                </p>
              </div>
              <div className="text-card/70">
                <p className="font-medium text-card mb-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" /> فرع قويسنا
                </p>
                <p className="text-sm flex items-center gap-2 mb-1">
                  <Phone className="w-3 h-3 flex-shrink-0" /> 
                  <span dir="ltr">048/2573777</span>
                </p>
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-1 flex-shrink-0" /> 
                  شارع الجيش مقابل أبو عميرة للمشويات
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <a href="#menu" onClick={(e) => scrollToSection(e, "menu")} className="text-card/70 hover:text-card transition-colors cursor-pointer">
                  قائمة الحلويات
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-card/70 hover:text-card transition-colors cursor-pointer">
                  من نحن
                </a>
              </li>
              <li>
                <button
                  onClick={() => setShowDelivery(true)}
                  className="text-card/70 hover:text-card transition-colors cursor-pointer"
                >
                  خدمة التوصيل
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-card/70">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span>المنوفية، مصر</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">ساعات العمل</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-card/70">
                <Clock className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="font-medium text-card">جميع أيام الأسبوع</p>
                  <p>٨:٣٠ ص - ١١:٠٠ م</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card/10 pt-8 text-center">
          <p className="text-card/50 text-sm">
            &copy; {new Date().getFullYear()} سلسلة متاجر حلويات ياقوت. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* Delivery Dialog */}
      <Dialog open={showDelivery} onOpenChange={setShowDelivery}>
        <DialogContent dir="rtl" className="max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">أسعار التوصيل</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm text-primary text-center mb-4">
            <span className="font-semibold">حجز:</span> المندوب يحجز الطلب وينتظر لحين استلام طلب إضافي ذاهب لنفس المكان، ثم ينطلق.
          </div>
          <div className="space-y-2 mt-4">
            {deliveryPrices.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <span className="font-medium">{item.area}</span>
                <span className="text-primary font-semibold">
                  {item.price}
                  {item.bookingPrice && <span className="text-xs text-muted-foreground mr-2">({item.bookingPrice})</span>}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
