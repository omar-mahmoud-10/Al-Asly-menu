"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, Package, Bike, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"
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

export function CartSheet() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, cartOpen, openCart, closeCart } = useCart()
  const [showBranchDialog, setShowBranchDialog] = useState(false)
  const [showOrderTypeDialog, setShowOrderTypeDialog] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<{ name: string; phone: string } | null>(null)
  const [selectedOrderType, setSelectedOrderType] = useState<{ id: string; name: string } | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [shouldWiggle, setShouldWiggle] = useState(false)
  const [sending, setSending] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [savedCustomer, setSavedCustomer] = useState<{ name: string; address: string; phone: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (totalItems > 0) {
      setShouldWiggle(true)
      const timer = setTimeout(() => setShouldWiggle(false), 600)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

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

  const buildMessage = (branchName: string, orderType: string, name: string, address: string, phone: string) => {
    const lines = items.map(
      (item, i) => `${i + 1}- ${item.name} × ${item.quantity} = ${item.price * item.quantity} جنيه`
    )
    const total = `المجموع: ${totalPrice} جنيه`

    const paymentLine = selectedPayment === "instapay" ? "\nطريقة الدفع: انستا باي" : ""
    let header = ""
    if (orderType === "تيك أواي") {
      header = `السلام عليكم ورحمة الله وبركاته\nعاوز أطلب استلام من ${branchName}\nالاسم: ${name}${paymentLine}`
    } else if (orderType === "دليفرى") {
      header = `السلام عليكم ورحمة الله وبركاته\nعاوز أطلب توصيل من ${branchName}\nالاسم: ${name}\nالعنوان: ${address}\nرقم التليفون: ${phone}${paymentLine}`
    } else {
      header = `السلام عليكم ورحمة الله وبركاته\nعاوز أطلب صالة من ${branchName}${paymentLine}`
    }

    const footer = orderType === "دليفرى" ? `\n\n${total}\n\nيا ريت تقولي سعر التوصيل كام عشان أحسبه مع الفاتورة؟` : `\n\n${total}`

    return `${header}\n\nالأوردر:\n${lines.join("\n")}${footer}`
  }

  const handleBranchSelect = (branch: { name: string; phone: string }) => {
    setSelectedBranch(branch)
    setShowBranchDialog(false)
    setShowOrderTypeDialog(true)
  }

  const handleOrderTypeSelect = (type: { id: string; name: string }) => {
    setSelectedOrderType(type)
    setShowOrderTypeDialog(false)
    setShowCustomerForm(true)
    setSelectedPayment("cash")
  }

  const saveOrderToDB = useCallback(async (orderType: string, name: string, address: string, phone: string) => {
    if (!selectedBranch) return
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          totalPrice,
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
  }, [selectedBranch, items, totalPrice, toast])

  const handleSendOrder = (orderType: string, name: string, address: string, phone: string) => {
    if (!selectedBranch || sending) return
    setSending(true)
    const message = buildMessage(selectedBranch.name, orderType, name, address, phone)
    window.open(`https://wa.me/${selectedBranch.phone}?text=${encodeURIComponent(message)}`, "_blank")
    saveOrderToDB(orderType, name, address, phone).finally(() => setSending(false))
    if (name) localStorage.setItem("customerData", JSON.stringify({ name, address, phone }))
    setShowCustomerForm(false)
    setShowOrderTypeDialog(false)
    setShowPayment(false)
    setShowBranchDialog(false)
    closeCart()
    setSelectedBranch(null)
    setSelectedOrderType(null)
    setSelectedPayment(null)
    setCustomerName("")
    setCustomerAddress("")
    setCustomerPhone("")
    clearCart()
  }

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={(o) => (o ? openCart() : closeCart())}>
        <SheetTrigger asChild>
          <button
            id="header-cart-btn"
            className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300 cursor-pointer ${
              shouldWiggle ? "animate-cart-bounce" : ""
            }`}
          >
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10" />
            {totalItems > 0 && (
              <Badge className={`absolute -top-1.5 -right-1.5 sm:-top-1.5 sm:-right-1.5 h-5 min-w-5 sm:h-7 sm:min-w-7 px-1 sm:px-1.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] sm:text-[13px] font-extrabold shadow-md border-[1.5px] sm:border-2 border-white ${
                shouldWiggle ? "animate-badge-pop" : ""
              }`}>
                {totalItems}
              </Badge>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md bg-background border-border">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl text-foreground text-right">سلة الطلبات</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">السلة فارغة</p>
              <p className="text-sm">أضف أصنافاً لبدء الطلب</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-foreground font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price} جنيه</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-sans text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 pb-6 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="font-sans text-foreground">الإجمالي</span>
                  <span className="font-display text-xl text-primary">{totalPrice} جنيه</span>
                </div>
                <Button
                  onClick={() => setShowBranchDialog(true)}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 h-12 text-base rounded-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  إرسال الطلب إلى المطعم
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
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

      <Dialog open={showOrderTypeDialog} onOpenChange={(o) => { setShowOrderTypeDialog(o); if (!o) setSelectedBranch(null) }}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر نوع الطلب</DialogTitle>
            {selectedBranch && (
              <p className="text-center text-muted-foreground text-sm mt-1">{selectedBranch.name}</p>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {(selectedBranch ? orderTypeOptions[selectedBranch.name] : []).map((type) => {
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
                onClick={() => { setCustomerName(savedCustomer.name); setCustomerAddress(savedCustomer.address); setCustomerPhone(savedCustomer.phone) }}
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
                (selectedOrderType?.id === "delivery" && (!customerAddress.trim() || !customerPhone.trim()))
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
