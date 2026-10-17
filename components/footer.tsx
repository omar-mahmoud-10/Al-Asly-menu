"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone, Clock, Store, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [showContact, setShowContact] = useState(false)
  return (
    <footer className="bg-card border-t border-border py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/logo.jpg"
            alt="حاتي الأصلي"
            width={120}
            height={120}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-primary/20 mb-3"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
              <Store className="w-4 h-4" /> فروعنا
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-foreground mb-0.5">الفرع الأول: بركة السبع غرب</p>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-0.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span dir="ltr">01061465200</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-0.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span dir="ltr">01279547317</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-1 shrink-0" />
                  طريق شبين الكوم
                </p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-0.5">الفرع الثاني: بركة السبع شرق</p>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-0.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span dir="ltr">0482991771</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mb-0.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span dir="ltr">01206170001</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-1 shrink-0" />
                  موقف مصر
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> ساعات العمل
            </h3>
            <p className="font-bold text-foreground">جميع أيام الأسبوع</p>
            <p className="text-muted-foreground">٩ صباحاً - ٥ فجراً</p>
          </div>
        </div>

        <div className="border-t border-border/50 mt-5 pt-4 text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            صنع بواسطة عمر محمود{" "}
            <button
              type="button"
              dir="ltr"
              onClick={() => setShowContact(true)}
              aria-label="طرق التواصل مع عمر محمود"
              className="font-medium text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid transition-colors"
            >
              +201090862740
            </button>
          </p>
        </div>
      </div>

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent dir="rtl" className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-xl">عمر محمود</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-muted-foreground text-sm text-center">للتواصل مع المطور</p>
            <div className="flex items-center gap-3 w-full bg-muted/50 rounded-lg px-4 py-3">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span dir="ltr" className="text-foreground text-sm">+201090862740</span>
            </div>
            <Button asChild className="w-full gap-2 h-11 rounded-lg">
              <a href="tel:+201090862740" onClick={() => setShowContact(false)}>
                <Phone className="w-4 h-4" />
                اتصال هاتفي
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2 h-11 rounded-lg">
              <a
                href="https://wa.me/201090862740"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowContact(false)}
              >
                <MessageCircle className="w-4 h-4" />
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
