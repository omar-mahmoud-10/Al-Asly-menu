import Image from "next/image"
import { MapPin, Phone, Clock, Store } from "lucide-react"

export function Footer() {
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

        <div className="border-t border-border/50 mt-5 pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} حاتي الأصلي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
