"use client"

import React, { useState } from "react"
import { Plus, ShoppingCart, Check, MessageCircle, Utensils, Package, Bike } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"

const branches = [
  { name: "فرع موقف مصر", phone: "201206170001" },
  { name: "فرع شبين الكوم", phone: "201061465200" },
]

const orderTypeOptions: Record<string, { id: string; name: string; icon: any }[]> = {
  "فرع موقف مصر": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
    { id: "delivery", name: "دليفرى", icon: Bike },
    { id: "dinein", name: "صالة", icon: Utensils },
  ],
  "فرع شبين الكوم": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
    { id: "delivery", name: "دليفرى", icon: Bike },
  ],
}

interface OrderButtonProps {
  itemName: string
  itemPrice: number
  variant?: "table" | "card"
}

export function OrderButton({ itemName, itemPrice, variant = "card" }: OrderButtonProps) {
  const { items, addItem, clearCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBranch, setShowBranch] = useState(false)
  const [showOrderType, setShowOrderType] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<{ name: string; phone: string } | null>(null)
  const [selectedOrderType, setSelectedOrderType] = useState<{ id: string; name: string } | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const id = `${itemName}-${itemPrice}`

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(id, itemName, itemPrice)

    const buttonEl = e.currentTarget
    const cartEl = document.getElementById("header-cart-btn")
    if (buttonEl && cartEl) {
      const buttonRect = buttonEl.getBoundingClientRect()
      const cartRect = cartEl.getBoundingClientRect()

      const size = 48
      const startX = buttonRect.left + buttonRect.width / 2 - size / 2
      const startY = buttonRect.top + buttonRect.height / 2 - size / 2
      const endX = cartRect.left + cartRect.width / 2 - size / 2
      const endY = cartRect.top + cartRect.height / 2 - size / 2

      const flyX = endX - startX
      const flyY = endY - startY

      const outerEl = document.createElement("div")
      outerEl.className = "fixed z-[9999] pointer-events-none animate-fly-x"
      outerEl.style.left = `${startX}px`
      outerEl.style.top = `${startY}px`
      outerEl.style.width = `${size}px`
      outerEl.style.height = `${size}px`
      outerEl.style.setProperty("--fly-x", `${flyX}px`)

      const innerEl = document.createElement("div")
      innerEl.className = "w-full h-full rounded-full bg-gradient-to-r from-[#C19A6B] to-[#F5E6D3] text-[#2B0003] font-display font-extrabold border-2 border-white shadow-[0_0_35px_#C19A6B,0_0_15px_#C19A6B,0_6px_16px_rgba(0,0,0,0.5)] flex items-center justify-center text-[18px] animate-fly-y"
      innerEl.style.setProperty("--fly-y", `${flyY}px`)
      innerEl.innerHTML = "+1"

      outerEl.appendChild(innerEl)
      document.body.appendChild(outerEl)

      outerEl.addEventListener("animationend", () => {
        outerEl.remove()
      })
    }

    setShowSuccess(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBranchSelect = (branch: { name: string; phone: string }) => {
    setSelectedBranch(branch)
    setShowBranch(false)
    setShowOrderType(true)
  }

  const handleOrderTypeSelect = (type: { id: string; name: string }) => {
    setSelectedOrderType(type)
    setShowOrderType(false)
    if (type.id === "dinein") {
      handleSendOrder(type.name, "", "", "")
    } else {
      setShowCustomerForm(true)
    }
  }

  const handleSendOrder = (orderType: string, name: string, address: string, phone: string) => {
    if (!selectedBranch) return
    const allItems = items.length > 0
      ? items.map((item) => `${item.quantity} ${item.name}`).join("\n")
      : `1 ${itemName}`
    const total = items.length > 0
      ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      : itemPrice

    let header = ""
    let footer = ""
    if (orderType === "تيك أواي") {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب استلام من ${selectedBranch.name}\nالاسم: ${name}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام؟`
    } else if (orderType === "دليفرى") {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب توصيل من ${selectedBranch.name}\nالاسم: ${name}\nالعنوان: ${address}\nرقم التليفون: ${phone}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام وسعر التوصيل كام؟`
    } else {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب صالة من ${selectedBranch.name}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام؟`
    }

    const message = `${header}\n\nالطلب:\n${allItems}${footer}`
    window.open(`https://wa.me/${selectedBranch.phone}?text=${encodeURIComponent(message)}`, "_blank")
    setShowCustomerForm(false)
    setShowOrderType(false)
    setShowSuccess(false)
    setSelectedBranch(null)
    setSelectedOrderType(null)
    setCustomerName("")
    setCustomerAddress("")
    setCustomerPhone("")
    clearCart()
  }

  const button = variant === "table" ? (
    <button
      onClick={handleAdd}
      className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      أضف
    </button>
  ) : (
    <Button
      onClick={handleAdd}
      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 rounded-lg"
      size="sm"
    >
      <ShoppingCart className="w-4 h-4" />
      أضف إلى السلة
    </Button>
  )

  return (
    <>
      {button}

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent dir="rtl" className="sm:max-w-[380px]">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="font-display text-2xl text-foreground mb-1">
              تمت الإضافة بنجاح ✓
            </DialogTitle>
            <p className="text-muted-foreground text-sm mb-6">{itemName}</p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => { setShowSuccess(false); setShowBranch(true) }}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 h-12 text-base rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
                إرسال الطلب إلى المطعم
              </Button>
              <Button
                onClick={() => setShowSuccess(false)}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12 text-base rounded-lg"
              >
                أضف المزيد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBranch} onOpenChange={setShowBranch}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر الفرع المطلوب</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {branches.map((branch) => (
              <Button
                key={branch.phone}
                onClick={() => handleBranchSelect(branch)}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-base rounded-lg"
              >
                {branch.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderType} onOpenChange={(o) => { setShowOrderType(o); if (!o) setSelectedBranch(null) }}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر نوع الطلب</DialogTitle>
            {selectedBranch && (
              <p className="text-center text-muted-foreground text-sm mt-1">{selectedBranch.name}</p>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {(selectedBranch ? (orderTypeOptions[selectedBranch.name] || []) : []).map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  onClick={() => handleOrderTypeSelect(type)}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-14 text-base rounded-lg gap-3"
                >
                  <Icon className="w-5 h-5" />
                  {type.name}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomerForm} onOpenChange={(o) => { setShowCustomerForm(o); if (!o) { setSelectedOrderType(null); setSelectedBranch(null) } }}>
        <DialogContent dir="rtl" className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">
              {selectedOrderType?.id === "delivery" ? "بيانات التوصيل" : "بيانات العميل"}
            </DialogTitle>
            {selectedBranch && selectedOrderType && (
              <p className="text-center text-muted-foreground text-sm mt-1">
                {selectedBranch.name} - {selectedOrderType.name}
              </p>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">الاسم</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسمك"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {selectedOrderType?.id === "delivery" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">العنوان</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="أدخل عنوان التوصيل"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">رقم التواصل</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="أدخل رقم الهاتف"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  * سعر التوصيل منفصل عن سعر الأوردر
                </p>
              </>
            )}
            <Button
              onClick={() => {
                if (selectedOrderType) {
                  handleSendOrder(selectedOrderType.name, customerName, customerAddress, customerPhone)
                }
              }}
              disabled={
                !customerName.trim() ||
                (selectedOrderType?.id === "delivery" && (!customerAddress.trim() || !customerPhone.trim()))
              }
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-base rounded-lg mt-2"
            >
              <MessageCircle className="w-5 h-5" />
              إرسال عبر واتساب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
