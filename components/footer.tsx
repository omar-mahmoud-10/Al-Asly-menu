"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin, Clock, Facebook, Instagram, Store, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
  const [isOpenHours, setIsOpenHours] = useState<boolean>(() => {
    const now = new Date()
    const time = now.getHours() + now.getMinutes() / 60
    const start = 8 + 30 / 60
    const end = 23
    return time >= start && time < end
  })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsApp = (phone: string) => {
    const message = "مرحبا، أود الاستفسار عن الطلب"
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const PhoneDisplay = ({ phone }: { phone: string }) => (
    <div className="flex gap-1.5 items-center flex-wrap w-full">
      <span dir="ltr" className="text-sm font-medium whitespace-nowrap">{phone}</span>
      {isOpenHours && (
        <>
          <Button
            size="sm"
            className="h-6 text-xs px-2 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 gap-1"
            onClick={() => handleCall(phone)}
            title="اتصل الآن"
          >
            <Phone className="w-3 h-3" />
            <span>اتصل بنا</span>
          </Button>
          <Button
            size="sm"
            className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700 text-white flex-shrink-0 gap-1"
            onClick={() => handleWhatsApp(phone)}
            title="واتساب"
          >
            <Send className="w-3 h-3" />
            <span>واتس</span>
          </Button>
        </>
      )}
    </div>
  )

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const time = now.getHours() + now.getMinutes() / 60
      const start = 8 + 30 / 60
      const end = 23
      setIsOpenHours(time >= start && time < end)
    }

    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer id="contact">
      <div className="relative bg-card py-12 zigzag-divider-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/ElaslyResturant/?locale=ar_AR&_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo_metaTitle.jpg"
                alt="حاتي الأصلي"
                width={80}
                height={80}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-primary/20"
              />
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/elasly_resturant_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-foreground text-card py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" id="branches">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <h3 className="font-display text-3xl mb-4">حاتي الأصلي</h3>
              <p className="text-card/70 text-sm leading-relaxed mb-4 font-sans">
                أصل المشوي | كبابجي
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/elasly_resturant_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                  aria-label="انستغرام"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://web.facebook.com/ElaslyResturant/?locale=ar_AR&_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                  aria-label="فيسبوك"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display text-2xl mb-4">فروعنا</h4>
              <div className="space-y-6">
                <div className="text-card/70">
                  <p className="font-medium text-card mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" /> فرع شبين الكرم
                  </p>
                  <p className="text-sm flex items-center gap-2 mb-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> 
                    <PhoneDisplay phone="0482993095" />
                  </p>
                  <p className="text-sm flex items-center gap-2 mb-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> 
                    <PhoneDisplay phone="01279547317" />
                  </p>
                  <p className="text-sm flex items-center gap-2 mb-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> 
                    <PhoneDisplay phone="01061465200" />
                  </p>
                  <p className="text-sm flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" /> 
                    بركة السبع غرب - شارع جمال عبدالناصر (طريق شبين الكرم)
                  </p>
                </div>
                <div className="text-card/70">
                  <p className="font-medium text-card mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" /> فرع موقف مصر
                  </p>
                  <p className="text-sm flex items-center gap-2 mb-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> 
                    <PhoneDisplay phone="0482991771" />
                  </p>
                  <p className="text-sm flex items-center gap-2 mb-1">
                    <Phone className="w-3 h-3 flex-shrink-0" /> 
                    <PhoneDisplay phone="01206170001" />
                  </p>
                  <p className="text-sm flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" /> 
                    بركة السبع شرق - موقف مصر
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display text-2xl mb-4">روابط سريعة</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#menu" onClick={(e) => scrollToSection(e, "menu")} className="text-card/70 hover:text-card transition-colors cursor-pointer font-sans">
                    قائمة المشويات
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-card/70 hover:text-card transition-colors cursor-pointer font-sans">
                    من نحن
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowDelivery(true)}
                    className="text-card/70 hover:text-card transition-colors cursor-pointer font-sans"
                  >
                    خدمة التوصيل
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-2xl mb-4">ساعات العمل</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-card/70">
                  <Clock className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-card">جميع أيام الأسبوع</p>
                    <p className="font-sans">٨:٣٠ ص - ١١:٠٠ م</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDelivery} onOpenChange={setShowDelivery}>
        <DialogContent dir="rtl" className="max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-center">أسعار التوصيل</DialogTitle>
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
