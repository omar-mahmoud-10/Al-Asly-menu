"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Plus, ShoppingCart, Check, MessageCircle, Utensils, Package, Bike } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

const branches = [
  { name: "فرع موقف مصر", phone: "201206170001" },
  { name: "فرع موقف شبين", phone: "201061465200" },
]

const orderTypeOptions: Record<string, { id: string; name: string; icon: any }[]> = {
  "فرع موقف مصر": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
    { id: "delivery", name: "دليفرى", icon: Bike },
    { id: "dinein", name: "صالة", icon: Utensils },
  ],
  "فرع موقف شبين": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
    { id: "delivery", name: "دليفرى", icon: Bike },
    { id: "dinein", name: "صالة", icon: Utensils },
  ],
}

interface PriceOption {
  label: string
  price: number
}

interface OrderButtonProps {
  itemName: string
  itemPrice: number
  variant?: "table" | "card"
  priceOptions?: PriceOption[]
}

export function OrderButton({ itemName, itemPrice, variant = "card", priceOptions }: OrderButtonProps) {
  const { items, addItem, clearCart } = useCart()
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBranch, setShowBranch] = useState(false)
  const [showOrderType, setShowOrderType] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<{ name: string; phone: string } | null>(null)
  const [selectedOrderType, setSelectedOrderType] = useState<{ id: string; name: string } | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerGuests, setCustomerGuests] = useState("")
  const [customerArrivalTime, setCustomerArrivalTime] = useState("")
  const timeInputRef = useRef<HTMLInputElement>(null)
  const [lastOption, setLastOption] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [savedCustomer, setSavedCustomer] = useState<{ name: string; address: string; phone: string; guests?: string; arrivalTime?: string } | null>(null)
  const id = `${itemName}-${itemPrice}`

  useEffect(() => {
    if (showCustomerForm) {
      const saved = localStorage.getItem("customerData")
      if (saved) {
        try { setSavedCustomer(JSON.parse(saved)) } catch { setSavedCustomer(null) }
      } else {
        setSavedCustomer(null)
      }
    }
  }, [showCustomerForm])

  const triggerFlyAnimation = (buttonEl: HTMLElement | null) => {
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
  }

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem(id, itemName, itemPrice)
    triggerFlyAnimation(e.currentTarget)
    setLastOption(null)
    setShowSuccess(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddOption = (label: string, price: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const optionId = `${itemName}-${label}`
    const optionName = `${itemName} (${label})`
    addItem(optionId, optionName, price)
    triggerFlyAnimation(e.currentTarget)
    setLastOption(label)
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
    setShowCustomerForm(true)
    setSelectedPayment("cash")
  }

  const saveOrderToDB = useCallback(async (orderType: string, name: string, address: string, phone: string) => {
    if (!selectedBranch) return
    const orderItems = items.length > 0
      ? items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
      : [{ id, name: itemName, price: itemPrice, quantity: 1 }]
    const total = items.length > 0
      ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      : itemPrice
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          totalPrice: total,
          branch: selectedBranch.name,
          branchPhone: selectedBranch.phone,
          orderType,
          customerName: name,
          customerAddress: address,
          customerPhone: phone,
          status: 'pending',
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.details || errData.error || 'فشل حفظ الطلب')
      }
      toast({ title: 'تم حفظ الطلب', description: 'يمكنك متابعة الطلبات من لوحة التحكم' })
    } catch (err) {
      console.error('Failed to save order:', err)
      toast({ title: 'فشل حفظ الطلب', description: 'حدث خطأ أثناء حفظ الطلب، برجاء المحاولة مرة أخرى', variant: 'destructive' })
    }
  }, [selectedBranch, items, itemName, itemPrice, id, toast])

  const handleSendOrder = (orderType: string, name: string, address: string, phone: string) => {
    if (!selectedBranch || sending) return
    setSending(true)
    const allItems = items.length > 0
      ? items.map((item) => `${item.quantity} ${item.name}`).join("\n")
      : `1 ${itemName}`
    const total = items.length > 0
      ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      : itemPrice

    const paymentLine = selectedPayment === "instapay" ? "\nطريقة الدفع: انستا باي" : ""
    let header = ""
    let footer = ""
    if (orderType === "تيك أواي") {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب استلام من ${selectedBranch.name}\nالاسم: ${name}${paymentLine}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام؟`
    } else if (orderType === "دليفرى") {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب توصيل من ${selectedBranch.name}\nالاسم: ${name}\nالعنوان: ${address}\nرقم التليفون: ${phone}${paymentLine}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام وسعر التوصيل كام؟`
    } else {
      header = `السلام عليكم ورحمة الله وبركاته،\nعاوز أطلب صالة من ${selectedBranch.name}\nالاسم: ${name}\nرقم التليفون: ${phone}\nعدد الأفراد: ${customerGuests}\nوقت الوصول: ${customerArrivalTime}${paymentLine}`
      footer = `\n\nالمجموع: ${total} جنيه\nيا ريت تأكديلي سعر الأوردر كام؟`
    }

    const message = `${header}\n\nالطلب:\n${allItems}${footer}`
    window.open(`https://wa.me/${selectedBranch.phone}?text=${encodeURIComponent(message)}`, "_blank")
    saveOrderToDB(orderType, name, address, phone).finally(() => setSending(false))
    if (name) localStorage.setItem("customerData", JSON.stringify({ name, address, phone, guests: customerGuests, arrivalTime: customerArrivalTime }))
    setShowCustomerForm(false)
    setShowOrderType(false)
    setShowPayment(false)
    setShowSuccess(false)
    setSelectedBranch(null)
    setSelectedOrderType(null)
    setSelectedPayment(null)
    setCustomerName("")
    setCustomerAddress("")
    setCustomerPhone("")
    setCustomerGuests("")
    setCustomerArrivalTime("")
    clearCart()
  }

  const button = priceOptions && variant === "table" ? (
    <div className="flex flex-wrap gap-2 justify-center">
      {priceOptions.map((opt) => (
        <button
          key={opt.label}
          onClick={(e) => handleAddOption(opt.label, opt.price, e)}
          className="inline-flex flex-col items-center border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer min-w-[60px]"
        >
          <span>{opt.label}</span>
          <span className="text-[11px] opacity-80">{opt.price} ج</span>
        </button>
      ))}
    </div>
  ) : variant === "table" ? (
    <button
      onClick={handleAdd}
      className="inline-flex items-center gap-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-[17px] py-2.5 rounded-lg text-sm font-sans font-medium transition-colors cursor-pointer"
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
            <p className="text-muted-foreground text-sm mb-6">{lastOption ? `${itemName} (${lastOption})` : itemName}</p>
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

      <Dialog open={showCustomerForm} onOpenChange={(o) => { setShowCustomerForm(o); if (!o) { setSelectedOrderType(null); setSelectedBranch(null); setSelectedPayment(null) } }}>
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
            {savedCustomer && (
              <button
                onClick={() => { setCustomerName(savedCustomer.name); setCustomerAddress(savedCustomer.address); setCustomerPhone(savedCustomer.phone); setCustomerGuests(savedCustomer.guests || ""); setCustomerArrivalTime(savedCustomer.arrivalTime || "") }}
                className="w-full border-2 border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 h-10 text-sm rounded-lg font-medium transition-colors cursor-pointer"
              >
                استعادة بياناتي المحفوظة
              </button>
            )}
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
            {selectedOrderType?.id === "dinein" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">رقم التليفون</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="أدخل رقم الهاتف"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">عدد الأفراد</label>
                  <input
                    type="number"
                    value={customerGuests}
                    onChange={(e) => setCustomerGuests(e.target.value)}
                    placeholder="مثلاً: 4"
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">وقت الوصول</label>
                  <input
                    ref={timeInputRef}
                    type="time"
                    value={customerArrivalTime}
                    onChange={(e) => setCustomerArrivalTime(e.target.value)}
                    onClick={(e) => { if (typeof (e.target as HTMLInputElement).showPicker === 'function') { (e.target as HTMLInputElement).showPicker() } }}
                    step="60"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}
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
            <div className="border-t border-border pt-3">
              <label className="block text-sm font-medium text-foreground mb-2">طريقة الدفع</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPayment("cash")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                    selectedPayment === "cash"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  نقدا
                </button>
                <button
                  onClick={() => setSelectedPayment("instapay")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                    selectedPayment === "instapay"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  انستا باي
                </button>
              </div>
            </div>
            <Button
              onClick={() => {
                if (selectedOrderType) {
                  handleSendOrder(selectedOrderType.name, customerName, customerAddress, customerPhone)
                }
              }}
              disabled={
                sending ||
                !customerName.trim() ||
                (selectedOrderType?.id === "delivery" && (!customerAddress.trim() || !customerPhone.trim())) ||
                (selectedOrderType?.id === "dinein" && (!customerPhone.trim() || !customerGuests.trim() || !customerArrivalTime.trim()))
              }
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-base rounded-lg mt-2 disabled:opacity-50"
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
