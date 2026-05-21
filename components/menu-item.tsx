"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart } from "lucide-react"

interface MenuItemProps {
  name: string
  description: string
  price: number
  image?: string
}

export function MenuItem({ name, description, price, image }: MenuItemProps) {
  const [showBranchDialog, setShowBranchDialog] = useState(false)

  const handleOrderWithBranch = (branchPhone: string, branchName: string) => {
    const message = `أود أن أطلب: ${name} بسعر ${price} جنيه من ${branchName}`
    const whatsappUrl = `https://wa.me/${branchPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowBranchDialog(false)
  }

  return (
    <>
      <Card className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">لا توجد صورة</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-xl font-semibold text-foreground">{name}</h3>
            <span className="font-serif text-xl font-bold text-primary whitespace-nowrap">
              {price} جنيه
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">{description}</p>
          <Button
            onClick={() => setShowBranchDialog(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4" />
            اطلب الآن
          </Button>
        </div>
      </Card>

      {/* Branch Selection Dialog */}
      <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-serif">
              اختر الفرع المطلوب
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              onClick={() => handleOrderWithBranch("201206170001", "فرع موقف مصر")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            >
              فرع موقف مصر
            </Button>
            <Button
              onClick={() => handleOrderWithBranch("201061465200", "فرع شبين")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            >
             فرع موقف شبين
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
